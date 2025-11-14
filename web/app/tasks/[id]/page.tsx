import { requireAuth } from "@/lib/auth";
import { serverApi } from "@/lib/api-server";
import { TaskDetailClient } from "./components/TaskDetailClient";
import type { Metadata } from "next";
import { Task } from "@/types/task";
import { SingleResourceResponse } from "@/types/api";
import { notFound } from "next/navigation";

/**
 * Server Component: Task Detail Page
 * Fetches task data on the server for SEO and performance
 * Generates dynamic metadata for each task
 * Passes data to TaskDetailClient for interactive edit/delete functionality
 */

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getTask(id: string): Promise<Task | null> {
  try {
    const response = await serverApi.get<SingleResourceResponse<Task>>(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: TaskDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const task = await getTask(id);

  if (!task) {
    return {
      title: "Task Not Found | TaskToDo",
      description: "The requested task could not be found",
    };
  }

  return {
    title: `${task.title} | TaskToDo`,
    description: task.description || `Task: ${task.title}`,
  };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  // Server-side auth check
  await requireAuth();

  // Parse params
  const { id } = await params;

  // Fetch task data on the server
  const task = await getTask(id);

  // Handle not found
  if (!task) {
    notFound();
  }

  // Return client component with server-fetched data
  return <TaskDetailClient initialTask={task} taskId={id} />;
}
