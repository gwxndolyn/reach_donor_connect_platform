"use client";

import { useState, useTransition } from "react";
import { createDonor } from "./actions";
import Image from "next/image";
import { User, MapPin, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null);
  const [successName, setSuccessName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (successName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12">
              {/* Success Animation */}
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome, {successName}!</h1>
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  You're all set to start making a difference!
                </p>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">What's Next?</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">1</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200">Browse children in need of support</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">2</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200">Choose a child to sponsor and make your first donation</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">3</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200">Receive updates and build meaningful connections</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => window.location.href = '/home'}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-colors !transform-none !scale-100 hover:!scale-100 active:!scale-100 flex items-center justify-center gap-2 mx-auto"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-8">
            <Logo
              width={180}
              height={55}
              className="h-14 w-auto"
            />
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">Account created</span>
              </div>
              <div className="w-8 h-1 bg-blue-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400">Complete profile</span>
              </div>
              <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 font-semibold text-sm">3</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Start giving</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's personalize your giving experience
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <form
            className="space-y-6"
            action={async (formData) => {
              setError(null);
              setSuccessName(null);
              startTransition(async () => {
                const res = await createDonor(formData);
                if (!res.ok) {
                  setError(res.error || "Something went wrong.");
                } else {
                  setSuccessName((res.donor as { name?: string })?.name ?? "Donor");
                }
              });
            }}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                What should we call you?
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-colors text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="region"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Which region are you in?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <select
                  id="region"
                  name="region"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-colors text-gray-900 dark:text-white appearance-none bg-white dark:bg-gray-700"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select your region
                  </option>
                  <option value="islands">Islands 離島</option>
                  <option value="kwai-tsing">Kwai Tsing 葵青</option>
                  <option value="north">North 北</option>
                  <option value="sai-kung">Sai Kung 西貢</option>
                  <option value="sha-tin">Sha Tin 沙田</option>
                  <option value="tai-po">Tai Po 大埔</option>
                  <option value="tsuen-wan">Tsuen Wan 荃灣</option>
                  <option value="tuen-mun">Tuen Mun 屯門</option>
                  <option value="yuen-long">Yuen Long 元朗</option>
                  <option value="kowloon-city">Kowloon City 九龍城</option>
                  <option value="kwun-tong">Kwun Tong 觀塘</option>
                  <option value="sham-shui-po">Sham Shui Po 深水埗</option>
                  <option value="wong-tai-sin">Wong Tai Sin 黃大仙</option>
                  <option value="yau-tsim-mong">Yau Tsim Mong 油尖旺</option>
                  <option value="central-western">Central and Western 中西</option>
                  <option value="eastern">Eastern 東</option>
                  <option value="southern">Southern 南</option>
                  <option value="wan-chai">Wan Chai 灣仔</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This helps us connect you with children in your area
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-center gap-3">
                <div className="w-5 h-5 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 dark:text-red-400 text-xs">!</span>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-colors !transform-none !scale-100 hover:!scale-100 active:!scale-100 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Setting up your profile...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By continuing, you're joining a community of {" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">500+ donors</span> making a difference
          </p>
        </div>
      </div>
    </div>
  );
}
