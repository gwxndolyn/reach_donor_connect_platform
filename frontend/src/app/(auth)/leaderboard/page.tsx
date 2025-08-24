import { redirect } from "next/navigation";
import { Trophy, MapPin, Users, TrendingUp } from "lucide-react";
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

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const { data: AuthData, error: AuthError } = await supabase.auth.getUser();
  if (AuthError || !AuthData?.user) {
    redirect("/login");
  }

  // Try to get donor data with error handling
  let DonorData = null;
  try {
    const { data: donorResult, error: DonorError } = await supabase
      .from("donors")
      .select("*")
      .eq("auth_uid", AuthData.user.id)
      .single();

    if (!DonorError) {
      DonorData = donorResult;
    }
  } catch (error) {
    console.error("Error fetching donor data:", error);
  }

  // Only redirect to onboarding if we specifically have donor data but not onboarded
  if (DonorData && !DonorData.onboarded) {
    redirect("/signup/onboarding");
  }

  // Fetch total donor counts per region using the SQL function (with error handling)
  let regionCountsData = null;
  try {
    const { data: regionCountsResult, error: regionCountsError } = await supabase
      .rpc("get_donor_counts");

    if (regionCountsError) {
      console.error("Error fetching region counts:", regionCountsError);
    } else {
      regionCountsData = regionCountsResult;
    }
  } catch (error) {
    console.error("Database error fetching region counts:", error);
  }

  // Fetch referral counts per region (with error handling)
  let referralCountsData = null;
  try {
    const { data: referralCountsResult, error: referralCountsError } = await supabase
      .rpc("get_referral_counts");

    if (referralCountsError) {
      console.error("Error fetching referral counts:", referralCountsError);
    } else {
      referralCountsData = referralCountsResult;
    }
  } catch (error) {
    console.error("Database error fetching referral counts:", error);
  }

  // Transform the array into a lookup object for ColorBasedMap
  const regionCountMap: Record<string, number> = {};
  regionCountsData?.forEach((row: { region: string; count: number }) => {
    regionCountMap[row.region] = Number(row.count);
  });

  const referralCountMap: Record<string, number> = {};
  referralCountsData?.forEach((row: { region: string; count: number }) => {
    referralCountMap[row.region] = Number(row.count);
  });

  // Compute Top 3 for each category
  const topDonors = [...(regionCountsData || [])]
    .sort((a, b) => Number(b.count) - Number(a.count))
    .slice(0, 3);

  const topReferrals = [...(referralCountsData || [])]
    .sort((a, b) => Number(b.referrals) - Number(a.referrals))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12 pt-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">Regional Leaderboard</h1>
            <MapPin className="h-10 w-10 text-blue-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tracking donor impact and referrals across Hong Kong regions
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {regionCountsData ? regionCountsData.reduce((sum: number, row: any) => sum + Number(row.count), 0) : '0'}
            </div>
            <div className="text-sm text-gray-600">Total Donors</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {referralCountsData ? referralCountsData.reduce((sum: number, row: any) => sum + Number(row.referrals), 0) : '0'}
            </div>
            <div className="text-sm text-gray-600">Total Referrals</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">18</div>
            <div className="text-sm text-gray-600">Active Regions</div>
          </div>
        </div>

        {/* Top 3 Leaderboard */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Trophy className="h-6 w-6" />
              Top 3 Leaderboard
            </h2>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Total Donors */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-900">Top Donor Regions</h3>
                </div>
                <div className="space-y-3">
                  {topDonors.length > 0 ? topDonors.map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/60 backdrop-blur rounded-xl p-4 border border-blue-200/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-gray-900">{regionDisplayMap[row.region]}</span>
                      </div>
                      <span className="text-lg font-bold text-blue-700">{Number(row.count)}</span>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No donor data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Referrals */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-900">Top Referral Regions</h3>
                </div>
                <div className="space-y-3">
                  {topReferrals.length > 0 ? topReferrals.map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/60 backdrop-blur rounded-xl p-4 border border-green-200/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-gray-900">{regionDisplayMap[row.region]}</span>
                      </div>
                      <span className="text-lg font-bold text-green-700">{Number(row.referrals)}</span>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No referral data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <MapPin className="h-6 w-6" />
              Regional Impact Map
            </h2>
            <p className=" mt-2">Interactive visualization of donor distribution across Hong Kong</p>
          </div>
          
          <div className="">
            <div className="bg-gray-50 rounded-2xl p-6 min-h-[500px]">
              <ColorBasedMap
                className="w-full h-full"
                regionCounts={regionCountMap}
                referralCounts={referralCountMap} 
              />
            </div>
          </div>
        </div>
      </div>
  );
}
