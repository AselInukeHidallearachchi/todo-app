"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  user_id: number;
}

export default function TaskListPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    api
      .get("/tasks", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTasks(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button
          onClick={() => router.push("/tasks/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Task
        </Button>
      </div>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="p-3 shadow rounded flex justify-between border border-white"
            >
              <div>
                <h2 className="font-semibold">{t.title}</h2>
                <p className="text-sm text-gray-600">{t.description}</p>
                <p className="text-xs text-gray-500">
                  Status:{" "}
                  {STATUS_LABELS[t.status as keyof typeof STATUS_LABELS] ??
                    t.status}
                </p>{" "}
                <p className="text-xs text-gray-500">
                  Priority:{" "}
                  {PRIORITY_LABELS[
                    t.priority as keyof typeof PRIORITY_LABELS
                  ] ?? t.priority}
                </p>{" "}
              </div>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => router.push(`/tasks/${t.id}`)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
