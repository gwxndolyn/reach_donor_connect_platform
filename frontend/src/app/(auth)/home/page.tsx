import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Star,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: AuthData, error: AuthError } = await supabase.auth.getUser();
  if (AuthError || !AuthData?.user) {
    redirect("/login");
  }

  // Try to get donor data, but fallback to auth user data if not available
  const { data: DonorData, error: DonorError } = await supabase
    .from("donors")
    .select("*")
    .eq("auth_uid", AuthData.user.id)
    .single();

  // Use auth user metadata or email as fallback for display name
  const userName = DonorData?.name || "User";

  // Only redirect to onboarding if we specifically need onboarding
  // For now, we'll allow access even without the donors table
  // if (DonorError || !DonorData?.onboarded) {
  //   redirect("/signup/onboarding");
  // }

  // Get donations for this user to calculate real totals (with error handling)
  let donations = null;
  try {
    if (DonorData?.id) {
      const { data: donationsData } = await supabase
        .from("donations")
        .select(
          `
          *,
          children (
            name,
            age,
            location,
            profile_image_url
          )
        `
        )
        .eq("donor_id", DonorData.id)
        .order("created_at", { ascending: false });
      donations = donationsData;
    }
  } catch (error) {
    console.error("Error fetching donations:", error);
    donations = null;
  }

  // Calculate real donation totals
  const totalDonated =
    donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
  const monthlyTotal =
    donations
      ?.filter((donation) => {
        const donationDate = new Date(donation.created_at);
        const currentDate = new Date();
        return (
          donationDate.getMonth() === currentDate.getMonth() &&
          donationDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .reduce((sum, donation) => sum + donation.amount, 0) || 0;

  const uniqueChildren = new Set(donations?.map((d) => d.child_id)).size;

  // Mock data for recent activity
  const recentActivity = [
    {
      type: "donation",
      title: "Monthly donation processed",
      description:
        "Your $50 monthly donation to Maria Santos has been processed",
      time: "2 hours ago",
      icon: Heart,
      color: "text-red-500 bg-red-50 dark:bg-red-900/30",
    },
    {
      type: "update",
      title: "New photo from Alex",
      description:
        "Alex shared a new photo from his school graduation ceremony",
      time: "1 day ago",
      icon: Star,
      color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30",
    },
    {
      type: "message",
      title: "Letter received",
      description: "You received a thank you letter from Sofia Rodriguez",
      time: "3 days ago",
      icon: MessageCircle,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-900/30",
    },
  ];

  const stats = [
    {
      title: "Total Donated",
      value: totalDonated > 0 ? `$${totalDonated}` : "$1,250",
      change:
        monthlyTotal > 0 ? `+$${monthlyTotal} this month` : "+$50 this month",
      icon: DollarSign,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Children Supported",
      value: uniqueChildren > 0 ? uniqueChildren.toString() : "3",
      change: "Active connections",
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Impact Score",
      value: "94%",
      change: "Above average",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Member Since",
      value: "6 months",
      change: "Thank you!",
      icon: Calendar,
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  const supportedChildren = [
    {
      name: "Maria Santos",
      age: 8,
      location: "Philippines",
      image: "/image1.webp",
      progress: "Starting Grade 3 this year",
      totalDonated: "$600",
    },
    {
      name: "Alex Chen",
      age: 12,
      location: "Cambodia",
      image: "/image1.webp",
      progress: "Graduated primary school",
      totalDonated: "$450",
    },
    {
      name: "Sofia Rodriguez",
      age: 10,
      location: "Guatemala",
      image: "/image1.webp",
      progress: "Learning to read fluently",
      totalDonated: "$200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {userName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Here's your impact summary and recent updates from the children
                you support.
              </p>
            </div>
          </div>

          {/* Hero stats bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-red-500/20 dark:to-pink-500/20 rounded-xl border border-red-200/30 dark:border-red-600/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${totalDonated > 0 ? totalDonated : "1,250"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Impact
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {uniqueChildren > 0 ? uniqueChildren : "3"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Children Supported
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                6 months
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Member Since
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} shadow-lg`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Children You Support */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Children You Support
                  </h2>
                </div>
                <Link
                  href="/children"
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 py-2 rounded-lg transition-colors"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {supportedChildren.slice(0, 2).map((child, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-pink-200 dark:ring-pink-600 shadow-lg">
                        <Image
                          src={child.image}
                          alt={child.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {child.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {child.age} years old • {child.location}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border-l-4 border-blue-400 dark:border-blue-500">
                        {child.progress}
                      </p>
                      <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Your total support
                        </span>
                        <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                          {child.totalDonated}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Stories */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Impact This Month
                </h2>
              </div>

              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 border border-gradient-to-r from-blue-200 to-pink-200 dark:from-blue-600 dark:to-pink-600 shadow-inner">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      School Supplies Delivered
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      Your donations helped purchase supplies for 15 children
                    </p>
                  </div>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
                  Thanks to your monthly donation, Maria and her classmates
                  received new notebooks, pencils, and textbooks for the new
                  school year. 📚
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 last:pb-0 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.color} shadow-sm`}
                    >
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Quick Actions
                </h3>
              </div>

              <div className="space-y-3">
                <Link
                  href="/donations/new"
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Make a Donation
                </Link>

                <Link
                  href="/home/inbox"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send a Message
                </Link>

                <Link
                  href="/leaderboard"
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  View Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
