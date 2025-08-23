"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

// Staff login
export async function staffLogin(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/staff/dashboard", "layout");
  redirect("/staff/dashboard");
}

// Staff signup
export async function staffSignup(formData: FormData) {
  const supabase = await createClient();

  // Extract credentials
  const email = (formData.get("email") || "").toString().trim();
  const password = (formData.get("password") || "").toString().trim();

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  // Sign up the staff member
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError || !signupData?.user) {
    return { ok: false, error: signupError?.message || "Signup failed." };
  }

  // Insert staff entry into Staff table
  const { data: staffData, error: staffError } = await supabase
    .from("Staff")
    .insert([{ auth_uid: signupData.user.id }])
    .select("*");

  if (staffError) {
    return { ok: false, error: staffError.message };
  }

  // Redirect to staff dashboard
  revalidatePath("/staff/dashboard", "layout");
  redirect("/staff/dashboard");

  return { ok: true, staff: staffData };
}