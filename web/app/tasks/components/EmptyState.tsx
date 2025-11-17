"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmptyState({ filter }: { filter: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 p-3 bg-muted rounded-full">
        <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {filter === "all" ? "No tasks yet" : "No tasks in this category"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        {filter === "all"
          ? "Create your first task to get started"
          : "Try adjusting your filters"}
      </p>
      <Button onClick={() => router.push("/tasks/new")} variant="outline">
        Create Task
      </Button>
    </div>
  );
}
