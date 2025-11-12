"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUp,
  Eye,
  Trash2,
  Paperclip,
} from "lucide-react";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const router = useRouter();

  const getVariant = (type: "status" | "priority", value: string) => {
    if (type === "status") {
      switch (value) {
        case "completed":
          return "success";
        case "in_progress":
          return "info";
        default:
          return "default";
      }
    }
    if (type === "priority") {
      switch (value) {
        case "urgent":
          return "destructive";
        case "high":
          return "warning";
        case "low":
          return "success";
        default:
          return "default";
      }
    }
    return "default";
  };

  const getIcon = (type: "status" | "priority", value: string) => {
    if (type === "status")
      return value === "completed" ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : value === "in_progress" ? (
        <Clock className="h-4 w-4" />
      ) : null;
    if (type === "priority")
      return value === "urgent" ? (
        <AlertCircle className="h-4 w-4" />
      ) : value === "high" ? (
        <ArrowUp className="h-4 w-4" />
      ) : null;
  };

  return (
    <Card
      className="p-4 hover:shadow-soft-md transition-all duration-200 border-l-4 hover:border-l-primary cursor-pointer group animate-slide-in-up flex flex-col h-full"
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      <div className="flex flex-col gap-4 h-full">
        {/* Task Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge
              variant={getVariant("status", task.status)}
              className="gap-1"
            >
              {getIcon("status", task.status)}
              {task.status.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge
              variant={getVariant("priority", task.priority)}
              className="gap-1"
            >
              {getIcon("priority", task.priority)}
              {task.priority.toUpperCase()}
            </Badge>
            {task.due_date && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </Badge>
            )}
            {task.attachments && task.attachments.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <Paperclip className="h-3 w-3" />
                {task.attachments.length}{" "}
                {task.attachments.length === 1 ? "file" : "files"}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full">
          <Button
            size="sm"
            variant="outline"
            className="gap-2 flex-1"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tasks/${task.id}`);
            }}
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
