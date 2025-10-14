"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter, useParams } from "next/navigation";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({ title: "", description: "", status: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get(`/tasks/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setForm(res.data))
      .catch(() => router.push("/login"));
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    await api.put(`/tasks/${params.id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/tasks");
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    await api.delete(`/tasks/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/tasks");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-3">Edit Task</h1>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-2"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-2"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <div className="flex justify-between">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
