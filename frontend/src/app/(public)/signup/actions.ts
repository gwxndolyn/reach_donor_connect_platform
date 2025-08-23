"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Signup error:', error.message);
    
    // Return user-friendly error message based on error type
    let errorMessage = "Something went wrong during signup";
    if (error.message.includes("User already registered")) {
      errorMessage = "An account with this email already exists";
    } else if (error.message.includes("Password should be")) {
      errorMessage = "Password must be at least 6 characters long";
    } else if (error.message.includes("Invalid email")) {
      errorMessage = "Please enter a valid email address";
    }
    
    redirect(`/signup?error=${encodeURIComponent(errorMessage)}`);
  }

  // Successful signup - redirect to confirmation message
  revalidatePath("/", "layout");
  redirect(`/signup?success=true&email=${encodeURIComponent(data.email)}`);
}
