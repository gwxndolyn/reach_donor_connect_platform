import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    
    if (!error && data.user) {
      // After successful email confirmation, check if user came from staff signup
      // Try to add them to staff table (this will fail silently if they're already there or not a staff user)
      const { error: staffError } = await supabase
        .from("staff")
        .insert([{ auth_uid: data.user.id }]);
      
      // Ignore errors here - user might already exist or might not be staff
      
      // Check if they're a staff user and redirect appropriately
      const { data: staffData } = await supabase
        .from("staff")
        .select("*")
        .eq("auth_uid", data.user.id)
        .single();
        
      if (staffData) {
        redirect("/staff/upload");
      }
      
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
