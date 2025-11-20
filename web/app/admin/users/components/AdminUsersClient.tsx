"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Shield, User, Loader, ArrowLeft } from "lucide-react";
import {
  toggleUserRoleAction,
  toggleUserStatusAction,
} from "@/app/actions/admin";
import { useToast } from "@/context/ToastContext";

/**
 * Client Component: Admin Users Management
 * Handles interactive user management (role toggle, status toggle)
 * Uses Server Actions for mutations (toggleUserRoleAction, toggleUserStatusAction)
 * Uses useTransition for optimistic UI updates
 */

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface AdminUsersClientProps {
  users: User[];
}

export function AdminUsersClient({
  users: initialUsers,
}: AdminUsersClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const toggleRole = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    setUpdatingId(user.id);

    try {
      const result = await toggleUserRoleAction(user.id, newRole);

      if (result.success) {
        // Optimistically update UI
        setUsers(
          users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
        showSuccess(
          "Role Updated",
          `${user.name}'s role updated to ${newRole}`
        );

        // Trigger server-side revalidation
        startTransition(() => {
          router.refresh();
        });
      } else {
        showError(
          "Update Failed",
          result.message || "Failed to update user role"
        );
      }
    } catch (err) {
      console.error("Error updating role:", err);
      showError("Error", "Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleActive = async (user: User) => {
    setUpdatingId(user.id);

    try {
      const result = await toggleUserStatusAction(user.id);

      if (result.success) {
        // Optimistically update UI
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, is_active: !u.is_active } : u
          )
        );
        showSuccess("Status Updated", result.message);

        // Trigger server-side revalidation
        startTransition(() => {
          router.refresh();
        });
      } else {
        showError(
          "Update Failed",
          result.message || "Failed to toggle user status"
        );
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      showError("Error", "Failed to toggle user status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                User Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage user roles and permissions
              </p>
            </div>

            <div className="flex gap-4">
              <div className="text-right px-4 py-3 bg-card rounded-lg border border-border/50">
                <p className="text-2xl font-bold text-primary">
                  {users.length}
                </p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users */}
        {users.length === 0 ? (
          <Card className="p-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No users found
            </h3>
            <p className="text-sm text-muted-foreground">
              There are no users in the system
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden shadow-soft-lg">
            {/* Table Header (desktop only) */}
            <div className="hidden md:block bg-card border-b border-border/50 px-6 py-4">
              <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr] gap-4 items-center">
                <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  User
                </div>
                <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Email
                </div>
                <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Role
                </div>
                <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Status
                </div>
                <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Action
                </div>
              </div>
            </div>

            {/* Table / Cards Body */}
            <div className="divide-y divide-border/30">
              {users.map((user) => (
                <div key={user.id}>
                  {/* Desktop Row */}
                  <div className="hidden md:grid px-6 py-4 hover:bg-muted/30 transition-colors duration-200 grid-cols-[1.5fr_2fr_1fr_1fr_1fr] gap-4 items-center">
                    {/* User */}
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <p className="font-medium text-foreground truncate">
                        {user.name}
                      </p>
                    </div>

                    {/* Email */}
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>

                    {/* Role */}
                    <Badge
                      variant={"outline"}
                      className={`gap-1 w-fit ${
                        user.role === "admin"
                          ? "bg-destructive hover:bg-destructive/90"
                          : "hover:bg-primary/90"
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {updatingId === user.id ? (
                        <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={() => toggleActive(user)}
                        />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          user.is_active
                            ? "text-green-600 dark:text-green-400"
                            : "text-destructive"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex justify-left">
                      <Button
                        onClick={() => toggleRole(user)}
                        disabled={updatingId === user.id || isPending}
                        variant={user.role === "admin" ? "outline" : "default"}
                        size="sm"
                        className="gap-2"
                      >
                        {updatingId === user.id ? (
                          <>
                            <Loader className="h-3.5 w-3.5 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Shield className="h-3.5 w-3.5" />
                            Change to {user.role === "admin" ? "User" : "Admin"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Card */}
                  <div className="block md:hidden border-b border-border/30 px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={user.role === "admin" ? "default" : "outline"}
                        className={`gap-1 ${
                          user.role === "admin"
                            ? "bg-destructive hover:bg-destructive/90"
                            : "hover:bg-primary/90"
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {updatingId === user.id ? (
                          <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <Switch
                            checked={user.is_active}
                            onCheckedChange={() => toggleActive(user)}
                          />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            user.is_active
                              ? "text-green-600 dark:text-green-400"
                              : "text-destructive"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <Button
                        onClick={() => toggleRole(user)}
                        size="sm"
                        disabled={updatingId === user.id || isPending}
                        variant={user.role === "admin" ? "outline" : "default"}
                      >
                        {updatingId === user.id ? (
                          <Loader className="h-3.5 w-3.5 animate-spin" />
                        ) : user.role === "admin" ? (
                          "Make User"
                        ) : (
                          "Make Admin"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
