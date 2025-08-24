"use server";

import "server-only";
import { createClient } from "@/utils/supabase/server";

export async function createAnonymousUser() {
  const response = await fetch(
    "https://reachdonorconnect.readyplayer.me/api/users",
    {
      method: "POST",
    }
  );

  const json = await response.json();
  return { token: json.data.token, rpm_user_id: json.data.id };
}

export async function fetchAllTemplates(token: string) {
  const response = await fetch(
    "https://api.readyplayer.me/v2/avatars/templates",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await response.json();
  return json.data;
}

export async function assignTemplateToUser(token: string, templateId: string) {
  const response = await fetch(
    `https://api.readyplayer.me/v2/avatars/templates/${templateId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          partner: "reachdonorconnect",
          bodyType: "fullbody",
        },
      }),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error?.message || "Failed to assign template");
  }
  return json.data;
}

export async function saveTokenAndUserIdToDB(
  token: string,
  userId: string,
  rpmUserId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("donors")
    .update({ rpm_token: token, rpm_user_id: rpmUserId })
    .eq("auth_uid", userId)
    .select("*");

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error("No matching donor row. Check auth_uid and RLS.");
  }

  return data[0];
}

export async function saveAvatarToRPM(token: string, avatarId: string) {
  const response = await fetch(
    `https://api.readyplayer.me/v2/avatars/${avatarId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error?.message || "Failed to save avatar");
  }
}

export type Category =
  | "footwear"
  | "facewear"
  | "headwear"
  | "top"
  | "shirt"
  | "bottom"
  | "outfit"
  | "glasses";

export type AssetItem = {
  id: string;
  name: string;
  iconUrl: string;
};
