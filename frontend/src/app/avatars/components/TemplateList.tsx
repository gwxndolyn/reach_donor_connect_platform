"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type TemplateItem = {
  id: string;
  imageUrl: string;
  gender: "male" | "female" | string;
  usageType: string;
};

type Props = { avatarTemplates: TemplateItem[] };

export default function TemplateList({ avatarTemplates }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [donorToken, setDonorToken] = useState<string | null>(null);
  const [gender, setGender] = useState<"male" | "female" | null>(null);
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
        .from("Donors")
        .select("onboarded,rpm_token")
        .eq("auth_uid", _uid)
        .single();

      if (donorErr || !donor) return router.push("/signup/onboarding");
      if (!donor.onboarded) return router.push("/signup/onboarding");

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
      (i) => i.gender === gender && i.usageType === "randomize"
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
      if (!res.ok)
        throw new Error(json?.error?.message || "Failed to assign template");

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
      if (!res2.ok)
        throw new Error(
          json2?.error?.message || "Failed to save avatar to RPM"
        );

      // 2) Update your donor row using the same client + uid
      const { error: updateErr } = await supabase
        .from("Donors")
        .update({ avatar_id: json.data.id })
        .eq("auth_uid", uid);

      if (updateErr) throw updateErr;

      router.push("/avatars/customize");
    } catch (e: any) {
      setErrorMsg(e?.message || "Something went wrong assigning the template.");
      console.error("assignTemplate error:", e);
    } finally {
      setPendingId(null);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Gender chooser with fade */}
      <div
        className={[
          "flex items-center justify-center gap-4 transition-opacity duration-500",
          gender ? "opacity-0 pointer-events-none" : "opacity-100",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setGender("female")}
          className="w-full max-w-xs rounded-2xl border border-gray-300 bg-white px-6 py-8 text-lg font-semibold text-gray-800 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Female
        </button>
        <button
          type="button"
          onClick={() => setGender("male")}
          className="w-full max-w-xs rounded-2xl border border-gray-300 bg-white px-6 py-8 text-lg font-semibold text-gray-800 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Male
        </button>
      </div>

      {/* Grid fade-in */}
      <div
        className={[
          "transition-opacity duration-500",
          gender ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {!gender ? (
          <p className="text-center text-gray-600">
            Choose a gender to see templates.
          </p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-6 text-center text-gray-600">
            No templates found for{" "}
            <span className="font-semibold">{gender}</span>.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => {
              const isPending = pendingId === item.id;
              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={`Template ${item.id}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p
                      className="mt-2 truncate text-sm text-gray-500"
                      title={item.id}
                    >
                      ID:{" "}
                      <span className="font-mono text-gray-700">{item.id}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      disabled={isPending}
                      className="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                    >
                      {isPending ? "Assigning…" : "Select"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
