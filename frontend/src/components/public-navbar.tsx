"use client";

import { Heart } from "lucide-react";

export function PublicNavbar() {
  return (
    <div className="flex items-center justify-between w-full py-2 space-y-1">
      <div className="flex items-center space-x-2">
        <Heart className="h-6 w-6 text-red-500" />
        <span className="text-xl font-bold text-gray-900">DonorConnect</span>
      </div>
    </div>
  );
}
