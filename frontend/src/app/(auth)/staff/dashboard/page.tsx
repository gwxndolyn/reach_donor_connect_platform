import { redirect } from "next/navigation";
import Image from "next/image";

import { createClient } from "@/utils/supabase/server";
import { logout } from "./actions";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data: AuthData, error: AuthError } = await supabase.auth.getUser();
  if (AuthError || !AuthData?.user) {
    redirect("/login");
  }

  const { data: StaffData, error: StaffError } = await supabase
    .from("staff")
    .select("*")
    .eq("auth_uid", AuthData.user.id)
    .single();

  return (
    <>
      <div className="w-full bg-white rounded-2xl">
        <div className="flex items-center gap-8 h-full">
          {/* Image on the left - takes up half the page */}
          <div className="w-7/8">
            <Image
              src="/image1.webp"
              alt="Reach - DonorConnect Platform"
              width={600}
              height={400}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>

          {/* Text on the right - takes up the other half */}
          <div className="w-1/2 text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to DonorConnect
            </h1>

            <p className="text-lg text-gray-800 px-1">
              Connecting you directly to our children.
            </p>
            <p className="text-lg text-gray-800 px-1">
              Showing you the impact of your donations and how they change
              lives.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
