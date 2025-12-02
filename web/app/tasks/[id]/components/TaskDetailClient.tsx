"use client";

import { useState } from "react";
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
import { ArrowLeft, Save, Trash2, Edit } from "lucide-react";
import { UnifiedAlert } from "@/components/UnifiedAlert";
import { TaskAttachments } from "@/app/components/task/task-attachments";
import {
  updateTaskAction,
  deleteTaskAction,
  deleteTaskAttachmentAction,
} from "@/app/actions/tasks";
import type { Task, Attachment } from "@/types/task";
import { useToast } from "@/context/ToastContext";

/**
 * Client Component: Task Detail Interactive Wrapper
 * Handles edit mode, form state, task updates, and deletion
 * Uses Server Actions for updates and deletes (updateTaskAction, deleteTaskAction)
 * Manages attachment state during edit sessions
 */

interface TaskDetailClientProps {
  initialTask: Task;
  taskId: string;
}

export function TaskDetailClient({
  initialTask,
  taskId,
}: TaskDetailClientProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  // Task state
  const [task, setTask] = useState<Task>(initialTask);
  const [form, setForm] = useState<Task>(initialTask);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Attachment tracking during edit
  const [attachmentsAddedDuringEdit, setAttachmentsAddedDuringEdit] = useState<
    Attachment[]
  >([]);
  const [attachmentsDeletedDuringEdit, setAttachmentsDeletedDuringEdit] =
    useState<number[]>([]);
  const [originalAttachments, setOriginalAttachments] = useState<
    Task["attachments"]
  >([]);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: string) => {
    setForm({ ...form, due_date: date });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  // Save task with Server Action - original behavior
  const handleSave = async () => {
    console.log("[TaskDetailClient] handleSave called");
    setSaving(true);

    try {
      // Delete attachments marked for deletion during edit
      if (attachmentsDeletedDuringEdit.length > 0) {
        for (const attachmentId of attachmentsDeletedDuringEdit) {
          try {
            const result = await deleteTaskAttachmentAction(
              task.id,
              attachmentId
            );
            if (!result.success) {
              console.warn(
                `Delete attachment ${attachmentId} returned error: ${result.message}. This might be okay if it was already deleted.`
              );
            }
          } catch (err) {
            console.warn(
              `Exception deleting attachment ${attachmentId}:`,
              err,
              ". Continuing with save."
            );
          }
        }
      }

      // Update task using Server Action
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("status", form.status);
      formData.append("priority", form.priority);
      if (form.due_date) {
        formData.append("due_date", form.due_date);
      }

      const result = await updateTaskAction(parseInt(taskId), formData);

      if (result.success) {
        // Update local task state with newly added attachments (old ones removed)
        const updatedTask = {
          ...form,
          attachments: [
            ...(form.attachments?.filter(
              (a) => !attachmentsDeletedDuringEdit.includes(a.id)
            ) || []),
            ...attachmentsAddedDuringEdit,
          ],
        };
        setTask(updatedTask);
        setIsEditing(false);
        showSuccess("Task Updated", "Task updated successfully!");
        setAttachmentsAddedDuringEdit([]);
        setAttachmentsDeletedDuringEdit([]);
        router.refresh();
      } else {
        showError("Save Failed", result.message || "Failed to save task");
      }
    } catch (err) {
      console.error("Error saving task:", err);
      showError("Error", "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  // Delete task with Server Action
  const handleDelete = async () => {
    setDeleting(true);
    setDeleteOpen(false);

    try {
      const result = await deleteTaskAction(parseInt(taskId));

      if (result.success) {
        showSuccess("Task Deleted", "Task deleted successfully");
        router.push("/tasks");
      } else {
        showError("Delete Failed", result.message || "Failed to delete task");
        setDeleting(false);
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      showError("Error", "Failed to delete task");
      setDeleting(false);
    }
  };

  // Cancel edit and restore original state
  const handleCancel = async () => {
    // Delete any attachments added during this edit session since we're canceling
    if (attachmentsAddedDuringEdit.length > 0) {
      for (const attachment of attachmentsAddedDuringEdit) {
        try {
          const result = await deleteTaskAttachmentAction(
            task.id,
            attachment.id
          );
          if (!result.success) {
            console.error(
              `Failed to delete attachment ${attachment.id}:`,
              result.message
            );
          }
        } catch (err) {
          console.error(`Failed to delete attachment ${attachment.id}:`, err);
        }
      }
    }

    // Restore original state - including original attachments
    const restoredTask = {
      ...task,
      attachments: originalAttachments,
    };
    setForm(restoredTask);
    setTask(restoredTask);
    setIsEditing(false);
    setAttachmentsAddedDuringEdit([]);
    setAttachmentsDeletedDuringEdit([]);
  };

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
            {!isEditing ? (
              <Button
                onClick={() => setDeleteOpen(true)}
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                variant="outline"
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="gap-2"
                variant="default"
                disabled={saving}
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        </div>

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
                      <SelectItem value={PRIORITY_LABELS.LOW}>
                        <Badge variant="success" className="gap-2">
                          Low Priority
                        </Badge>
                      </SelectItem>
                      <SelectItem value={PRIORITY_LABELS.MEDIUM}>
                        <Badge variant="outline" className="gap-2">
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
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                    disabled={saving}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={STATUS_LABELS.TODO}>
                        <Badge variant="outline" className="gap-2">
                          To Do
                        </Badge>
                      </SelectItem>
                      <SelectItem value={STATUS_LABELS["IN PROGRESS"]}>
                        <Badge variant="info" className="gap-2">
                          In Progress
                        </Badge>
                      </SelectItem>
                      <SelectItem value={STATUS_LABELS.COMPLETED}>
                        <Badge variant="success" className="gap-2">
                          Completed
                        </Badge>
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
                  task={{
                    ...task,
                    attachments: [
                      ...(task.attachments?.filter(
                        (a) => !attachmentsDeletedDuringEdit.includes(a.id)
                      ) || []),
                      ...attachmentsAddedDuringEdit,
                    ],
                  }}
                  onUpdate={(updatedTask) => {
                    console.log(
                      "[TaskDetailClient] TaskAttachments onUpdate called with task:",
                      updatedTask.id
                    );
                    setTask(updatedTask);
                    setForm(updatedTask);
                  }}
                  isEditMode={true}
                  deferDeletions={true}
                  onAttachmentAdded={(attachment) => {
                    setAttachmentsAddedDuringEdit([
                      ...attachmentsAddedDuringEdit,
                      attachment,
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
                    <Badge
                      variant={
                        task.status === "completed"
                          ? "success"
                          : task.status === "in_progress"
                          ? "info"
                          : task.status === "todo"
                          ? "outline"
                          : "outline"
                      }
                    >
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
                          : "outline"
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

        <UnifiedAlert
          type="confirm"
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
          isLoading={deleting}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
}
