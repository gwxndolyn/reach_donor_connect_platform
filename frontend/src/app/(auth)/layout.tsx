import { createClient } from "@/utils/supabase/server";
import { StaffNavbar } from "@/components/staff-navbar";
import { DonorNavbar } from "@/components/donor-navbar";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // handle unauthenticated users if needed
    return null;
  }

  // Check if user is staff
  const { data: staffData } = await supabase
    .from("Staff")
    .select("*")
    .eq("auth_uid", user.id)
    .single();

  const isStaff = !!staffData;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          {isStaff ? <StaffNavbar /> : <DonorNavbar />}
        </div>
      </nav>

      <main className="">{children}</main>
    </>
  );
}
