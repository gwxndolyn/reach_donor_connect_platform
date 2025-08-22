import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { logout } from "./actions";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data: AuthData, error: AuthError } = await supabase.auth.getUser();
  if (AuthError || !AuthData?.user) {
    redirect("/login");
  }

  const { data: DonorData, error: DonorError } = await supabase
    .from("Donors")
    .select("*")
    .eq("auth_uid", AuthData.user.id)
    .single();

  if (DonorError || !DonorData.onboarded) {
    redirect("/signup/onboarding");
  }

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow p-8 text-center">
          <p className="text-lg font-medium text-gray-800">
            Welcome to the dashboard,{" "}
            <span className="font-semibold">{DonorData.name}</span>
          </p>

          <form action={logout} className="mt-6">
            <button
              type="submit"
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-white font-semibold shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
