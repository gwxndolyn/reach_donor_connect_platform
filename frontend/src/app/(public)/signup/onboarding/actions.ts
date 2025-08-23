"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type Region = "islands" | "north" | "kwai-tsing" | "sai-kung" | "sha-tin" | "tai-po" | "tsuen-wan" | "tuen-mun" | "yuen-long" | "kowloon-city" | "kwun-tong" | "sham-shui-po" | "wong-tai-sin" | "yau-tsim-mong" | "central-western" | "eastern" | "southern" | "wan-chai" | "Wan Chai 灣仔";

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
  if (!["islands", "north", "kwai-tsing", "sai-kung", "sha-tin", "tai-po", "tsuen-wan", "tuen-mun", "yuen-long", "kowloon-city", "kwun-tong", "sham-shui-po", "wong-tai-sin", "yau-tsim-mong", "central-western", "eastern", "southern", "wan-chai", "Wan Chai 灣仔"].includes(region)) {
    return { ok: false, error: "Invalid region." };
  }

  // Create a Supabase client with the existing method

  const { data: donorData, error: donorError } = await supabase
    .from("donors")
    .insert([{ name, email: userData.user.email, region, onboarded: true, auth_uid: userData.user.id }])
    .select();

  if (donorError) return { ok: false, error: donorError.message };
  

  redirect("/dashboard");

  return { ok: true, donor: donorData };
  
}
