import Link from "next/link";
import Image from "next/image";
import {
  User,
  SlidersHorizontal,
  LogOut,
  Shield,
  ChevronRight,
} from "lucide-react";
// import your server action:
import { loadDonor, setAnonymous /*, signOut*/ } from "./actions";

export default async function ProfilePage() {
  const donor = (await loadDonor()).donor;
  const isDarkMode =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;

  const avatarUrl = donor?.avatar_id
    ? `https://models.readyplayer.me/${
        donor.avatar_id
      }.png?expression=happy&pose=thumbs-up&size=256${
        isDarkMode ? "&background=158,158,158" : ""
      }`
    : "/placeholder_avatar.jpg";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top header band */}
      <div className="h-40 bg-violet-300 dark:bg-violet-400/30 rounded-b-3xl" />

      <main className="mx-auto w-full max-w-md px-6">
        {/* Avatar overlapping the header */}
        <div className="-mt-12 flex justify-center">
          <Image
            src={avatarUrl}
            alt={donor?.name ?? "Avatar"}
            width={128}
            height={128}
            className="rounded-full ring-4 ring-white dark:ring-gray-900 shadow-md bg-white object-cover"
          />
        </div>

        {/* Name */}
        <h1 className="mt-4 text-center text-2xl font-semibold text-gray-900 dark:text-white">
          {donor?.name ?? "—"}
        </h1>

        {/* Contact rows */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Mail</span>
            <span className="text-base text-gray-900 dark:text-white">
              {donor?.email ?? "—"}
            </span>
          </div>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-800" />

        {/* Settings list */}
        <ul className="divide-y divide-gray-200 dark:divide-gray-800 rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-900/60 shadow">
          {/* Anonymous mode toggle (server action) */}
          <li className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-amber-100 grid place-items-center">
                <Shield className="h-5 w-5 text-amber-700" />
              </div>
              <span className="text-gray-900 dark:text-white">
                Anonymous mode
              </span>
            </div>

            {/* Single-button toggle that posts to the server action */}
            <form action={setAnonymous}>
              <input
                type="hidden"
                name="anonymous"
                value={(!donor?.anonymous).toString()}
              />
              <button
                type="submit"
                aria-label="Toggle anonymous mode"
                className={[
                  "relative inline-flex h-7 w-12 items-center rounded-full transition",
                  donor?.anonymous ? "bg-emerald-500" : "bg-gray-300",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
                    donor?.anonymous ? "translate-x-6" : "translate-x-1",
                  ].join(" ")}
                />
              </button>
            </form>
          </li>

          {/* Profile details */}
          <li>
            <Link
              href="/profile/customize-avatar"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
                  <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-gray-900 dark:text-white">
                  Customize Avatar
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </li>

          {/* Log out (hook up to your signOut action if you have one) */}
          <li>
            {/* <form action={signOut}> */}
            <button
              // type="submit"
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 grid place-items-center">
                  <LogOut className="h-5 w-5 text-red-400" />
                </div>
                <span className="text-red-400">Log out</span>
              </div>
              <ChevronRight className="h-5 w-5 text-red-400" />
            </button>
            {/* </form> */}
          </li>
        </ul>
      </main>
    </div>
  );
}
