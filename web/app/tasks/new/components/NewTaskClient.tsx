"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";
import { createTaskWithAttachments } from "@/lib/api";
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
import { ArrowLeft, Paperclip, X, Upload } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import Loading from "@/app/loading";
import type { Task } from "@/types/task";

/**
 * Single-Phase Task Creation with Attachments
 * Task and files are created in a single API call
 */
export function NewTaskClient() {
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: STATUS_LABELS.TODO,
    priority: PRIORITY_LABELS.MEDIUM,
    due_date: "",
  });

  // Attachment state
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: string) => {
    setForm((prev) => ({ ...prev, due_date: date }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  // File validation
  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];

    if (file.size > maxSize) {
      showError("File Too Large", `${file.name} exceeds 10MB limit`);
      return false;
    }

    if (!allowedMimes.includes(file.type)) {
      showError(
        "Invalid File Type",
        `${file.name} file type not supported. Use PDF, Word, Excel, Text, or Images.`
      );
      return false;
    }

    return true;
  };

  // File handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (isLoading) return;
    const files = Array.from(e.dataTransfer.files);
    addAttachments(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addAttachments(files);
    e.target.value = "";
  };

  const addAttachments = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => validateFile(file));
    if (validFiles.length > 0) {
      setAttachments((prev) => [...prev, ...validFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit handler - create task with attachments in one request
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!form.title.trim()) {
      showWarning("Title Required", "Please enter a task title");
      return;
    }

    if (!form.due_date) {
      showWarning("Due Date Required", "Please select a due date");
      return;
    }

    setIsLoading(true);

    try {
      // Create task with attachments in single request
      await createTaskWithAttachments(
        {
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status,
          priority: form.priority,
          due_date: form.due_date,
        },
        attachments
      );

      showSuccess(
        "Task Created!",
        `Task created successfully${
          attachments.length > 0 ? ` with ${attachments.length} file(s)` : ""
        }`
      );

      setIsRedirecting(true);
      router.push(`/tasks`);
    } catch (error) {
      console.error("Create task error:", error);
      showError(
        "Creation Failed",
        error instanceof Error
          ? error.message
          : "Failed to create task. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      {(isLoading || isRedirecting) && <Loading />}
      <div className="animate-fade-in">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          disabled={isLoading || isRedirecting}
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
              Add a new task with optional file attachments
            </p>
          </div>

          <Card className="p-6 shadow-soft-lg">
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
                  autoFocus
                  required
                  disabled={isLoading}
                  maxLength={100}
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
                  disabled={isLoading}
                  maxLength={500}
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
                    disabled={isLoading}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PRIORITY_LABELS.LOW}>
                        <Badge variant="success">Low Priority</Badge>
                      </SelectItem>
                      <SelectItem value={PRIORITY_LABELS.MEDIUM}>
                        <Badge variant="outline">Medium Priority</Badge>
                      </SelectItem>
                      <SelectItem value={PRIORITY_LABELS.HIGH}>
                        <Badge variant="warning">High Priority</Badge>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <Badge variant="destructive">Urgent</Badge>
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
                    disabled={isLoading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={STATUS_LABELS.TODO}>
                        <Badge variant="outline">To Do</Badge>
                      </SelectItem>
                      <SelectItem value={STATUS_LABELS["IN PROGRESS"]}>
                        <Badge variant="info">In Progress</Badge>
                      </SelectItem>
                      <SelectItem value={STATUS_LABELS.COMPLETED}>
                        <Badge variant="success">Completed</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="due_date" className="text-sm font-semibold">
                  Due Date *
                </Label>
                <DatePicker
                  value={form.due_date}
                  onChange={handleDateChange}
                  placeholder="Select a due date"
                  minDate={new Date().toISOString().split("T")[0]}
                  disabled={isLoading}
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
                    : "Required field"}
                </p>
              </div>

              {/* Attachments Section */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Attachments </Label>

                {/* Upload Zone */}
                <div className="flex justify-center">
                  <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "relative flex flex-col items-center justify-center w-full h-32",
                      "border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
                      isLoading && "pointer-events-none opacity-50",
                      isDragActive
                        ? "border-primary bg-primary/10 scale-[1.01] shadow-sm ring-2 ring-primary/40"
                        : "border-muted-foreground/30 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                      <Upload
                        className={cn(
                          "h-8 w-8 mb-2 transition-colors",
                          isDragActive
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                      {isDragActive ? (
                        <p className="text-sm font-medium text-primary">
                          Drop your files here…
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground/75 mt-1">
                            PDF, Word, Excel, Text, Images (up to 10MB each)
                          </p>
                        </>
                      )}
                    </div>

                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileInputChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                      disabled={isLoading}
                      multiple
                    />
                  </label>
                </div>

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {attachments.length} file
                      {attachments.length !== 1 ? "s" : ""} selected
                    </p>
                    <div className="space-y-1">
                      {attachments.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between p-2 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate text-foreground font-medium">
                              {file.name}
                            </span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              ({(file.size / 1024 / 1024).toFixed(2)}MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAttachment(index)}
                            className="h-6 w-6 ml-2"
                            disabled={isLoading}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                    <Badge variant="outline">
                      {form.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {form.priority.toUpperCase()}
                    </Badge>
                    {form.due_date && (
                      <Badge variant="outline">
                        {new Date(form.due_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Badge>
                    )}
                    {attachments.length > 0 && (
                      <Badge variant="secondary">
                        <Paperclip className="h-3 w-3 mr-1" />
                        {attachments.length} file
                        {attachments.length !== 1 ? "s" : ""}
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
                  className="flex-1"
                  disabled={isLoading || isRedirecting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isRedirecting || !form.title.trim()}
                  className="flex-1 shadow-soft-md hover:shadow-soft-lg transition-shadow"
                >
                  {isLoading || isRedirecting ? (
                    <>
                      <Loading />
                      {isRedirecting ? "Redirecting..." : "Creating..."}
                    </>
                  ) : (
                    `Create Task`
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
