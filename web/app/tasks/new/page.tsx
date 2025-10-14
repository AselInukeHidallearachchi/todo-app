"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewtaskPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await api.post("/tasks", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/tasks");
    } catch (err: any) {
      setError(err.response?.data?.message || "failed to create task");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6  shadow rounded">
      <h1 className="text-xl font-bold mb-3">New Task</h1>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
