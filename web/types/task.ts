export interface Attachment {
  id: number;
  task_id: number;
  uploaded_by: number;
  original_name: string;
  path: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  updated_at: string;
}

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
  attachments?: Attachment[];
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export type SortOption = "recent" | "priority" | "status" | "due-date";
export type FilterOption = "all" | "todo" | "in_progress" | "completed";
