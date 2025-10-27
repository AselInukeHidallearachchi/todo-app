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
      const res = await api.get("/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  }, [router]);

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

  const filtered = tasks.filter(
    (t) => filterBy === "all" || t.status === filterBy
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <TaskHeader taskCount={filtered.length} />
      <TaskControls
        filterBy={filterBy}
        sortBy={sortBy}
        onFilterChange={setFilterBy}
        onSortChange={setSortBy}
      />
      {filtered.length === 0 ? (
        <EmptyState filter={filterBy} />
      ) : (
        <div className="grid gap-3">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={deleteTask} />
          ))}
        </div>
      )}
    </div>
  );
}
