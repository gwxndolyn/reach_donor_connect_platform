import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, Mail, Lock } from "lucide-react";
import { login } from "./actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold text-gray-900">DonorConnect</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-600">
                Sign in to continue your journey of giving
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-red-600 hover:text-red-700 font-medium">
                    Forgot password?
                  </Link>
                </div>

                <button
                  formAction={login}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-pink-700 focus:ring-4 focus:ring-red-200 focus:outline-none transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link 
                    href="/signup" 
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">Trusted by 500+ donors worldwide</p>
              <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Secure Login
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Data Protected
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  100% Transparent
                </span>
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
                  alt="Children smiling"
                  width={400}
                  height={300}
                  className="rounded-2xl shadow-2xl mx-auto"
                />
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Your Kindness Creates Miracles
              </h2>
              <p className="text-xl text-red-100 max-w-md mx-auto">
                Every login brings you closer to the children whose lives you're transforming through your generous donations.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-12 max-w-sm mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold">1,000+</div>
                  <div className="text-red-100">Children Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">$2.5M</div>
                  <div className="text-red-100">Donated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
