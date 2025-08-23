import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, Mail, Lock, User, Shield, Check, AlertCircle, CheckCircle } from "lucide-react";
import { signup } from "./actions";

export default function SignupPage({ searchParams }: { searchParams: { error?: string; success?: string; email?: string } }) {
  const error = searchParams?.error;
  const success = searchParams?.success;
  const email = searchParams?.email;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="min-h-screen flex">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-center p-12">
            <div className="text-center text-white max-w-lg">
              <div className="mb-8">
                <Image
                  src="/image1.webp"
                  alt="Happy children"
                  width={400}
                  height={300}
                  className="rounded-2xl shadow-2xl mx-auto"
                />
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Join Our Mission of Hope
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Become part of a community that believes in the power of giving. 
                Your generosity can change a child's entire future.
              </p>
              
              {/* Features */}
              <div className="space-y-4 text-left max-w-sm mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-blue-100">Track your donation impact</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-blue-100">Connect with supported children</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-blue-100">100% transparent giving</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-blue-100">Join a caring community</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold text-gray-900">DonorConnect</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Start your journey of making a difference today
              </p>
            </div>

            {/* Signup Form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              
              {success && email && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-green-900">Check Your Email!</h3>
                  </div>
                  <p className="text-green-700 text-sm mb-3">
                    We've sent a confirmation email to <strong>{email}</strong>
                  </p>
                  <p className="text-green-600 text-sm">
                    Please click the link in the email to verify your account and complete your signup.
                  </p>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <Link 
                      href="/login"
                      className="text-green-700 hover:text-green-800 font-medium text-sm underline"
                    >
                      Already confirmed? Sign in here →
                    </Link>
                  </div>
                </div>
              )}
              
              {!success && (
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
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-gray-900"
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
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-gray-900"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters with letters and numbers
                  </p>
                </div>

                <div className="flex items-center">
                  <input 
                    id="terms" 
                    type="checkbox" 
                    required
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                  <button
                    formAction={signup}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Create Account
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p>
                  Your information is encrypted and secure. We never share your personal data 
                  and you can delete your account at any time.
                </p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">Join 500+ donors making a difference</p>
              <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Secure & Private
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Free Forever
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Instant Impact
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
