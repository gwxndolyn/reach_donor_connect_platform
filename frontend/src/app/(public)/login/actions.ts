"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Login error:', error.message);
    
    // Return user-friendly error message based on error type
    let errorMessage = "Invalid email or password";
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Incorrect email or password";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please check your email and confirm your account";
    }
    
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
