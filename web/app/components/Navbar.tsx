"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle, Shield } from "lucide-react";
import { useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const { user, loading, clearUser } = useUser();

  const handleLogout = async () => {
    clearUser();
    router.replace("/login");
  };

  const userData = user?.user || user;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  if (loading) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/tasks" className="font-bold text-lg p-3">
            Todo App
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <UserCircle className="h-6 w-6 animate-pulse" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/tasks" className="font-bold text-lg p-3">
          Todo App
        </Link>

        <div className="flex items-center gap-4">
          {userData?.role === "admin" && (
            <div className="px-2 py-1.5">
              <Link
                href="/admin/users"
                className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium bg-muted/40 hover:bg-muted transition-colors"
              >
                <Shield className="h-4 w-4 text-primary" />
                <span>Manage Users</span>
              </Link>
            </div>
          )}
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>
                    {userData?.name ? (
                      getInitials(userData.name)
                    ) : (
                      <UserCircle className="h-6 w-6" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60 z-50">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userData?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userData?.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
