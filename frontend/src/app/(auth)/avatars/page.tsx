import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import {
  createAnonymousUser,
  fetchAllTemplates,
  saveTokenToDB,
} from "./actions";
import TemplateList from "./components/TemplateList";

type TemplateItem = {
  imageUrl: string;
  gender: "female" | "male" | "unisex" | string;
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
    .from("Donors")
    .select("*")
    .eq("auth_uid", AuthData.user.id)
    .single();

  if (DonorError || !DonorData.onboarded) {
    redirect("/signup/onboarding");
  }

  const avatarToken = await createAnonymousUser();

  await saveTokenToDB(avatarToken, AuthData.user.id);

  const avatarTemplates: TemplateItem[] = await fetchAllTemplates(avatarToken);

  return <TemplateList avatarTemplates={avatarTemplates} />;
}
