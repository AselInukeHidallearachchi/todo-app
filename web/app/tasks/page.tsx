import { requireAuth } from "@/lib/auth";
import { serverApi } from "@/lib/api-server";
import { TasksClient } from "./components/TasksClient";
import type { Metadata } from "next";
import { Task, PaginationMeta } from "@/types/task";
import { PaginatedApiResponse } from "@/types/api";

/**
 * Server Component: Tasks List Page
 * Fetches tasks on the server based on search params (filters, search, pagination)
 * Passes data to TasksClient for client-side interactivity
 * Supports shareable URLs with filters (e.g., /tasks?filter=completed&search=report)
 */

export const metadata: Metadata = {
  title: "Tasks | TaskToDo",
  description: "Manage and organize your tasks",
};

interface TasksPageProps {
  searchParams: Promise<{
    filter?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}

async function getTasks(filters: {
  filterBy: string;
  sortBy: string;
  searchQuery: string;
  page: number;
}): Promise<{ tasks: Task[]; pagination: PaginationMeta }> {
  try {
    const params = new URLSearchParams();
    params.append("page", filters.page.toString());
    params.append("per_page", "15");

    if (filters.filterBy !== "all") {
      params.append("status", filters.filterBy);
    }
    if (filters.sortBy === "priority") {
      params.append("sort", "priority");
    }
    if (filters.sortBy === "due-date") {
      params.append("sort", "due_date");
    }
    if (filters.searchQuery && filters.searchQuery.trim()) {
      params.append("search", filters.searchQuery.trim());
    }

    const response = await serverApi.get<PaginatedApiResponse<Task>>(
      `/tasks?${params.toString()}`
    );

    return {
      tasks: Array.isArray(response.data?.data) ? response.data.data : [],
      pagination: (response.data?.meta as PaginationMeta) || {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
        path: "/tasks",
      },
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      tasks: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0,
        path: "/tasks",
      },
    };
  }
}

export default async function TaskListPage({ searchParams }: TasksPageProps) {
  // Server-side auth check
  await requireAuth();

  // Parse search params
  const params = await searchParams;
  const filterBy = params.filter || "all";
  const sortBy = params.sort || "recent";
  const searchQuery = params.search || "";
  const page = parseInt(params.page || "1", 10);

  // Fetch tasks on the server
  const { tasks, pagination } = await getTasks({
    filterBy,
    sortBy,
    searchQuery,
    page,
  });

  // Return client component with server-fetched data
  return (
    <TasksClient
      initialTasks={tasks}
      initialPagination={pagination}
      initialFilters={{ filterBy, sortBy, searchQuery, page }}
    />
  );
}
