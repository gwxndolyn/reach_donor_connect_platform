"use client";

import { useEffect, useMemo, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type TemplateItem = {
  id: string;
  imageUrl: string;
  gender: "male" | "female" | "other" | string;
  usageType: string;
};

type Props = { avatarTemplates: TemplateItem[] };

export default function TemplateList({ avatarTemplates }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [donorToken, setDonorToken] = useState<string | null>(null);
  const [gender, setGender] = useState<"male" | "female" | "other" | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData) return router.push("/login");

      if (!userData.user) return router.push("/login");
      const _uid = userData.user.id;
      setUid(_uid);

      const { data: donor, error: donorErr } = await supabase
        .from("donors")
        .select("onboarded,rpm_token,gender")
        .eq("auth_uid", _uid)
        .single();

      if (donorErr || !donor) return router.push("/signup/onboarding");
      if (!donor.onboarded) return router.push("/signup/onboarding");

      setGender(donor.gender);

      if (mounted) {
        setDonorToken(donor.rpm_token ?? null);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  const filtered = useMemo(() => {
    if (!gender) return [];
    return avatarTemplates.filter(
      (i) =>
        (gender === "other" ? true : i.gender === gender) &&
        i.usageType === "randomize"
    );
  }, [avatarTemplates, gender]);

  const onSelect = async (item: TemplateItem) => {
    setErrorMsg(null);

    // Hard guard: token + uid must exist
    if (!donorToken) {
      setErrorMsg(
        "Missing RPM token for this user. Complete onboarding first."
      );
      return;
    }
    if (!uid) {
      setErrorMsg("No authenticated user.");
      return;
    }

    setPendingId(item.id);
    try {
      // 1) Assign template at RPM
      const res = await fetch(
        `https://api.readyplayer.me/v2/avatars/templates/${item.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${donorToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: { partner: "reachdonorconnect", bodyType: "fullbody" },
          }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || "Failed to assign template");
      } else {
        console.log("Template assigned:", json);
      }

      const res2 = await fetch(
        `https://api.readyplayer.me/v2/avatars/${json.data.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${donorToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const json2 = await res2.json();
      if (!res2.ok) {
        throw new Error(json2?.error?.message || "Failed to update avatar");
      } else {
        console.log("Avatar updated:", json2);
      }

      // 2) Update your donor row using the same client + uid
      const { error: updateErr } = await supabase
        .from("donors")
        .update({ avatar_id: json.data.id, rpm_onboarded: true })
        .eq("auth_uid", uid);

      if (updateErr) throw updateErr;
    } catch (e: any) {
      setErrorMsg(e?.message || "Something went wrong assigning the template.");
      console.error("assignTemplate error:", e);
    } finally {
      setPendingId(null);
      router.push("/home");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-900 dark:text-white">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen space-y-6 bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-auto p-12">
      {errorMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className={"transition-opacity duration-500 opacity-100"}>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-6 text-center text-gray-900 dark:text-white">
            No templates found for{" "}
            <span className="font-semibold">{gender}</span>.
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-10">
            <h1 className="text-center text-4xl font-semibold text-gray-900 dark:text-white">
              Select Your Avatar
            </h1>

            {/* Auto-fit columns based on width */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const isPending = pendingId === item.id;

                return (
                  <div
                    key={item.id}
                    className={[
                      "relative isolate rounded-2xl p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 shadow-sm",
                      "transition hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => !isPending && onSelect(item)}
                      disabled={isPending}
                      className={[
                        "group w-full flex flex-col items-center outline-none",
                        isPending ? "opacity-60 cursor-wait" : "",
                      ].join(" ")}
                    >
                      {/* Avatar */}
                      <div
                        className={[
                          "relative aspect-square w-full max-w-[7.5rem] rounded-full overflow-hidden",
                          "bg-gray-100 ring-2 ring-transparent group-hover:ring-indigo-200",
                          "transition",
                        ].join(" ")}
                      >
                        <img
                          src={item.imageUrl}
                          alt={`Template ${item.id}`}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />

                        {/* Pending overlay */}
                        {isPending && (
                          <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-[1px]">
                            <svg
                              className="h-5 w-5 animate-spin text-gray-700"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
