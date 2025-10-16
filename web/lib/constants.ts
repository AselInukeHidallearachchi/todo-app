export const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Process",
  completed: "Completed",
} as const;

export type TaskStatus = keyof typeof STATUS_LABELS;
