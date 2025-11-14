import { requireAdmin } from "@/lib/auth";
import { serverApi } from "@/lib/api-server";
import { AdminUsersClient } from "./components/AdminUsersClient";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

/**
 * Server Component: Admin Users Management Page
 * Requires admin role to access (enforced by requireAdmin)
 * Fetches all users on the server
 * Passes data to AdminUsersClient for interactive management
 */

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface UsersResponse {
  success: boolean;
  data: User[];
}

export const metadata: Metadata = {
  title: "User Management | TaskToDo",
  description: "Manage users, roles, and permissions",
};

async function getUsers(): Promise<User[]> {
  try {
    const response = await serverApi.get<UsersResponse>("/users");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    // If forbidden, redirect to tasks page
    if (err.response?.status === 403) {
      redirect("/tasks");
    }
    console.error("Error fetching users:", error);
    return [];
  }
}

export default async function AdminUsersPage() {
  // Server-side admin auth check - redirects if not admin
  await requireAdmin();

  // Fetch users on the server
  const users = await getUsers();

  // Return client component with server-fetched data
  return <AdminUsersClient users={users} />;
}
