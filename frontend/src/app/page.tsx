import Link from "next/link";
import Image from "next/image";
import { Heart, Users, TrendingUp, Shield, ArrowRight, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative px-6 py-20 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Connect Hearts,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">
                  {" "}Change Lives
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Bridge the gap between generous donors and children in need. 
                See the direct impact of your donations and build lasting connections 
                that transform communities.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Giving Today
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/login" 
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/image1.webp"
                alt="Children benefiting from donations"
                width={600}
                height={400}
                className="w-full h-auto"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">1,000+</div>
                  <div className="text-sm text-gray-600">Children Helped</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Active Donors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose DonorConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make charitable giving transparent, personal, and impactful
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Track Your Impact
              </h3>
              <p className="text-gray-600">
                See exactly how your donations are being used and the real difference 
                you're making in children's lives.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Direct Connection
              </h3>
              <p className="text-gray-600">
                Build meaningful relationships with the children you support 
                through photos, letters, and progress updates.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                100% Transparent
              </h3>
              <p className="text-gray-600">
                Every dollar is accounted for. See detailed breakdowns of how 
                your donations are allocated and used.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Donors Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Regular Donor",
                content: "DonorConnect has transformed how I give. Seeing the direct impact of my donations and receiving updates from the children I support makes every contribution meaningful.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Corporate Sponsor",
                content: "The transparency and personal connection this platform provides is unmatched. Our company has been able to make a real difference in so many young lives.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Monthly Supporter",
                content: "I love getting letters and photos from the children I support. It's incredible to see them grow and thrive with the help of our donations.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-pink-600">
        <div className="px-6 mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join hundreds of donors who are already changing lives. 
            Start your journey of meaningful giving today.
          </p>
          <Link 
            href="/signup" 
            className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
