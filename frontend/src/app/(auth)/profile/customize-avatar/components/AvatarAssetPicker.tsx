"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import GLBViewer, { GLBViewerHandle } from "./GLBViewer";

// ---- Types ----
export type RpmAsset = {
  id: string;
  name: string;
  iconUrl: string;
};

export type RpmAssetType = "costume" | "outfit";

type Props = {
  token: string; // Ready Player Me API token (Bearer)
  userId: string; // Ready Player Me user ID
  donationAmount: number; // $0, $100, $500 tiers
  gender: "male" | "female";
  initialType?: RpmAssetType;
  avatarId: string;
  onSelect?: (asset: RpmAsset) => void; // Optional external hook
  className?: string;
};

// Map of sidebar items → RPM type & emoji icon
const SIDEBAR: { key: RpmAssetType; label: string; emoji: string }[] = [
  { key: "outfit", label: "Full Outfit", emoji: "👗" },
];

const APP_ID = process.env.NEXT_PUBLIC_READYPLAYERME_APPLICATION_ID || "";

// Small inline lock icon (no extra deps)
function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M7 10V8a5 5 0 1 1 10 0v2" />
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  );
}

export default function AvatarAssetPicker({
  token,
  userId,
  donationAmount,
  gender,
  initialType = "outfit",
  avatarId,
  onSelect: onSelectProp,
  className,
}: Props) {
  const [type, setType] = useState<RpmAssetType>(initialType);
  const [assets, setAssets] = useState<RpmAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state: show overlay while the viewer reloads the model
  const [viewerLoading, setViewerLoading] = useState(false);

  const viewerRef = useRef<GLBViewerHandle>(null);

  // Unlock rules: <100 → first 2; >=100 → first 5; >=500 → all
  const unlockedCount = useMemo(() => {
    if (donationAmount >= 1500) return Number.POSITIVE_INFINITY; // unlock all
    if (donationAmount >= 100) return 5; // first 5
    return 2; // first 2
  }, [donationAmount]);

  // Next milestone helper for UI copy & progress bar
  const nextMilestone = useMemo(() => {
    if (donationAmount < 100) return 100;
    if (donationAmount < 1500) return 1500;
    return null;
  }, [donationAmount]);

  // Build the fetch URL when deps change
  const url = useMemo(
    () =>
      `https://api.readyplayer.me/v1/assets?filter=usable-by-user-and-app&filterApplicationId=${APP_ID}&filterUserId=${userId}&gender=${gender}&type=${type}&limit=20`,
    [type, gender, userId]
  );

  // Apply + Save avatar, then refresh viewer
  const handleSelect = async (asset: RpmAsset, rpmKey: RpmAssetType) => {
    try {
      setViewerLoading(true);

      const patch = await fetch(
        `https://api.readyplayer.me/v2/avatars/${avatarId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-APP-ID": APP_ID,
          },
          body: JSON.stringify({
            data: {
              assets: {
                [rpmKey]: asset.id,
              },
            },
          }),
        }
      );

      if (!patch.ok) throw new Error(await patch.text());

      const save = await fetch(
        `https://api.readyplayer.me/v2/avatars/${avatarId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-APP-ID": APP_ID,
          },
        }
      );
      if (!save.ok) throw new Error(await save.text());

      onSelectProp?.(asset);

      // Wait for the model-viewer to fully load the refreshed asset
      await viewerRef.current?.refresh();
    } catch (e) {
      console.error("Failed to update/save avatar:", e);
    } finally {
      setViewerLoading(false);
    }
  };

  // Fetch assets whenever the sidebar selection changes
  useEffect(() => {
    let isCurrent = true;
    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            "X-APP-ID": APP_ID,
          },
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const json = await res.json();
        const items: RpmAsset[] = (json?.data ?? []).map((it: any) => ({
          id: String(it?.id ?? it?.assetId ?? ""),
          name: String(it?.name ?? it?.title ?? "Untitled"),
          iconUrl: String(
            it?.iconUrl ?? it?.images?.thumbnail ?? it?.images?.icon ?? ""
          ),
        }));

        if (!isCurrent) return;
        // Swap elements at positions 0 and 2 (0-based) before saving to state
        if (items.length > 2) {
          const tmp = items[0];
          items[0] = items[2];
          items[2] = tmp;
        }
        setAssets(items);
      } catch (e: any) {
        if (!isCurrent) return;
        if (e?.name !== "AbortError") setError(e?.message ?? "Unknown error");
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    run();
    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [url, token]);

  // UI helpers for locking
  const isLocked = (index: number) =>
    index >= Math.min(unlockedCount, assets.length);
  const remainingToNext = nextMilestone
    ? Math.max(0, nextMilestone - donationAmount)
    : 0;

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <h1 className="text-4xl text-start font-bold mb-16 text-gray-900 dark:text-white">
        Customize Avatar
      </h1>
      <div
        className={
          "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start p-6" +
          (className ?? "")
        }
      >
        {/* LEFT: Header + 3D Viewer + progress */}
        <div className="w-full">
          <div className="relative w-full">
            <div
              className={
                viewerLoading
                  ? "opacity-0"
                  : "opacity-100 transition-opacity duration-300"
              }
            >
              <GLBViewer
                ref={viewerRef}
                url={`https://models.readyplayer.me/${avatarId}.glb`}
                poster={"/loading-buffer.gif"}
              />
            </div>
            {viewerLoading && (
              <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  {/* spinner */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Filters + outfit grid (now constrained to the right half by the grid) */}
        <div className="w-full">
          <div className="bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 rounded-xl border dark:border-gray-900 border-gray-100 shadow-md">
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {loading &&
                Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl shadow-sm" />
                ))}

              {!loading && assets.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  {error ? `Error: ${error}` : "No items found."}
                </div>
              )}

              {!loading &&
                assets.map((asset, idx) => {
                  const locked = isLocked(idx);
                  const buttonClasses = [
                    "relative group aspect-square rounded-xl overflow-hidden",
                    "border transition-shadow bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 rounded-xl border dark:border-gray-900 border-gray-100 shadow-sm",
                    locked
                      ? "border-gray-200"
                      : viewerLoading
                      ? "border-transparent opacity-60 cursor-wait"
                      : "border-transparent hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400",
                  ].join(" ");

                  return (
                    <button
                      key={asset.id}
                      className={buttonClasses}
                      title={
                        locked
                          ? `Locked – donate $${remainingToNext} more to unlock`
                          : viewerLoading
                          ? "Applying and loading…"
                          : asset.name
                      }
                      onClick={() =>
                        !locked && !viewerLoading && handleSelect(asset, type)
                      }
                      disabled={locked || viewerLoading}
                      aria-disabled={locked}
                    >
                      {asset.iconUrl ? (
                        <Image
                          src={asset.iconUrl}
                          alt={asset.name}
                          width={256}
                          height={256}
                          className={
                            "h-full w-full object-cover transition-transform " +
                            (locked
                              ? "grayscale blur-[1px] opacity-70"
                              : "group-active:scale-95")
                          }
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs p-2">
                          No preview
                        </div>
                      )}

                      {locked && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 text-white">
                          <span className="inline-flex items-center gap-2 text-sm font-medium">
                            <LockIcon className="w-4 h-4" /> Locked
                          </span>
                          {nextMilestone && (
                            <span className="text-[11px] opacity-90">
                              Donate ${remainingToNext} more to unlock
                            </span>
                          )}
                        </div>
                      )}

                      {locked && (
                        <div className="pointer-events-none absolute -top-1.5 -right-10 rotate-45 bg-black/70 text-white text-[10px] tracking-wider px-10 py-1 shadow">
                          LOCKED
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
          {/* Tier status bar */}
          <div className="w-full px-2 py-3 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all"
                style={{
                  width: `${Math.min(100, (donationAmount / 1500) * 100)}%`,
                }}
              />
            </div>
            <div className="text-sm text-gray-600 whitespace-nowrap">
              {donationAmount >= 1500
                ? "All items unlocked"
                : nextMilestone
                ? `Donate $${remainingToNext} more to reach $${nextMilestone}`
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
