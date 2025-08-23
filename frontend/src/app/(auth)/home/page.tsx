import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, TrendingUp, Users, Calendar, DollarSign, Star, ArrowRight, MessageCircle } from "lucide-react";

import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: AuthData, error: AuthError } = await supabase.auth.getUser();
  if (AuthError || !AuthData?.user) {
    redirect("/login");
  }

  const { data: DonorData, error: DonorError } = await supabase
    .from("Donors")
    .select("*")
    .eq("auth_uid", AuthData.user.id)
    .single();

  if (DonorError || !DonorData?.onboarded) {
    redirect("/signup/onboarding");
  }

  // Mock data for the authenticated home page
  const recentActivity = [
    {
      type: "donation",
      title: "Monthly donation processed",
      description: "Your $50 monthly donation to Maria Santos has been processed",
      time: "2 hours ago",
      icon: Heart,
      color: "text-red-500 bg-red-50"
    },
    {
      type: "update",
      title: "New photo from Alex",
      description: "Alex shared a new photo from his school graduation ceremony",
      time: "1 day ago",
      icon: Star,
      color: "text-yellow-500 bg-yellow-50"
    },
    {
      type: "message",
      title: "Letter received",
      description: "You received a thank you letter from Sofia Rodriguez",
      time: "3 days ago",
      icon: MessageCircle,
      color: "text-blue-500 bg-blue-50"
    }
  ];

  const stats = [
    {
      title: "Total Donated",
      value: "$1,250",
      change: "+$50 this month",
      icon: DollarSign,
      color: "text-green-600 bg-green-100"
    },
    {
      title: "Children Supported",
      value: "3",
      change: "Active connections",
      icon: Users,
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "Impact Score",
      value: "94%",
      change: "Above average",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100"
    },
    {
      title: "Member Since",
      value: "6 months",
      change: "Thank you!",
      icon: Calendar,
      color: "text-orange-600 bg-orange-100"
    }
  ];

  const supportedChildren = [
    {
      name: "Maria Santos",
      age: 8,
      location: "Philippines",
      image: "/image1.webp",
      progress: "Starting Grade 3 this year",
      totalDonated: "$600"
    },
    {
      name: "Alex Chen",
      age: 12,
      location: "Cambodia",
      image: "/image1.webp",
      progress: "Graduated primary school",
      totalDonated: "$450"
    },
    {
      name: "Sofia Rodriguez",
      age: 10,
      location: "Guatemala",
      image: "/image1.webp",
      progress: "Learning to read fluently",
      totalDonated: "$200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {DonorData.first_name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your impact summary and recent updates from the children you support.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Children You Support */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Children You Support</h2>
                <Link 
                  href="/children" 
                  className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {supportedChildren.slice(0, 2).map((child, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={child.image}
                          alt={child.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{child.name}</h3>
                        <p className="text-sm text-gray-500">{child.age} years old • {child.location}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{child.progress}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Your total support</span>
                        <span className="font-semibold text-green-600">{child.totalDonated}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Stories */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Impact This Month</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">School Supplies Delivered</h3>
                    <p className="text-blue-700">Your donations helped purchase supplies for 15 children</p>
                  </div>
                </div>
                <p className="text-sm text-blue-600">
                  Thanks to your monthly donation, Maria and her classmates received new notebooks, 
                  pencils, and textbooks for the new school year. 📚
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 last:pb-0 border-b border-gray-100 last:border-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link 
                  href="/donate"
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Make a Donation
                </Link>
                
                <Link 
                  href="/messages"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send a Message
                </Link>
                
                <Link 
                  href="/leaderboard"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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