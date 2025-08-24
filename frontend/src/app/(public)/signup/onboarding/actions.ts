"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type Region =
  | "islands"
  | "north"
  | "kwai-tsing"
  | "sai-kung"
  | "sha-tin"
  | "tai-po"
  | "tsuen-wan"
  | "tuen-mun"
  | "yuen-long"
  | "kowloon-city"
  | "kwun-tong"
  | "sham-shui-po"
  | "wong-tai-sin"
  | "yau-tsim-mong"
  | "central-western"
  | "eastern"
  | "southern"
  | "wan-chai";

export async function createDonor(formData: FormData) {
  const supabase = await createClient();
  const { data: userData, error: userFetchError } =
    await supabase.auth.getUser();

  if (userFetchError || !userData?.user) {
    redirect("/login");
  }

  const name = (formData.get("name") || "").toString().trim();
  const gender = (formData.get("gender") || "").toString().trim();
  const region = (formData.get("region") || "")
    .toString()
    .toLowerCase() as Region;

  if (!name) return { ok: false, error: "Name is required." };
  if (!gender) return { ok: false, error: "Gender is required." };
  if (gender != "male" && gender != "female" && gender != "other") {
    return { ok: false, error: "Invalid gender." };
  }
  if (
    ![
      "islands",
      "north",
      "kwai-tsing",
      "sai-kung",
      "sha-tin",
      "tai-po",
      "tsuen-wan",
      "tuen-mun",
      "yuen-long",
      "kowloon-city",
      "kwun-tong",
      "sham-shui-po",
      "wong-tai-sin",
      "yau-tsim-mong",
      "central-western",
      "eastern",
      "southern",
      "wan-chai",
    ].includes(region)
  ) {
    return { ok: false, error: "Invalid region." };
  }

  // Create a Supabase client with the existing method

  const { data: donorData, error: donorError } = await supabase
    .from("donors")
    .upsert(
      [
        {
          name,
          email: userData.user.email,
          region,
          gender,
          onboarded: true,
          auth_uid: userData.user.id,
        },
      ],
      { onConflict: "email" }
    )
    .select()
    .single();

  if (donorError) return { ok: false, error: donorError.message };

  redirect("/signup/onboarding/create-avatar");

  return { ok: true, donor: donorData };
}
