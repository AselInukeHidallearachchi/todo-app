import { requireAuth } from "@/lib/auth";
import { serverApi } from "@/lib/api-server";
import { SettingsClient } from "./components/SettingsClient";
import type { Metadata } from "next";

/**
 * Server Component: Settings Page
 * Fetches user preferences on the server
 * Passes data to SettingsClient for interactive form with Server Actions
 */

interface PreferencesData {
  daily_digest_enabled: boolean;
  digest_time: string;
}

interface PreferencesResponse {
  success: boolean;
  message: string;
  data: PreferencesData;
}

export const metadata: Metadata = {
  title: "Settings | TaskToDo",
  description: "Manage your email preferences and notifications",
};

async function getUserPreferences(): Promise<PreferencesData> {
  try {
    const response = await serverApi.get<PreferencesResponse>(
      "/user/preferences"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching preferences:", error);
    // Return default preferences if fetch fails
    return {
      daily_digest_enabled: false,
      digest_time: "06:00",
    };
  }
}

export default async function SettingsPage() {
  // Server-side auth check
  await requireAuth();

  // Fetch user preferences on the server
  const preferences = await getUserPreferences();

  // Return client component with server-fetched data
  return <SettingsClient initialPreferences={preferences} />;
}
