import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, DollarSign, ArrowLeft, Calendar, MapPin, User, Star } from "lucide-react";
import { createDonation } from "./actions";

import { createClient } from "@/utils/supabase/server";

export default async function NewDonationPage() {
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

  // Get available children to support (with error handling)
  let children = null;
  try {
    const { data: childrenData } = await supabase
      .from("children")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });
    children = childrenData;
  } catch (error) {
    console.error("Error fetching children:", error);
    children = null;
  }

  // Mock data for demonstration
  const mockChildren = [
    {
      id: 1,
      name: "Emma Garcia",
      age: 9,
      location: "Peru",
      profile_image_url: "/image1.webp",
      story: "Emma loves to draw and dreams of becoming an artist. She needs support for school supplies and art materials.",
      needs: ["Education", "Art supplies", "School uniform"],
      monthly_support_needed: 35
    },
    {
      id: 2,
      name: "David Kim",
      age: 11,
      location: "Vietnam",
      profile_image_url: "/image1.webp",
      story: "David is passionate about learning and wants to become a teacher. He needs help with school fees and books.",
      needs: ["Education", "Books", "Transportation"],
      monthly_support_needed: 40
    },
    {
      id: 3,
      name: "Lucia Santos",
      age: 7,
      location: "Brazil",
      profile_image_url: "/image1.webp",
      story: "Lucia is just starting school and needs support for basic education and nutrition.",
      needs: ["Education", "Nutrition", "Healthcare"],
      monthly_support_needed: 30
    }
  ];

  const displayChildren = children && children.length > 0 ? children : mockChildren;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-20">
          <Link 
            href="/donations" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Donations
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a New Donation</h1>
          <p className="text-gray-600">Choose a child to support and make a difference in their life</p>
        </div>

        {/* Quick Donation Options */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Donation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[25, 50, 100, 200].map((amount) => (
              <form key={amount} action={createDonation}>
                <input type="hidden" name="amount" value={amount} />
                <input type="hidden" name="donation_type" value="one_time" />
                <input type="hidden" name="child_id" value="1" />
                <button
                  type="submit"
                  className="w-full bg-gray-50 hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-lg p-4 text-center transition-all group"
                >
                  <DollarSign className="h-6 w-6 text-gray-400 group-hover:text-red-500 mx-auto mb-2" />
                  <span className="text-lg font-semibold text-gray-900">${amount}</span>
                </button>
              </form>
            ))}
          </div>
        </div>

        {/* Children to Support */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Children in Need</h2>
          
          {displayChildren.map((child, index) => (
            <div key={child.id || index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Child Photo and Basic Info */}
                  <div className="flex-shrink-0">
                    <Image
                      src={child.profile_image_url || "/image1.webp"}
                      alt={child.name}
                      width={150}
                      height={150}
                      className="rounded-xl object-cover"
                    />
                  </div>
                  
                  {/* Child Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{child.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Age {child.age}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {child.location}
                          </div>
                        </div>
                      </div>
                      
                      {/* Monthly Support Needed */}
                      <div className="text-right">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-lg font-semibold text-blue-900">
                            ${child.monthly_support_needed || 35}/month
                          </div>
                          <div className="text-xs text-blue-600">Suggested support</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Story */}
                    <p className="text-gray-700 mb-4">{child.story}</p>
                    
                    {/* Needs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {child.needs?.map((need: string, needIndex: number) => (
                        <span key={needIndex} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {need}
                        </span>
                      ))}
                    </div>
                    
                    {/* Donation Form */}
                    <form action={createDonation} className="flex flex-col sm:flex-row gap-4">
                      <input type="hidden" name="child_id" value={child.id} />
                      
                      <div className="flex gap-2">
                        <input
                          type="number"
                          name="amount"
                          placeholder="Amount ($)"
                          min="1"
                          required
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        
                        <select
                          name="donation_type"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="one_time">One-time</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-colors flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        Donate to {child.name}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {displayChildren.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No children available</h3>
            <p className="text-gray-600">Please check back later for children in need of support.</p>
          </div>
        )}
      </div>
    </div>
  );
}