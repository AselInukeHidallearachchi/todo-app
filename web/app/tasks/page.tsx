import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { TasksClient } from "./components/TasksClient";
import { apiServer } from "@/lib/api-server";
import { Task } from "@/types/task";

export const metadata: Metadata = {
  title: "My Tasks | TaskToDo",
  description: "View and manage all your tasks",
};

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  path: string;
}

// Backend returns this structure (wrapped in success object)
interface BackendResponse {
  success: boolean;
  message: string;
  data: {
    data: Task[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    path: string;
  };
}

interface TaskListPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    priority?: string;
    search?: string;
  }>;
}

async function getTasksWithFilters(
  searchParams: Awaited<TaskListPageProps["searchParams"]>
): Promise<{ tasks: Task[]; pagination: PaginationMeta }> {
  try {
    const params = new URLSearchParams();

    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.status && searchParams.status !== "all")
      params.set("status", searchParams.status);
    if (searchParams.priority && searchParams.priority !== "all")
      params.set("priority", searchParams.priority);
    if (searchParams.search) params.set("search", searchParams.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : "/tasks";

    console.log("🟢 [Server] Fetching tasks with endpoint:", endpoint);
    console.log("🟢 [Server] Page param from searchParams:", searchParams.page);
    console.log("🟢 [Server] Full search params:", searchParams);

    // Backend returns wrapped response
    const response = await apiServer<BackendResponse>(endpoint);

    console.log("🟢 [Server] Response received:", {
      success: response.success,
      totalTasks: response.data.total,
      currentPage: response.data.current_page,
      lastPage: response.data.last_page,
      tasksCount: response.data.data.length,
      from: response.data.from,
      to: response.data.to,
    });

    // Extract the nested data object
    const tasksData = response.data;

    return {
      tasks: tasksData.data || [],
      pagination: {
        current_page: tasksData.current_page || 1,
        last_page: tasksData.last_page || 1,
        per_page: tasksData.per_page || 10,
        total: tasksData.total || 0,
        from: tasksData.from || 0,
        to: tasksData.to || 0,
        path: tasksData.path || "/tasks",
      },
    };
  } catch (error) {
    console.error("❌ [Server] Failed to fetch tasks:", error);
    return {
      tasks: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
        path: "/tasks",
      },
    };
  }
}

export default async function TaskListPage({
  searchParams,
}: TaskListPageProps) {
  await requireAuth();

  const params = await searchParams;

  console.log("📋 [Server Component] Rendering with params:", params);

  const { tasks, pagination } = await getTasksWithFilters(params);

  console.log("📋 [Server Component] Passing to client:", {
    tasksCount: tasks.length,
    filters: {
      status: params.status || "all",
      priority: params.priority || "all",
      search: params.search || "",
    },
  });

  return (
    <TasksClient
      initialTasks={tasks}
      initialPagination={pagination}
      initialFilters={{
        status: params.status || "all",
        priority: params.priority || "all",
        search: params.search || "",
      }}
    />
  );
}
