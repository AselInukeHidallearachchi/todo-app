"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import {
  AlertCircle,
  CheckCircle2,
  Shield,
  User,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/users");

      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      const error = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (error.response?.status === 403) {
        setError("Access denied — Admin access required");
        setTimeout(() => router.push("/tasks"), 2000);
      } else {
        setError(error.response?.data?.message || "Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  const toggleRole = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    setUpdatingId(user.id);
    setError("");
    setSuccess("");

    try {
      await api.patch(`/users/${user.id}/role`, { role: newRole });
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      setSuccess(`${user.name}'s role updated to ${newRole}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleActive = async (user: User) => {
    setUpdatingId(user.id);
    setError("");
    setSuccess("");

    try {
      const res = await api.patch(`/users/${user.id}/toggle`);
      setUsers(users.map((u) => (u.id === user.id ? res.data.user : u)));
      setSuccess(res.data.message);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to toggle user status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="max-w-6xl mx-auto p-6 animate-fade-in">
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

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 animate-slide-in-down">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-lg flex items-start gap-3 animate-slide-in-down">
            <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-success">{success}</p>
          </div>
        )}

        {/* Users Table */}
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
            {/* Table Header */}
            <div className="bg-card border-b border-border/50 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1fr_1fr_1fr] gap-4 items-center">
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

            {/* Table Body */}
            <div className="divide-y divide-border/30">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="px-6 py-4 hover:bg-muted/30 transition-colors duration-200 group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1fr_1fr_1fr] gap-4 items-center">
                    {/* User Name */}
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="min-w-0">
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Role Badge */}
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={`gap-1 w-fit  ${
                        user.role === "admin"
                          ? "bg-destructive hover:bg-destructive/90"
                          : " hover:bg-primary/90"
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>

                    <div className="flex items-center gap-2">
                      {updatingId === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={() => toggleActive(user)}
                          disabled={updatingId === user.id}
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

                    {/* Action Button */}
                    <div className="flex justify-left">
                      <Button
                        onClick={() => toggleRole(user)}
                        disabled={updatingId === user.id}
                        variant={user.role === "admin" ? "outline" : "default"}
                        size="sm"
                        className="gap-2"
                      >
                        {updatingId === user.id ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span className="hidden sm:inline">
                              Updating...
                            </span>
                          </>
                        ) : (
                          <>
                            <Shield className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">
                              Change to{" "}
                              {user.role === "admin" ? "User" : "Admin"}
                            </span>
                            <span className="sm:hidden">
                              {user.role === "admin" ? "User" : "Admin"}
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer */}
            {/* <div className="bg-muted/20 px-6 py-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground text-center">
                💡 Showing {users.length} user{users.length !== 1 ? "s" : ""} •
                Active users marked with green status
              </p>
            </div> */}
          </Card>
        )}
      </div>
    </div>
  );
}
