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
    <Link
        href="/dashboard"
        className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
        aria-label="Go to Dashboard"
      >
        <Heart className="h-6 w-6 text-red-500" />
        <span className="text-xl font-bold text-gray-900">DonorConnect</span>
      </Link>
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
      {/* Logo/Brand and Navigation Menu aligned to the left */}
      <div className="flex items-center space-x-6">
        <Brand />

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/mail">Mail Inbox</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/leaderboard">Leaderboard Map</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* User Menu */}
      <div className="flex items-center space-x-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2 px-2 py-1">
                <span className="text-lg">👤</span>
                <span className="text-sm font-medium">My Account</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col gap-1 p-2 w-48">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/donations"
                        className="flex flex-row items-center space-x-2 w-full p-2 rounded-md hover:bg-accent text-left w-full"
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
                          className="flex items-center space-x-2 w-full text-left rounded-md hover:bg-accent"
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
