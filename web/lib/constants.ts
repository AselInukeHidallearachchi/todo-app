export const STATUS_LABELS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type TaskStatus = keyof typeof STATUS_LABELS;

export const PRIORITY_LABELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type TaskPriority = keyof typeof PRIORITY_LABELS;
