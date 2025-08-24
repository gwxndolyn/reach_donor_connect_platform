import { redirect } from "next/navigation";

import { ColorBasedMap } from "@/components/ColorBasedMap";

import { createClient } from "@/utils/supabase/server";

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

  const { data: donorData, error: donorFetchError } = await supabase
    .from("donors")
    .select("region");  // Only fetch the 'region' field to save bandwidth

  if (donorFetchError) {
    console.error("Error fetching donors:", donorFetchError);
  }

  const regionCountMap: Record<string, number> = {};

  // Loop through the fetched donor data and count regions
  donorData?.forEach((donor) => {
    if (donor?.region) {
      regionCountMap[donor.region] = (regionCountMap[donor.region] || 0) + 1;
    }
  });

  return (
    <main className="pt-12 md:pt-14"> {/* 48px then 56px on md */}
      <div className="w-full bg-white rounded-2xl pt-20">
        <div className="flex items-center gap-8">
          <ColorBasedMap
            className="w-full h-full"
            regionCounts={regionCountMap} 
          />
        </div>
      </div>
    </main>
  );
}
