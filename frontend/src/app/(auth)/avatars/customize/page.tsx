import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AvatarAssetPicker from "./components/AvatarAssetPicker";

export default async function CustomizePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData) return redirect("/login");

  if (!userData.user) return redirect("/login");

  const { data: donor, error: donorErr } = await supabase
    .from("donors")
    .select("rpm_token,onboarded,rpm_user_id,avatar_id, donation_amount")
    .eq("auth_uid", userData.user.id)
    .single();

  if (donorErr || !donor || !donor.onboarded)
    return redirect("/signup/onboarding");

  return (
    <div className="mt-12">
      <AvatarAssetPicker
        token={donor.rpm_token}
        userId={donor.rpm_user_id}
        gender="male"
        avatarId={donor.avatar_id}
        donationAmount={donor.donation_amount}
      />
    </div>
  );
}
