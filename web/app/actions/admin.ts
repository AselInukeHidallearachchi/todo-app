"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleUserRoleAction(
  userId: number,
  newRole: "admin" | "user"
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "Failed to update user role",
      };
    }

    const data = await response.json();

    // Revalidate the admin users page
    revalidatePath("/admin/users");

    return {
      success: true,
      message: data.message || `User role updated to ${newRole}`,
      data: data.data,
    };
  } catch (error) {
    console.error("Toggle user role error:", error);
    return {
      success: false,
      message: "Failed to update user role. Please try again.",
    };
  }
}

export async function toggleUserStatusAction(userId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/toggle`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "Failed to toggle user status",
      };
    }

    const data = await response.json();

    // Revalidate the admin users page
    revalidatePath("/admin/users");

    return {
      success: true,
      message: data.message || "User status updated",
      data: data.data,
    };
  } catch (error) {
    console.error("Toggle user status error:", error);
    return {
      success: false,
      message: "Failed to toggle user status. Please try again.",
    };
  }
}
