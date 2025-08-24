import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import {
  createAnonymousUser,
  fetchAllTemplates,
  saveTokenAndUserIdToDB,
} from "./actions";
import TemplateList from "./components/TemplateList";

type TemplateItem = {
  imageUrl: string;
  gender: "female" | "male" | "other";
  usageType: "randomize" | "default" | string;
  id: string;
};

export default async function AvatarPage() {
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

  if (DonorData.avatar_id) {
    return redirect("/home");
  }

  const { token: avatarToken, rpm_user_id: rpmUserId } =
    await createAnonymousUser();

  await saveTokenAndUserIdToDB(avatarToken, AuthData.user.id, rpmUserId);

  const avatarTemplates: TemplateItem[] = await fetchAllTemplates(avatarToken);

  return <TemplateList avatarTemplates={avatarTemplates} />;
}
