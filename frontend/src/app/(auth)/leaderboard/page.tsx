import { redirect } from "next/navigation";

import { ColorBasedMap } from "@/components/ColorBasedMap";

import { createClient } from "@/utils/supabase/server";

const regionDisplayMap: Record<string, string> = {
  "islands": "Islands 離島",
  "kwai-tsing": "Kwai Tsing 葵青",
  "north": "North 北",
  "sai-kung": "Sai Kung 西貢",
  "sha-tin": "Sha Tin 沙田",
  "tai-po": "Tai Po 大埔",
  "tsuen-wan": "Tsuen Wan 荃灣",
  "tuen-mun": "Tuen Mun 屯門",
  "yuen-long": "Yuen Long 元朗",
  "kowloon-city": "Kowloon City 九龍城",
  "kwun-tong": "Kwun Tong 觀塘",
  "sham-shui-po": "Sham Shui Po 深水埗",
  "wong-tai-sin": "Wong Tai Sin 黃大仙",
  "yau-tsim-mong": "Yau Tsim Mong 油尖旺",
  "central-western": "Central and Western 中西",
  "eastern": "Eastern 東",
  "southern": "Southern 南",
  "wan-chai": "Wan Chai 灣仔",
};

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data: AuthData, error: AuthError } = await supabase.auth.getUser();
  if (AuthError || !AuthData?.user) {
    redirect("/login");
  }

  const { data: DonorData, error: DonorError } = await supabase
    .from("donors")
    .select("*")
    .eq("auth_uid", AuthData.user.id)
    .single();

  if (DonorError || !DonorData.onboarded) {
    redirect("/signup/onboarding");
  }

  // --- Fetch total donor counts per region using the SQL function ---
  const { data: regionCountsData, error: regionCountsError } = await supabase
    .rpc("get_donor_counts"); // <-- your server-side SQL function

  if (regionCountsError) {
    console.error("Error fetching region counts:", regionCountsError);
  }

  // Transform the array into a lookup object for ColorBasedMap
  const regionCountMap: Record<string, number> = {};
  regionCountsData?.forEach((row: { region: string; count: number }) => {
    regionCountMap[row.region] = Number(row.count);
  });

  // --- Fetch referral counts per region ---
  const { data: referralCountsData, error: referralCountsError } = await supabase
    .rpc("get_referral_counts"); // returns table(region text, referrals bigint)

  if (referralCountsError) {
    console.error("Error fetching referral counts:", referralCountsError);
  }

  const referralCountMap: Record<string, number> = {};
  referralCountsData?.forEach((row: { region: string; count: number }) => {
    referralCountMap[row.region] = Number(row.count);
  });

  // --- Compute Top 3 for each category ---
  const topDonors = [...(regionCountsData || [])]
    .sort((a, b) => Number(b.count) - Number(a.count))
    .slice(0, 3);

  const topReferrals = [...(referralCountsData || [])]
    .sort((a, b) => Number(b.referrals) - Number(a.referrals))
    .slice(0, 3);

  return (
    <main className="pt-12 md:pt-14"> {/* 48px then 56px on md */}
      <div className="w-full bg-white rounded-2xl pt-20">

      {/* --- Top 3 Leaderboard Table --- */}
      <div className="w-full bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Top 3 Leaderboard</h2>
        <div className="grid grid-cols-2 gap-8">
          {/* Total Donors */}
          <div>
            <h3 className="font-semibold mb-2">Total Donors</h3>
            <ul className="divide-y divide-gray-200">
              {topDonors.map((row, idx) => (
                <li key={idx} className="py-2 flex justify-between">
                  <span className="font-bold">{idx + 1}. {regionDisplayMap[row.region]}</span>
                  <span>{Number(row.count)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Total Referrals */}
          <div>
            <h3 className="font-semibold mb-2">Total Referrals</h3>
            <ul className="divide-y divide-gray-200">
              {topReferrals.map((row, idx) => (
                <li key={idx} className="py-2 flex justify-between">
                  <span className="font-bold">{idx + 1}. {regionDisplayMap[row.region]}</span>
                  <span>{Number(row.referrals)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl">
        <div className="flex items-center gap-8">
          <ColorBasedMap
            className="w-full h-full"
            regionCounts={regionCountMap}
            referralCounts={referralCountMap} 
          />
        </div>
      </div>
    </main>
  );
}
