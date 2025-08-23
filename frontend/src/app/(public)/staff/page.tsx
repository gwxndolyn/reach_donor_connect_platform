"use client";

import { useState } from "react";
import { staffLogin, staffSignup } from "./actions";

export default function StaffAuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Staff Login" : "Staff Signup"}
        </h2>

        {/* Form */}
        <form className="space-y-5">
           <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Staff Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              formAction={isLogin ? staffLogin : staffSignup}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {isLogin ? "Log in" : "Sign up"}
            </button>
          </div>
        </form>

        {/* Toggle link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          {isLogin ? "New staff?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-700 underline font-medium"
          >
            {isLogin ? "Sign up here" : "Log in here"}
          </button>
        </p>
      </div>
    </div>
  );
}
