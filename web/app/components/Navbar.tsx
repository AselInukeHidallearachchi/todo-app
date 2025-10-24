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
import {
  UserCircle,
  Shield,
  LogOut,
  Home,
  CheckSquare2,
  Plus,
  Settings2,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { user, loading, clearUser } = useUser();

  const handleLogout = async () => {
    clearUser();
    router.replace("/login");
  };

  const userData = user;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  if (loading) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/tasks"
            className="font-bold text-lg p-3 flex items-center gap-2"
          >
            <CheckSquare2 className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              TaskToDo
            </span>
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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 shadow-soft">
      <div className="w-full max-w-screen-2xl mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/tasks"
          className="font-bold text-lg p-3 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="p-1.5 bg-gradient-to-br from-primary to-primary/60 rounded-lg">
            <CheckSquare2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            TaskToDo
          </span>
        </Link>

        {/* Navigation Links - Only shown when user is logged in */}
        {userData && (
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="gap-2">
                <CheckSquare2 className="h-4 w-4" />
                My Tasks
              </Button>
            </Link>
            <Link href="/tasks/new">
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </Link>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Admin Badge */}
          {userData?.role === "admin" && (
            <div>
              <Link href="/admin/users">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-semibold">
                    Admin
                  </span>
                </Button>
              </Link>
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none hover:opacity-80 transition-opacity">
                <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                    {userData?.name ? (
                      getInitials(userData.name)
                    ) : (
                      <UserCircle className="h-6 w-6" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72 z-50">
              <DropdownMenuLabel className="p-4 pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                      {userData?.name ? getInitials(userData.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-none truncate">
                      {userData?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {userData?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push("/")}
                className="gap-2 cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/tasks")}
                className="gap-2 cursor-pointer"
              >
                <CheckSquare2 className="h-4 w-4" />
                <span>My Tasks</span>
              </DropdownMenuItem>

              {userData?.role === "admin" && (
                <DropdownMenuItem
                  onClick={() => router.push("/admin/users")}
                  className="gap-2 cursor-pointer"
                >
                  <Shield className="h-4 w-4" />
                  <span>Manage Users</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="cursor-pointer"
              >
                <Settings2 className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
