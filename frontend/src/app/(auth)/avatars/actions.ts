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

export async function saveAvatarToDB(
  token: string,
  avatarId: string,
  userId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Not authenticated");

  const response = await fetch(
    `https://api.readyplayer.me/v2/avatars/${avatarId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error?.message || "Failed to save avatar to RPM");
  }

  const rpmResponse = await fetch(
    `https://models.readyplayer.me/${avatarId}.glb`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!rpmResponse.ok) {
    throw new Error(`Failed to fetch GLB from RPM: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const file = new Blob([arrayBuffer], { type: "model/gltf-binary" });

  // 2. Upload to Supabase Storage
  const filePath = `public/${avatarId}.glb`;
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      contentType: "model/gltf-binary",
      upsert: true,
    });

  const payload = {
    auth_uid: user.id, // <- ownership
    rpm_token: token,
    avatar_path: data?.path, // whatever path you saved in Storage
  };

  const { data: DonorData, error: DonorError } = await supabase
    .from("donors")
    .upsert(payload, {
      onConflict: "auth_uid",
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (DonorError) throw DonorError;

  return { path: data?.path, filePath };
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

export async function fetchAssetsByGenderAndType(
  token: string,
  gender: string,
  type: Category,
  page: number
) {
  console.log(`Fetching assets: gender=${gender}, type=${type}, page=${page}`);

  const url = `https://api.readyplayer.me/v1/assets?gender=${gender}&gender=neutral&page=${page}&type=${type}`;
  console.log(`API URL: ${url}`);

  const response = await fetch(url, {
    headers: {
      "X-APP-ID":
        process.env.READYPLAYERME_APPLICATION_ID || "68a7e922e142ad91c2d6e9fa",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("API response:", json);

  if (Array.isArray(json.data)) {
    const result = json.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      iconUrl: item.iconUrl,
    }));
    console.log("Mapped result:", result);
    return result;
  } else {
    console.log("No data array in response.");
    return [];
  }
}
