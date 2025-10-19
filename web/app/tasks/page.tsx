"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  ArrowUp,
  Trash2,
  Eye,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  user_id: number;
  created_at?: string;
}

type SortOption = "recent" | "priority" | "status" | "due-date";
type FilterOption = "all" | "todo" | "in_progress" | "completed";

export default function TaskListPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const deleteTask = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch {
      // Error handled
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent") return <AlertCircle className="h-4 w-4" />;
    if (priority === "high") return <ArrowUp className="h-4 w-4" />;
    return null;
  };

  const getPriorityVariant = (
    priority: string
  ):
    | "default"
    | "destructive"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "info" => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "warning";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="h-4 w-4" />;
    if (status === "in_progress") return <Clock className="h-4 w-4" />;
    return null;
  };

  const getStatusVariant = (
    status: string
  ):
    | "default"
    | "destructive"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "info" => {
    switch (status) {
      case "completed":
        return "success"; // Green
      case "in_progress":
        return "info";
      default:
        return "secondary";
    }
  };

  const filtered = tasks.filter(
    (t) => filterBy === "all" || t.status === filterBy
  );

  filtered.sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = {
        urgent: 0,
        high: 1,
        medium: 2,
        low: 3,
      };
      return (
        (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 99) -
        (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 99)
      );
    }
    if (sortBy === "status") {
      const statusOrder = { todo: 0, in_progress: 1, completed: 2 };
      return (
        (statusOrder[a.status as keyof typeof statusOrder] ?? 99) -
        (statusOrder[b.status as keyof typeof statusOrder] ?? 99)
      );
    }
    if (sortBy === "due-date") {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative h-10 w-10 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filtered.length} task{filtered.length !== 1 ? "s" : ""} total
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

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-card border border-border rounded-lg shadow-soft">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
          <Select
            value={filterBy}
            onValueChange={(v) => setFilterBy(v as FilterOption)}
          >
            <SelectTrigger className="w-[150px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort:</span>
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortOption)}
          >
            <SelectTrigger className="w-[150px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="priority">By Priority</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
              <SelectItem value="due-date">By Due Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="mb-4 p-3 bg-muted rounded-full">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {filterBy === "all" ? "No tasks yet" : "No tasks in this category"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            {filterBy === "all"
              ? "Create your first task to get started"
              : "Try adjusting your filters"}
          </p>
          <Button onClick={() => router.push("/tasks/new")} variant="outline">
            Create Task
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((task) => (
            <Card
              key={task.id}
              className="p-4 hover:shadow-soft-md transition-all duration-200 border-l-4 hover:border-l-primary cursor-pointer group animate-slide-in-up"
              onClick={() => router.push(`/tasks/${task.id}`)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
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
                          variant={getStatusVariant(task.status)}
                          className="gap-1"
                        >
                          {getStatusIcon(task.status)}
                          {task.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge
                          variant={getPriorityVariant(task.priority)}
                          className="gap-1"
                        >
                          {getPriorityIcon(task.priority)}
                          {task.priority.toUpperCase()}
                        </Badge>
                        {task.due_date && (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tasks/${task.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
