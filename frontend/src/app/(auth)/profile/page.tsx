import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";
import { loadDonor, setAnonymous } from "./actions";

export default async function ProfilePage() {
  const { donor } = await loadDonor();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="flex w-[60%] items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Your Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your settings and personalization.
          </p>
        </div>

        <Link
          href="/profile/customize-avatar"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Customize Avatar
          <ChevronRight className="h-5 w-5" />
        </Link>
      </header>

      {/* Profile card */}
      <section className="rounded-2xl border border-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 grid place-items-center">
              <span className="text-indigo-700 font-semibold">
                {String(donor.name ?? "U")
                  .slice(0, 1)
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {donor.name || "—"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {donor.email || "—"}
              </div>
              {donor.region && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Region: {donor.region}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Settings row: Anonymous mode */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 grid place-items-center">
                <Shield className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Anonymous mode
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Hide your name on public leaderboards and messages.
                </div>
              </div>
            </div>

            {/* Segmented toggle using server actions (no client JS needed) */}
            <div className="flex items-center gap-2">
              <form action={setAnonymous}>
                <input type="hidden" name="anonymous" value="false" />
                <button
                  type="submit"
                  className={[
                    "px-3 py-1.5 rounded-lg text-sm font-medium border",
                    donor.anonymous
                      ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      : "bg-emerald-600 text-white border-emerald-600",
                  ].join(" ")}
                >
                  Show name
                </button>
              </form>

              <form action={setAnonymous}>
                <input type="hidden" name="anonymous" value="true" />
                <button
                  type="submit"
                  className={[
                    "px-3 py-1.5 rounded-lg text-sm font-medium border",
                    donor.anonymous
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                  ].join(" ")}
                >
                  Anonymous
                </button>
              </form>
            </div>
          </div>

          <div className="mt-3 min-h-[1.25rem]">
            <span className="text-sm text-gray-500">
              {donor.anonymous
                ? "Currently, your profile is anonymous."
                : "Currently, your profile is public. Your name may appear publicly."}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
