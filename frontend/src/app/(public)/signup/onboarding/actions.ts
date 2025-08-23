"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type Region = "Islands 離島" | "Kwai Tsing 葵青" | "North 北" | "Sai Kung 西貢" | "Sha Tin 沙田" | "Tai Po 大埔" | "Tsuen Wan 荃灣" | "Tuen Mun 屯門" | "Yuen Long	元朗" | "Kowloon City 九龍城" | "Kwun Tong 觀塘" | "Sham Shui Po 深水埗" | "Wong Tai Sin 黃大仙" | "Yau Tsim Mong 油尖旺" | "Central and Western 中西" | "Eastern 東" | "Southern 南" | "Wan Chai 灣仔";

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
