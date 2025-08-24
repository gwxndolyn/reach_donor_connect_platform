"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AssetItem, fetchAssetsByGenderAndType } from "../actions";
import {
  Glasses,
  Shirt,
  GraduationCap as Hat,
  Glasses as Sunglasses,
  Footprints,
  Snail,
  Sparkles,
} from "lucide-react";

type Category =
  | "footwear"
  | "facewear"
  | "headwear"
  | "top"
  | "shirt"
  | "bottom"
  | "outfit"
  | "glasses";

const CATS: { key: Category; label: string; Icon: React.ComponentType<any> }[] =
  [
    { key: "footwear", label: "Footwear", Icon: Footprints },
    { key: "facewear", label: "Facewear", Icon: Sunglasses },
    { key: "headwear", label: "Headwear", Icon: Hat },
    { key: "top", label: "Top", Icon: Shirt },
    { key: "shirt", label: "Shirt", Icon: Shirt },
    { key: "bottom", label: "Bottom", Icon: Snail },
    { key: "outfit", label: "Outfit", Icon: Sparkles },
    { key: "glasses", label: "Glasses", Icon: Glasses },
  ];

type Props = {
  token: string;
  gender: "male" | "female";
  initialCategory?: Category;
  className?: string;
  /**
   * Optional: if you have your own equip action, pass it in.
   * Otherwise this component will no-op on equip.
   */
  onEquip?: (
    asset: AssetItem,
    ctx: { gender: "male" | "female"; category: Category }
  ) => Promise<void> | void;
};

/** Single component that shows the sidebar and equips assets */
export default function AssetEquipperWithSidebar({
  token,
  gender,
  initialCategory = "outfit",
  className = "",
  onEquip,
}: Props) {
  const [category, setCategory] = useState<Category>(initialCategory);
  const [assets, setAssets] = useState<AssetItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [equippingId, setEquippingId] = useState<string | null>(null);

  // Simple cache in memory (and mirrored to localStorage)
  type CacheKey = `${"male" | "female"}:${Category}`;
  const cacheRef = useRef<Map<CacheKey, AssetItem[]>>(new Map());

  const key: CacheKey = useMemo(
    () => `${gender}:${category}` as CacheKey,
    [gender, category]
  );

  // Load cache from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("avatar-asset-cache");
      if (raw) {
        const obj = JSON.parse(raw) as Record<string, AssetItem[]>;
        cacheRef.current = new Map(
          Object.entries(obj) as [CacheKey, AssetItem[]][]
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistCache = () => {
    try {
      const obj = Object.fromEntries(cacheRef.current.entries());
      localStorage.setItem("avatar-asset-cache", JSON.stringify(obj));
    } catch {
      /* ignore */
    }
  };

  const loadCategory = (next: Category) => {
    setCategory(next);
    setError(null);

    const ck: CacheKey = `${gender}:${next}`;
    const cached = cacheRef.current.get(ck);
    if (cached) {
      setAssets(cached);
      return;
    }

    startTransition(async () => {
      try {
        const page = 0;
        const data = await fetchAssetsByGenderAndType(
          token,
          gender,
          next,
          page
        );
        cacheRef.current.set(ck, data);
        setAssets(data);
        persistCache();
      } catch (e: any) {
        setError(e?.message ?? "Failed to fetch assets");
      }
    });
  };

  // initial load and when gender changes
  useEffect(() => {
    loadCategory(initialCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender]);

  const handleEquip = async (item: AssetItem) => {
    setEquippingId(item.id);
    try {
      if (onEquip) {
        await onEquip(item, { gender, category });
      } else {
        // No-op fallback; plug your server action here if you’d like:
        // await equipAsset(gender, category, item.id)
        console.log("Equip", { gender, category, item });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEquippingId(null);
    }
  };

  return (
    <div className={`flex min-h-[600px] bg-[#111213] text-white ${className}`}>
      {/* Main content */}
      <main className="flex-1 p-6">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold capitalize">{category}</h2>
          {isPending && <span className="text-sm text-zinc-400">Loading…</span>}
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!assets ? (
          <div className="text-zinc-400">Pick a category on the right.</div>
        ) : assets.length === 0 ? (
          <div className="text-zinc-400">No items found.</div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {assets.map((a) => {
              const pending = equippingId === a.id;
              return (
                <li
                  key={a.id}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 hover:bg-zinc-900 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={a.iconUrl}
                      alt={a.name}
                      className="h-10 w-10 rounded-md object-cover bg-zinc-800"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-100">
                        {a.name}
                      </p>
                      <p className="truncate text-xs text-zinc-400">{a.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEquip(a)}
                    disabled={pending}
                    className="mt-3 w-full rounded-lg bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-60"
                  >
                    {pending ? "Equipping…" : "Equip"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* Right rail sidebar */}
      <aside className="relative w-20 shrink-0 bg-[#17171b] border-l border-[#2a1f33] flex flex-col items-center gap-4 py-6">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-fuchsia-900/40 via-fuchsia-700/30 to-transparent" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" />

        {CATS.map(({ key, label, Icon }) => {
          const selected = key === category;
          return (
            <button
              key={key}
              aria-label={label}
              title={label}
              onClick={() => loadCategory(key)}
              className={[
                "group relative h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-200",
                "bg-zinc-900/60 hover:bg-zinc-900",
                selected
                  ? "text-fuchsia-400 ring-1 ring-fuchsia-400/40 shadow-[0_0_24px_6px_rgba(217,70,239,0.35)]"
                  : "text-zinc-400 hover:text-zinc-200",
                "focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50",
              ].join(" ")}
            >
              <div
                className={[
                  "absolute inset-0 rounded-2xl transition-opacity",
                  selected
                    ? "opacity-30 bg-fuchsia-500/20"
                    : "opacity-0 group-hover:opacity-10 bg-white/5",
                ].join(" ")}
              />
              <Icon
                className={[
                  "relative z-10 h-7 w-7",
                  selected ? "drop-shadow-[0_0_8px_rgba(217,70,239,0.7)]" : "",
                ].join(" ")}
                strokeWidth={2}
              />
            </button>
          );
        })}
      </aside>
    </div>
  );
}
