"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server"; // adjust if your path differs

type DonorRow = {
  name?: string | null;
  email?: string | null;
  region?: string | null;
  anonymous?: boolean | null;
  avatar_id?: string | null;
};

export async function loadDonor() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    // If you prefer showing a message, swap redirect for throwing an error
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("donors")
    .select("name,email,region,anonymous,avatar_id")
    .eq("auth_uid", user.id)
    .single();

  // PGRST116 => no rows. Not a hard error if you want to allow empty.
  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  const donor: DonorRow = {
    name:
      data?.name ?? (user.user_metadata as any)?.full_name ?? user.email ?? "",
    email: data?.email ?? user.email ?? "",
    region: data?.region ?? null,
    anonymous: !!data?.anonymous,
    avatar_id: data?.avatar_id ?? null,
  };

  return { uid: user.id, donor };
}

export async function setAnonymous(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const next = formData.get("anonymous") === "true";

  const { error } = await supabase
    .from("donors")
    .update({ anonymous: next })
    .eq("auth_uid", user.id);

  if (error) {
    throw new Error(error.message);
  }

  // Re-render /profile so the new value shows up immediately
  revalidatePath("/profile");
}
