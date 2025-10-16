"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    due_date: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .get(`/tasks/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Format the date to ISO string and slice to remove seconds/timezone
        const formattedData = {
          ...res.data,
          due_date: res.data.due_date
            ? new Date(res.data.due_date).toISOString().slice(0, 16)
            : "",
        };
        setForm(formattedData);
      })
      .catch(() => router.push("/login"));
  }, [params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({});
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const formData = {
        ...form,
        due_date: form.due_date || null,
      };

      console.log("Sending dat to the backend:", {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date,
      });

      const res = await api.put(`/tasks/${params.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Updated:", res.data);
      router.push("/tasks");
    } catch (err: any) {
      if (err.response?.status === 422) {
        console.log("API validation error:", err.response.data);
        setErrors(err.response.data.errors || {});
      } else {
        console.error("Update failed:", err);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    await api.delete(`/tasks/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/tasks");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6  border border-white shadow rounded">
      <h1 className="text-xl font-bold mb-3">Edit Task</h1>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-2"
      />
      {errors.title && (
        <p className="text-red-500 text-sm mb-2">{errors.title[0]}</p>
      )}
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-2"
      />
      {errors.description && (
        <p className="text-red-500 text-sm mb-2">{errors.description[0]}</p>
      )}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={label}>
            {value}
          </option>
        ))}
      </select>
      {errors.status && (
        <p className="text-red-500 text-sm mb-2">{errors.status[0]}</p>
      )}
      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
      >
        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
          <option key={value} value={label}>
            {value}
          </option>
        ))}
      </select>
      {errors.priority && (
        <p className="text-red-500 text-sm mb-2">{errors.priority[0]}</p>
      )}
      {/* Add Due Date Input */}
      <input
        type="datetime-local"
        name="due_date"
        value={form.due_date || ""}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3"
      />
      {errors.due_date && (
        <p className="text-red-500 text-sm mb-2">{errors.due_date[0]}</p>
      )}

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
