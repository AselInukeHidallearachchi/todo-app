"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Save,
  Trash2,
  Edit,
} from "lucide-react";
import { TaskAttachments } from "@/app/components/task/task-attachments";
import { deleteTaskAttachment } from "@/lib/api";

import type { Task as TaskType } from "@/types/task";
type Task = TaskType;

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [form, setForm] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [attachmentsAddedDuringEdit, setAttachmentsAddedDuringEdit] = useState<
    number[]
  >([]);
  const [attachmentsDeletedDuringEdit, setAttachmentsDeletedDuringEdit] =
    useState<number[]>([]);
  const [originalAttachments, setOriginalAttachments] = useState<
    Task["attachments"]
  >([]);

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await api.get(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data as Task;
      setTask(data);
      setForm(data);
    } catch {
      setError("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (form) {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleDateChange = (date: string) => {
    if (form) {
      setForm({ ...form, due_date: date });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (form) {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!form || !task) return;

    setSaving(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      // Delete attachments that were marked for deletion during edit
      if (attachmentsDeletedDuringEdit.length > 0) {
        for (const attachmentId of attachmentsDeletedDuringEdit) {
          try {
            await deleteTaskAttachment(task.id, attachmentId);
          } catch (err) {
            console.error(`Failed to delete attachment ${attachmentId}:`, err);
          }
        }
      }

      const formData = {
        title: form.title.trim(),
        description: form.description.trim(),
        due_date: form.due_date || null,
        status: form.status,
        priority: form.priority,
      };

      await api.put(`/tasks/${taskId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setTask(form);
      setIsEditing(false);
      setSuccess("Task updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      // Clear tracking arrays
      setAttachmentsAddedDuringEdit([]);
      setAttachmentsDeletedDuringEdit([]);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/tasks");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to delete task");
    }
  };

  const handleCancel = async () => {
    if (!task) return;

    // Delete any attachments that were added during this edit session
    if (attachmentsAddedDuringEdit.length > 0) {
      const token = localStorage.getItem("token");
      if (token) {
        for (const attachmentId of attachmentsAddedDuringEdit) {
          try {
            await deleteTaskAttachment(task.id, attachmentId);
          } catch (err) {
            console.error(`Failed to delete attachment ${attachmentId}:`, err);
          }
        }
      }
    }

    // Restore the task to its original state (before edit)
    const restoredTask = {
      ...task,
      attachments: originalAttachments,
    };
    setTask(restoredTask);
    setForm(restoredTask);

    setIsEditing(false);
    setError("");
    setAttachmentsAddedDuringEdit([]);
    setAttachmentsDeletedDuringEdit([]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative h-10 w-10 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm text-muted-foreground">Loading task...</p>
      </div>
    );
  }

  if (!task || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Task Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The task you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/tasks")}>Back to Tasks</Button>
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {isEditing ? "Edit Task" : "Task Details"}
            </h1>
            {task.created_at && (
              <p className="text-muted-foreground text-sm mt-2">
                Created on{" "}
                {new Date(task.created_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <Button
                onClick={() => {
                  setOriginalAttachments(task.attachments || []);
                  setAttachmentsAddedDuringEdit([]);
                  setAttachmentsDeletedDuringEdit([]);
                  setIsEditing(true);
                }}
                className="gap-2"
                variant="outline"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
            {isEditing && (
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={saving}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={isEditing ? handleSave : () => handleDelete()}
              className={
                isEditing
                  ? "gap-2"
                  : "gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              }
              variant={isEditing ? "default" : "outline"}
              disabled={saving}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card className="p-6 shadow-soft-lg">
          {isEditing ? (
            // Edit Form
            <form className="space-y-6">
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
                  disabled={saving}
                  autoFocus
                />
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
                  disabled={saving}
                />
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
                    disabled={saving}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PRIORITY_LABELS.LOW}>Low</SelectItem>
                      <SelectItem value={PRIORITY_LABELS.MEDIUM}>
                        Medium
                      </SelectItem>
                      <SelectItem value={PRIORITY_LABELS.HIGH}>High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold">
                    Status
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                    disabled={saving}
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
                  value={form.due_date || ""}
                  onChange={handleDateChange}
                  placeholder="Select a due date"
                  minDate={new Date().toISOString().split("T")[0]}
                  className="w-full"
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

              {/* Attachments Section */}
              {!saving && (
                <TaskAttachments
                  task={task}
                  onUpdate={(updatedTask) => {
                    setTask(updatedTask);
                    setForm(updatedTask);
                  }}
                  isEditMode={true}
                  deferDeletions={true}
                  onAttachmentAdded={(attachmentId) => {
                    setAttachmentsAddedDuringEdit([
                      ...attachmentsAddedDuringEdit,
                      attachmentId,
                    ]);
                  }}
                  onAttachmentDeleted={(attachmentId) => {
                    setAttachmentsDeletedDuringEdit([
                      ...attachmentsDeletedDuringEdit,
                      attachmentId,
                    ]);
                  }}
                />
              )}
            </form>
          ) : (
            // View Mode
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      STATUS
                    </p>
                    <Badge variant="secondary">
                      {task.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      PRIORITY
                    </p>
                    <Badge
                      variant={
                        task.priority === "urgent"
                          ? "destructive"
                          : task.priority === "high"
                          ? "warning"
                          : task.priority === "low"
                          ? "success"
                          : "secondary"
                      }
                    >
                      {task.priority.toUpperCase()}
                    </Badge>
                  </div>

                  {task.due_date && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        DUE DATE
                      </p>
                      <Badge variant="outline">
                        {new Date(task.due_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Badge>
                    </div>
                  )}

                  {task.updated_at && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        LAST UPDATED
                      </p>
                      <p className="text-sm">
                        {new Date(task.updated_at).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Attachments Section in View Mode */}
              <div className="pt-6 border-t border-border">
                <TaskAttachments
                  task={task}
                  onUpdate={(updatedTask) => {
                    setTask(updatedTask);
                    setForm(updatedTask);
                  }}
                  isEditMode={false}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
