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
    .select("rpm_token,onboarded,rpm_user_id,avatar_id,donation_amount")
    .eq("auth_uid", userData.user.id)
    .single();

  if (donorErr || !donor || !donor.onboarded)
    return redirect("/signup/onboarding");

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
