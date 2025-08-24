"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Lock, AlertCircle, CheckCircle, UserCheck } from "lucide-react";
import { staffLogin, staffSignup } from "./actions";

export default function StaffAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const message = searchParams?.get('message');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="min-h-screen flex">
        {/* Left Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Image
                  src="/logo.png"
                  alt="DonorConnect Staff"
                  width={160}
                  height={50}
                  className="h-12 w-auto"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isLogin ? "Staff Portal" : "Join Our Team"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {isLogin ? "Access your staff dashboard" : "Register as a staff member"}
              </p>
            </div>

            {/* Auth Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                </div>
              )}
              
              {message && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">{message}</p>
                </div>
              )}

              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Staff Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your staff email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 focus:outline-none transition-colors text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 focus:outline-none transition-colors text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <button
                  formAction={isLogin ? staffLogin : staffSignup}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-pink-700 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800 focus:outline-none transition-colors flex items-center justify-center gap-2"
                >
                  {isLogin ? "Sign In" : "Create Staff Account"}
                  {isLogin ? <ArrowRight className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  {isLogin ? "New staff member?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
                  >
                    {isLogin ? "Register here" : "Sign in here"}
                  </button>
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  href="/login" 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  ← Back to donor login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-red-500 to-pink-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-center p-12">
            <div className="text-center text-white">
              <div className="mb-8">
                <Image
                  src="/image1.webp"
                  alt="Staff managing donations"
                  width={400}
                  height={300}
                  className="rounded-2xl shadow-2xl mx-auto"
                />
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Empowering Our Mission Together
              </h2>
              <p className="text-xl text-red-100 max-w-md mx-auto">
                Join our dedicated team in connecting donors with the children who need their support most.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-12 max-w-sm mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-red-100">Staff Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-red-100">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
