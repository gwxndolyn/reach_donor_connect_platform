"use client";

import { useState, useTransition } from "react";
import { createDonor } from "./actions";

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null);
  const [successName, setSuccessName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Welcome 👋
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Tell us a bit about you to get started.
        </p>

        <form
          className="mt-8 space-y-5"
          action={async (formData) => {
            setError(null);
            setSuccessName(null);
            startTransition(async () => {
              const res = await createDonor(formData);
              if (!res.ok) {
                setError(res.error || "Something went wrong.");
              } else {
                setSuccessName(res.donor?.name ?? "Donor");
              }
            });
          }}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Jane Doe"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700"
            >
              Region
            </label>
            <select
              id="region"
              name="region"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select a region
              </option>
              <option value="islands">Islands 離島</option>
              <option value="kwai-tsing">Kwai Tsing 葵青</option>
              <option value="north">North 北</option>
              <option value="sai-kung">Sai Kung 西貢</option>
              <option value="sha-tin">Sha Tin 沙田</option>
              <option value="tai-po">Tai Po 大埔</option>
              <option value="tsuen-wan">Tsuen Wan 荃灣</option>
              <option value="tuen-mun">Tuen Mun 屯門</option>
              <option value="yuen-long">Yuen Long 元朗</option>
              <option value="kowloon-city">Kowloon City 九龍城</option>
              <option value="kwun-tong">Kwun Tong 觀塘</option>
              <option value="sham-shui-po">Sham Shui Po 深水埗</option>
              <option value="wong-tai-sin">Wong Tai Sin 黃大仙</option>
              <option value="yau-tsim-mong">Yau Tsim Mong 油尖旺</option>
              <option value="central-western">Central and Western 中西</option>
              <option value="eastern">Eastern 東</option>
              <option value="southern">Southern 南</option>
              <option value="wan-chai">Wan Chai 灣仔</option>

            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successName && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              Thanks, <span className="font-semibold">{successName}</span>!
              You’re all set. 🎉
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow
                       hover:bg-indigo-700 disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
