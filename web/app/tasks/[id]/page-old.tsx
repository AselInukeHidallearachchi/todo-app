/**
 * Task Detail Page - Server Component
 * 
 * Fetches individual task data server-side and generates dynamic metadata.
 * Delegates interactive features to TaskDetailClient component.
 */

import { requireAuth } from "@/lib/auth";
import { serverApi } from "@/lib/api-server";
import { TaskDetailClient } from "./components/TaskDetailClient";
import { notFound } from "next/navigation";
import type { Task } from "@/types/task";
import type { Metadata } from "next";

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

interface TaskResponse {
  success: boolean;
  data: Task;
}

export async function generateMetadata({ params }: TaskDetailPageProps): Promise<Metadata> {
  try {
    const response = await serverApi.get<TaskResponse>(`/tasks/${params.id}`);
    const task = response.data;

    return {
      title: `${task.title} | TaskToDo`,
      description: task.description || `Task details for ${task.title}`,
    };
  } catch {
    return {
      title: "Task Not Found | TaskToDo",
    };
  }
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  await requireAuth();

  let task: Task | null = null;

  try {
    const response = await serverApi.get<TaskResponse>(`/tasks/${params.id}`);
    task = response.data;
  } catch (err) {
    console.error("Error fetching task:", err);
    notFound();
  }

  if (!task) {
    notFound();
  }

  return <TaskDetailClient initialTask={task} />;
}
