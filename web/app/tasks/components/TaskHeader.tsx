"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaskHeaderProps {
  taskCount: number;
}
export function TaskHeader({ taskCount }: TaskHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          My Tasks
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {taskCount} task{taskCount !== 1 ? "s" : ""} total
        </p>
      </div>

      <Button
        onClick={() => router.push("/tasks/new")}
        className="gap-2 shadow-soft-md hover:shadow-soft-lg transition-shadow"
      >
        <Plus className="h-4 w-4" />
        Add Task
      </Button>
    </div>
  );
}
