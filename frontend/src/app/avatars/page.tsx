import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { createAnonymousUser, fetchAllTemplates } from "./actions";

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

  const avatarTemplates = await fetchAllTemplates(avatarToken);

  return (
    <>
      <pre>{JSON.stringify(avatarTemplates, null, 2)}</pre>
    </>
  );
}
