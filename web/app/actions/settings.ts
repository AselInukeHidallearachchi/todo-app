"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Update user email preferences
 * Handles form submission for daily digest settings
 * Automatically revalidates /settings page after update
 */
export async function updatePreferencesAction(
  prevState: unknown,
  formData: FormData
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

    // Extract form data
    const daily_digest_enabled =
      formData.get("daily_digest_enabled") === "true";
    const digest_time = formData.get("digest_time") as string;

    // Call API to update preferences
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/preferences`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          daily_digest_enabled,
          digest_time,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "Failed to update preferences",
      };
    }

    // Revalidate the settings page to reflect changes
    revalidatePath("/settings");

    return {
      success: true,
      message: "Preferences saved successfully!",
    };
  } catch (error) {
    console.error("Update preferences error:", error);
    return {
      success: false,
      message: "Failed to update preferences. Please try again.",
    };
  }
}
