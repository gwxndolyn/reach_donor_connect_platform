"use client";

import { StaffNavbar } from "@/components/staff-navbar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">   
      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
} 