"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { logout } from "@/app/(auth)/dashboard/actions";
import { createClient } from "@/utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
    <div className="flex items-center">
      <Image
        src="/logo.png"
        alt="DonorConnect"
        width={120}
        height={40}
        className="h-10 w-auto"
      />
    </div>
  );
}

export function StaffNavbar() {
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

  if (loading || !user) {
    return (
      <div className="flex items-center justify-between w-full py-2">
        <Brand />
        <ThemeToggle />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full py-2">
      {/* Logo and navigation */}
      <div className="flex items-center space-x-6">
        <Brand />

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/staff/upload">Upload Notes</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* User menu with logout and theme toggle */}
      <div className="flex items-center space-x-2">
        <ThemeToggle />
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
