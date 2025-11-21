"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"
  );
};

/**
 * Get auth token from cookies
 */
async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("auth-token")?.value;
}

/**
 * Delete a task by ID
 */
export async function deleteTaskAction(
  taskId: number
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please log in again.",
      };
    }

    const response = await fetch(`${getApiBaseUrl()}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "Failed to delete task",
      };
    }

    // Revalidate the tasks page to reflect the deletion
    revalidatePath("/tasks");

    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error) {
    console.error("Delete task error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while deleting the task",
    };
  }
}

/**
 * Update a task
 */
export async function updateTaskAction(
  taskId: number,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please log in again.",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const priority = formData.get("priority") as string;
    const due_date = formData.get("due_date") as string;

    // Validation
    if (!title) {
      return {
        success: false,
        message: "Title is required",
      };
    }

    const response = await fetch(`${getApiBaseUrl()}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
        due_date,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "Failed to update task",
      };
    }

    const data = await response.json();

    // Revalidate the tasks page and the specific task page
    revalidatePath("/tasks");
    revalidatePath(`/tasks/${taskId}`);

    return {
      success: true,
      message: "Task updated successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Update task error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the task",
    };
  }
}

/**
 * Create a new task
 */
export async function createTaskAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please log in again.",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const priority = formData.get("priority") as string;
    const due_date = formData.get("due_date") as string;

    // Validation
    if (!title) {
      return {
        success: false,
        message: "Title is required",
      };
    }

    const response = await fetch(`${getApiBaseUrl()}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        status: status || "todo",
        priority: priority || "medium",
        due_date,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "Failed to create task",
      };
    }

    const data = await response.json();

    // Revalidate the tasks page
    revalidatePath("/tasks");

    return {
      success: true,
      message: "Task created successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Create task error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while creating the task",
    };
  }
}
