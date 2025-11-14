"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverApi } from "@/lib/api-server";
import type { Task } from "@/types/task";

interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export async function createTaskAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse<Task>> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const priority = formData.get("priority") as string;
    const due_date = formData.get("due_date") as string;

    // Validation
    if (!title?.trim()) {
      return {
        success: false,
        message: "Title is required",
      };
    }

    if (!due_date) {
      return {
        success: false,
        message: "Due date is required",
      };
    }

    const taskData = {
      title: title.trim(),
      description: description?.trim() || "",
      due_date: due_date || null,
      status: status || "todo",
      priority: priority || "medium",
    };

    const response = await serverApi.post<{ success: boolean; data: Task }>(
      "/tasks",
      taskData
    );

    // Revalidate the tasks list
    revalidatePath("/tasks");
    revalidatePath("/");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Create task error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create task",
    };
  }
}

export async function updateTaskAction(
  taskId: number,
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse<Task>> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const priority = formData.get("priority") as string;
    const due_date = formData.get("due_date") as string;

    const taskData = {
      title: title?.trim(),
      description: description?.trim() || "",
      due_date: due_date || null,
      status,
      priority,
    };

    const response = await serverApi.put<{ success: boolean; data: Task }>(
      `/tasks/${taskId}`,
      taskData
    );

    // Revalidate affected paths
    revalidatePath("/tasks");
    revalidatePath(`/tasks/${taskId}`);
    revalidatePath("/");

    return {
      success: true,
      data: response.data,
      message: "Task updated successfully!",
    };
  } catch (error) {
    console.error("Update task error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update task",
    };
  }
}

export async function deleteTaskAction(
  taskId: number
): Promise<ActionResponse> {
  try {
    await serverApi.delete(`/tasks/${taskId}`);

    // Revalidate affected paths
    revalidatePath("/tasks");
    revalidatePath("/");

    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error) {
    console.error("Delete task error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}

export async function deleteTaskAndRedirectAction(
  taskId: number
): Promise<void> {
  await deleteTaskAction(taskId);
  redirect("/tasks");
}
