import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Lock, User, Shield, Check, AlertCircle, CheckCircle } from "lucide-react";
import { signup } from "./actions";

export default function SignupPage({ searchParams }: { searchParams: { error?: string; success?: string; email?: string } }) {
  const error = searchParams?.error;
  const success = searchParams?.success;
  const email = searchParams?.email;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              <div className="flex items-center justify-center mb-4">
                <Image
                  src="/logo.png"
                  alt="DonorConnect"
                  width={160}
                  height={50}
                  className="h-12 w-auto"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Start your journey of making a difference today
              </p>
            </div>

            {/* Signup Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                </div>
              )}
              
              {success && email && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Check Your Email!</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                    We've sent a confirmation email to <strong>{email}</strong>
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    Please click the link in the email to verify your account and complete your signup.
                  </p>
                  <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                    <Link 
                      href="/login"
                      className="text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 font-medium text-sm underline"
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
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-colors text-gray-900 dark:text-white bg-white dark:bg-gray-700"
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
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-colors text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Password must be at least 6 characters long
                  </p>
                </div>

                <div className="flex items-center">
                  <input 
                    id="terms" 
                    type="checkbox" 
                    required
                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400" 
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                  <button
                    formAction={signup}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-colors !transform-none !scale-100 hover:!scale-100 active:!scale-100 flex items-center justify-center gap-2"
                  >
                    Create Account
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p>
                  Your information is encrypted and secure. We never share your personal data 
                  and you can delete your account at any time.
                </p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Join 500+ donors making a difference</p>
              <div className="flex items-center justify-center gap-6 text-xs text-gray-400 dark:text-gray-500">
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
