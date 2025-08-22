import { NavigationMenuDemo } from "@/components/navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Fixed overlay navbar for authenticated users */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <NavigationMenuDemo />
        </div>
      </nav>

      {/* Main content with top padding to account for fixed navbar */}
      <main className="">{children}</main>
    </>
  );
}
