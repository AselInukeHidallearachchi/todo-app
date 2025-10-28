"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { TaskHeader } from "./components/TaskHeader";
import { TaskControls } from "./components/TaskControls";
import { TaskCard } from "./components/TaskCard";
import { EmptyState } from "./components/EmptyState";
import type { Task } from "@/types/task";

export default function TaskListPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    try {
      const params = new URLSearchParams();
      if (filterBy !== "all") params.append("status", filterBy);
      if (sortBy === "priority") params.append("sort", "priority");
      if (sortBy === "due-date") params.append("sort", "due_date");

      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  }, [router, filterBy, sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const deleteTask = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <TaskHeader taskCount={tasks.length} />
      <TaskControls
        filterBy={filterBy}
        sortBy={sortBy}
        onFilterChange={setFilterBy}
        onSortChange={setSortBy}
      />
      {tasks.length === 0 ? (
        <EmptyState filter={filterBy} />
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={deleteTask} />
          ))}
        </div>
      )}
    </div>
  );
}
