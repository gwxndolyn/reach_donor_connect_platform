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

  const { data: authData, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/staff?error=" + encodeURIComponent("Invalid email or password"));
  }

  // Check if user exists in Staff table
  const { data: staffData, error: staffError } = await supabase
    .from("staff")
    .select("*")
    .eq("auth_uid", authData.user.id)
    .single();

  if (staffError || !staffData) {
    // User authenticated but not in staff database - sign them out and redirect
    await supabase.auth.signOut();
    redirect("/staff?error=" + encodeURIComponent("Access denied. Staff account required."));
  }

  revalidatePath("/staff/upload", "layout");
  redirect("/staff/upload");
}

// Staff signup
export async function staffSignup(formData: FormData) {
  const supabase = await createClient();

  // Extract credentials
  const email = (formData.get("email") || "").toString().trim();
  const password = (formData.get("password") || "").toString().trim();

  if (!email || !password) {
    redirect("/staff?error=" + encodeURIComponent("Email and password are required."));
  }

  // Sign up the staff member
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) {
    redirect("/staff?error=" + encodeURIComponent(signupError.message));
  }

  // Always add to staff table immediately after signup (whether confirmed or not)
  if (signupData.user) {
    // If user has a session, use the authenticated client to insert staff record
    if (signupData.session) {
      const { error: staffError } = await supabase
        .from("staff")
        .insert([{ auth_uid: signupData.user.id }]);

      if (staffError) {
        redirect("/staff?error=" + encodeURIComponent(staffError.message));
      }
    } else {
      // For users that need email confirmation, we'll add them to staff table after confirmation
      // For now, just proceed with the email confirmation flow
    }
  }

  // If user has session (immediately confirmed), redirect to upload page
  if (signupData.session) {
    revalidatePath("/staff/upload", "layout");
    redirect("/staff/upload");
  }

  // If user needs email confirmation, redirect with message
  redirect("/staff?message=" + encodeURIComponent("Please check your email and click the confirmation link to complete your staff registration."));
}