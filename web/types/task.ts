export interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export type SortOption = "recent" | "priority" | "status" | "due-date";
export type FilterOption = "all" | "todo" | "in_progress" | "completed";
