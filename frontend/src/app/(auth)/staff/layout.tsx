"use client";

import { StaffNavbar } from "@/components/staff-navbar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Staff Navbar */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4">
          <StaffNavbar />
        </div>
      </div>
      
      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
} 