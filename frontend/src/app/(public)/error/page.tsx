"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Oops! Something went wrong
        </h1>
        
        {message ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              Error: {message}
            </p>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We encountered an unexpected error. Please try again.
          </p>
        )}

        <div className="space-y-3">
          <Link 
            href="/login"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
          
          <Link 
            href="/"
            className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            Go to Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact us at{" "}
            <a href="mailto:support@donorconnect.com" className="text-red-600 dark:text-red-400 hover:underline">
              support@donorconnect.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
