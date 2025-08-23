import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import GLBViewer from "./components/GLBViewer";

export default async function CustomizePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData) return redirect("/login");

  if (!userData.user) return redirect("/login");

  const { data: donor, error: donorErr } = await supabase
    .from("Donors")
    .select("onboarded,rpm_token,avatar_id")
    .eq("auth_uid", userData.user.id)
    .single();

  if (donorErr || !donor) return redirect("/signup/onboarding");
  if (!donor.onboarded) return redirect("/signup/onboarding");

  return (
    <div>
      <h1>Customize Your Avatar</h1>
      <GLBViewer url={`https://models.readyplayer.me/${donor.avatar_id}.glb`} />
    </div>
  );
}
