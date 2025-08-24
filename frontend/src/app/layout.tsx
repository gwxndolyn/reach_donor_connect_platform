import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavigationMenuDemo } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

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
  description: "Bridge the gap between generous donors and children in need through transparent, impactful giving.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Pages where navbar should NOT be shown
  const publicPages = ["/", "/login", "/signup", "/error"];
  const shouldHideNavbar = publicPages.includes(pathname) || pathname.startsWith("/signup/");
  
  // Only show navbar for authenticated users on protected pages
  const showNavbar = user !== null && !shouldHideNavbar;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Floating navbar - only show for authenticated users on protected pages */}
        {showNavbar && <NavigationMenuDemo />}

        {/* Main content */}
        <main className="">{children}</main>
      </body>
    </html>
  );
}
