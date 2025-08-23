import { redirect } from "next/navigation";
import Image from "next/image";

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
    <>
      <div className="w-full bg-white rounded-2xl">
        "PLACEHOLDER FOR MAP"
      </div>
    </>
  );
}
