"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, User, LogOut } from "lucide-react";
import { logout } from "@/app/(auth)/dashboard/actions";
import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function Brand() {
  return (
    <div className="flex items-center space-x-2">
      <Heart className="h-6 w-6 text-red-500" />
      <span className="text-xl font-bold text-gray-900">DonorConnect</span>
    </div>
  );
}

export function NavigationMenuDemo() {
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading & logged-out: show brand only
  if (loading || !user) {
    return (
      <div className="flex items-center justify-between w-full py-2">
        <Brand />
      </div>
    );
  }

  // Logged-in: full navbar
  return (
    <div className="flex items-center justify-between w-full py-2">
      {/* Logo/Brand */}
      <Brand />

      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/dashboard">Dashboard</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Donate</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/donate"
                    >
                      <Heart className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Make a Difference
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Help those in need through our verified donation
                        platform.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/donate/emergency" title="Emergency Relief">
                  Support urgent humanitarian crises and disaster relief
                  efforts.
                </ListItem>
                <ListItem href="/donate/education" title="Education">
                  Fund educational programs and scholarships for underprivileged
                  students.
                </ListItem>
                <ListItem href="/donate/healthcare" title="Healthcare">
                  Provide medical assistance and healthcare access to
                  communities in need.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Programs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem title="Monthly Giving" href="/programs/monthly">
                  Set up recurring donations to provide consistent support.
                </ListItem>
                <ListItem
                  title="Corporate Partnerships"
                  href="/programs/corporate"
                >
                  Partner with us for corporate social responsibility
                  initiatives.
                </ListItem>
                <ListItem
                  title="Volunteer Opportunities"
                  href="/programs/volunteer"
                >
                  Join our community of volunteers making a direct impact.
                </ListItem>
                <ListItem title="Impact Reports" href="/programs/impact">
                  See how your donations are making a real difference.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/about">About</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* User Menu */}
      <div className="flex items-center space-x-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-8 w-8 rounded-full p-0">
                <User className="h-4 w-4" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-48">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/donations"
                        className="flex items-center space-x-2"
                      >
                        <Heart className="h-4 w-4" />
                        <span>My Donations</span>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <form action={logout} className="w-full">
                        <button
                          type="submit"
                          className="flex items-center space-x-2 w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </form>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className="block select-none space-y-1 rounded-md  leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
