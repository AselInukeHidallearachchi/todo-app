import { requireAuth } from "@/lib/auth";
import { NewTaskClient } from "./components/NewTaskClient";
import type { Metadata } from "next";

/**
 * Server Component: New Task Page
 * Ensures user is authenticated before rendering form
 * Uses NewTaskClient with Server Actions for form submission
 */

export const metadata: Metadata = {
  title: "New Task | TaskToDo",
  description: "Create a new task",
};

export default async function NewTaskPage() {
  // Server-side auth check
  await requireAuth();

  // Return client component for interactive form
  return <NewTaskClient />;
}
