"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// TODO: change to something more appropriate
type Region = "north" | "south" | "east" | "west";

export async function createDonor(formData: FormData) {
  const supabase = await createClient();
  const { data: userData, error: userFetchError } =
    await supabase.auth.getUser();

  if (userFetchError || !userData?.user) {
    redirect("/login");
  }

  const name = (formData.get("name") || "").toString().trim();
  const region = (formData.get("region") || "")
    .toString()
    .toLowerCase() as Region;

  if (!name) return { ok: false, error: "Name is required." };
  if (!["north", "south", "east", "west"].includes(region)) {
    return { ok: false, error: "Invalid region." };
  }

  // Create a Supabase client with the existing method

  const { data: donorData, error: donorError } = await supabase
    .from("Donors")
    .insert([{ name, region, onboarded: true, auth_uid: userData.user.id }])
    .select();

  redirect("/dashboard");

  if (donorError) return { ok: false, error: donorError.message };
  return { ok: true, donor: donorData };
}
