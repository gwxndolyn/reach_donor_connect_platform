// This is a SERVER COMPONENT (no "use client")
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavigationMenuDemo } from "@/components/navbar";
import { StaffNavbar } from "@/components/staff-navbar";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { ThemeProvider } from "@/contexts/theme-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DonorConnect - Connect Hearts, Change Lives",
  description:
    "Bridge the gap between generous donors and children in need through transparent, impactful giving.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const publicPages = ["/", "/login", "/signup", "/error"];
  const shouldHideNavbar =
    publicPages.includes(pathname) || pathname.startsWith("/signup/");

  const showNavbar = user !== null && !shouldHideNavbar;

  // Check if user is staff (only if user exists and we should show navbar)
  let isStaff = false;
  if (user && showNavbar) {
    const { data: staffData } = await supabase
      .from("staff")
      .select("*")
      .eq("auth_uid", user.id)
      .single();
    isStaff = !!staffData;
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {/* Navbar - only show for donors, not staff */}
          {showNavbar && !isStaff && (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="container mx-auto px-4">
                <NavigationMenuDemo />
              </div>
            </nav>)}

          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
