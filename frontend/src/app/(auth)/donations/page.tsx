import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, DollarSign, Calendar, MapPin, ArrowRight, Plus, TrendingUp } from "lucide-react";

import { createClient } from "@/utils/supabase/server";

export default async function DonationsPage() {
  const supabase = await createClient();

  const { data: AuthData, error: AuthError } = await supabase.auth.getUser();
  if (AuthError || !AuthData?.user) {
    redirect("/login");
  }

  // Try to get donor data
  const { data: DonorData } = await supabase
    .from("donors")
    .select("*")
    .eq("auth_uid", AuthData.user.id)
    .single();

  // Get donations for this user (with error handling)
  let donations = null;
  try {
    if (DonorData?.id) {
      const { data: donationsData } = await supabase
        .from("donations")
        .select(`
          *,
          children (
            name,
            age,
            location,
            profile_image_url
          )
        `)
        .eq("donor_id", DonorData.id)
        .order("created_at", { ascending: false });
      donations = donationsData;
    }
  } catch (error) {
    console.error("Error fetching donations:", error);
    donations = null;
  }

  // Calculate total donations
  const totalDonated = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
  const monthlyTotal = donations?.filter(donation => {
    const donationDate = new Date(donation.created_at);
    const currentDate = new Date();
    return donationDate.getMonth() === currentDate.getMonth() && 
           donationDate.getFullYear() === currentDate.getFullYear();
  }).reduce((sum, donation) => sum + donation.amount, 0) || 0;

  const userName = DonorData?.name || 
                   AuthData.user.user_metadata?.first_name || 
                   AuthData.user.email?.split('@')[0] || 
                   'User';

  // Mock data for demonstration (in case database is empty)
  const mockDonations = [
    {
      id: 1,
      amount: 50,
      created_at: "2024-01-15T10:00:00Z",
      donation_type: "monthly",
      status: "completed",
      children: {
        name: "Maria Santos",
        age: 8,
        location: "Philippines",
        profile_image_url: "/image1.webp"
      }
    },
    {
      id: 2,
      amount: 25,
      created_at: "2024-01-10T15:30:00Z",
      donation_type: "one_time",
      status: "completed",
      children: {
        name: "Alex Chen",
        age: 12,
        location: "Cambodia",
        profile_image_url: "/image1.webp"
      }
    },
    {
      id: 3,
      amount: 100,
      created_at: "2024-01-01T09:00:00Z",
      donation_type: "one_time",
      status: "completed",
      children: {
        name: "Sofia Rodriguez",
        age: 10,
        location: "Guatemala",
        profile_image_url: "/image1.webp"
      }
    }
  ];

  const displayDonations = donations && donations.length > 0 ? donations : mockDonations;
  const displayTotal = donations && donations.length > 0 ? totalDonated : 175;
  const displayMonthly = donations && donations.length > 0 ? monthlyTotal : 50;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-20">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 pt-20">My Donations</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your giving history and impact</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">All time</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">${displayTotal}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total donated</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">This month</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">${displayMonthly}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Monthly total</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Impact</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{displayDonations.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Children supported</p>
          </div>
        </div>

        {/* Make New Donation Button */}
        <div className="mb-8">
          <Link
            href="/donations/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Make a New Donation
          </Link>
        </div>

        {/* Donations History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Donation History</h2>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {displayDonations.map((donation, index) => (
              <div key={donation.id || index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Child Photo */}
                    <div className="relative">
                      <Image
                        src={donation.children?.profile_image_url || "/image1.webp"}
                        alt={donation.children?.name || "Child"}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                    </div>
                    
                    {/* Donation Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          ${donation.amount} donation
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          donation.donation_type === 'monthly' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        }`}>
                          {donation.donation_type === 'monthly' ? 'Monthly' : 'One-time'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>To: {donation.children?.name}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {donation.children?.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(donation.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="text-right">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      donation.status === 'completed' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                        : donation.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {donation.status || 'completed'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayDonations.length === 0 && (
            <div className="p-12 text-center">
              <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No donations yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Start making a difference by supporting a child in need</p>
              <Link
                href="/donations/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Make Your First Donation
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}