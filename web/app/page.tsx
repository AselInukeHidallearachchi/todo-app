import { requireAuth } from "@/lib/auth";
import { serverApi } from "@/lib/api-server";
import { DashboardClient } from "./components/DashboardClient";
import type { Metadata } from "next";

interface TaskStats {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
}

interface TaskStatsResponse {
  success: boolean;
  data: TaskStats;
}

export const metadata: Metadata = {
  title: "Dashboard | TaskToDo",
  description: "Track your tasks and productivity",
};

async function getTaskStatistics(): Promise<TaskStats> {
  try {
    const response = await serverApi.get<TaskStatsResponse>(
      "/tasks-statistics"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    return {
      total: 0,
      completed: 0,
      in_progress: 0,
      pending: 0,
    };
  }
}

export default async function Home() {
  // Server-side auth check - this runs on the server
  const user = await requireAuth();

  // Fetch data on the server
  const stats = await getTaskStatistics();

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Return the client component with server-fetched data
  return (
    <DashboardClient
      user={user}
      stats={stats}
      completionRate={completionRate}
    />
  );
}
