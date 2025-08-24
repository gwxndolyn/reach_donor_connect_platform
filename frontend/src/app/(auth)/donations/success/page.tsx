import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, CheckCircle, ArrowRight, Home, Gift } from "lucide-react";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";

function SuccessContent({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const amount = searchParams.amount;
  const type = searchParams.type;
  const childName = searchParams.child || "a child in need";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6 pt-20">
      <div className="max-w-2xl w-full pt-20">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
              <Heart className="h-5 w-5 fill-current" />
              <span>Donation Successful!</span>
              <Heart className="h-5 w-5 fill-current" />
            </div>
          </div>

          {/* Thank you message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Thank You! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your generous {type === "monthly" ? "monthly" : "one-time"} donation of 
              <span className="font-bold text-green-600 mx-2"> ${amount} </span>
              has been successfully processed.
            </p>
            <p className="text-lg text-gray-700">
              You are making a real difference in {childName}'s life. Your kindness and generosity will help provide education, healthcare, and hope for a brighter future.
            </p>
          </div>

          {/* Impact message */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Gift className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Your Impact</h3>
            </div>
            <p className="text-blue-700 text-sm">
              {type === "monthly" 
                ? `Your monthly donation will provide ongoing support throughout the year. Together, we're building a sustainable future for children in need.`
                : `Your donation will immediately help provide essential resources like school supplies, nutritious meals, and healthcare support.`
              }
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donations"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              <Gift className="h-5 w-5" />
              View My Donations
            </Link>
            
            <Link
              href="/home"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </div>

          {/* Additional info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">
              You will receive an email confirmation shortly with your donation receipt.
              {type === "monthly" && " Your next monthly donation will be processed on the same date next month."}
            </p>
            
            <Link
              href="/donations/new"
              className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-medium transition-colors text-sm"
            >
              Make another donation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Quote section */}
        <div className="mt-8 text-center">
          <blockquote className="text-lg italic text-gray-600">
            "The best way to find yourself is to lose yourself in the service of others."
          </blockquote>
          <cite className="text-sm text-gray-500 mt-2 block">- Mahatma Gandhi</cite>
        </div>
      </div>
    </div>
  );
}

export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const supabase = await createClient();

  const { data: AuthData, error: AuthError } = await supabase.auth.getUser();
  if (AuthError || !AuthData?.user) {
    redirect("/login");
  }

  // Check if success parameters exist, if not redirect to donations
  if (!searchParams.success || !searchParams.amount) {
    redirect("/donations");
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
          <p className="text-green-700 font-medium">Processing your success...</p>
        </div>
      </div>
    }>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}