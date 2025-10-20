"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";

export default function NewTaskPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: STATUS_LABELS.TODO,
    priority: PRIORITY_LABELS.MEDIUM,
    due_date: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDateChange = (date: string) => {
    setForm((prev) => ({ ...prev, due_date: date }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const formData = {
        title: form.title.trim(),
        description: form.description.trim(),
        due_date: form.due_date || null,
        status: form.status || STATUS_LABELS.TODO,
        priority: form.priority || PRIORITY_LABELS.MEDIUM,
      };

      await api.post("/tasks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/tasks");
      }, 1500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Failed to create task. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center max-w-sm">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-success animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Task Created!</h2>
          <p className="text-muted-foreground mb-4">
            Your task has been created successfully.
          </p>
          <div className="text-sm text-muted-foreground">
            Redirecting to tasks...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create New Task
          </h1>
          <p className="text-muted-foreground mt-2">
            Add a new task to your list and stay organized
          </p>
        </div>

        <Card className="p-6 shadow-soft-lg">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 animate-slide-in-down">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Task Title *
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title"
                value={form.title}
                onChange={handleChange}
                className="h-10 text-base"
                disabled={loading}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                {form.title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add task details here..."
                value={form.description}
                onChange={handleChange}
                className="min-h-[120px] text-base resize-none"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                {form.description.length}/500 characters
              </p>
            </div>

            {/* Priority and Status */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold">
                  Priority
                </Label>
                <Select
                  value={form.priority}
                  onValueChange={(value) =>
                    handleSelectChange("priority", value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PRIORITY_LABELS.LOW}>
                      <Badge variant="success" className="gap-2">
                        Low Priority
                      </Badge>
                    </SelectItem>
                    <SelectItem value={PRIORITY_LABELS.MEDIUM}>
                      <Badge variant="secondary" className="gap-2">
                        Medium Priority
                      </Badge>
                    </SelectItem>
                    <SelectItem value={PRIORITY_LABELS.HIGH}>
                      <Badge variant="warning" className="gap-2">
                        High Priority
                      </Badge>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <Badge variant="destructive" className="gap-2">
                        Urgent
                      </Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  disabled={loading}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={STATUS_LABELS.TODO}>To Do</SelectItem>
                    <SelectItem value={STATUS_LABELS["IN PROGRESS"]}>
                      In Progress
                    </SelectItem>
                    <SelectItem value={STATUS_LABELS.COMPLETED}>
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-sm font-semibold">
                Due Date
              </Label>
              <DatePicker
                value={form.due_date}
                onChange={handleDateChange}
                placeholder="Select a due date"
                minDate={new Date().toISOString().split("T")[0]}
              />
              <p className="text-xs text-muted-foreground">
                {form.due_date
                  ? `Due on ${new Date(form.due_date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}`
                  : "Optional"}
              </p>
            </div>

            {/* Preview */}
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-3">
                PREVIEW
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  {form.title || "Untitled Task"}
                </h3>
                {form.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {form.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary">
                    {form.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">
                    {form.priority.toUpperCase()}
                  </Badge>
                  {form.due_date && (
                    <Badge variant="outline">
                      {new Date(form.due_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !form.title.trim()}
                className="flex-1 shadow-soft-md hover:shadow-soft-lg transition-shadow"
              >
                {loading ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
