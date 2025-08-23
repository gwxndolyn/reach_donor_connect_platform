"use client";

import React from "react";
import Link from "next/link";
import {
  AvatarCreator,
  AvatarCreatorConfig,
  AvatarExportedEvent,
} from "@readyplayerme/react-avatar-creator";

const config: AvatarCreatorConfig = {
  clearCache: true,
  bodyType: "fullbody",
  quickStart: false,
  language: "en",
};

const style = { width: "100%", height: "100vh", border: "none" };

export default function HomePage() {
  const handleOnAvatarExported = (event: AvatarExportedEvent) => {
    console.log(`Avatar URL is: ${event.data.url}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col gap-4">
          {/* Donor Button */}
          <Link
            href="/login"
            className="group bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow px-4 py-3 flex items-center justify-center transition w-full"
          >
            <span className="mr-2">I am a Donor</span>
          </Link>

          {/* Staff Button */}
          <Link
            href="/staff"
            className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow px-4 py-3 flex items-center justify-center transition w-full"
          >
            <span className="mr-2">I am a Staff</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
