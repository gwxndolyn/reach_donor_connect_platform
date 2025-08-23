"use server";

import { createClient } from "@/utils/supabase/server";

export async function uploadNotes(formData: FormData) {
  return { ok: true };
}
