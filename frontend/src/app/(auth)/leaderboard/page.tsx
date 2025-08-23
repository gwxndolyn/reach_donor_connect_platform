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
    .from("Donors")
    .select("*")
    .eq("auth_uid", AuthData.user.id)
    .single();

  if (DonorError || !DonorData.onboarded) {
    redirect("/signup/onboarding");
  }

  return (
    <main className="pt-12 md:pt-14"> {/* 48px then 56px on md */}
      <div className="w-full bg-white rounded-2xl">
        <div className="flex items-center gap-8">
          <ColorBasedMap className="w-full h-full" />
        </div>
      </div>
    </main>
  );
}
