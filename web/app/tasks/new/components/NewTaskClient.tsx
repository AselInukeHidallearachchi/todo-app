"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createTaskAction } from "@/app/actions/tasks";
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
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Client Component: New Task Form
 * Uses Next.js Server Actions for form submission (progressive enhancement)
 * Manages client-side form state and displays server response
 * Redirects to /tasks on successful creation
 */

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="flex-1 shadow-soft-md hover:shadow-soft-lg transition-shadow"
    >
      {pending ? "Creating..." : "Create Task"}
    </Button>
  );
}

export function NewTaskClient() {
  const router = useRouter();

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: STATUS_LABELS.TODO,
    priority: PRIORITY_LABELS.MEDIUM,
    due_date: "",
  });

  // Server Action state
  const [state, formAction] = useActionState(createTaskAction, null);

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push("/tasks");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

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

  // Show success screen
  if (state?.success) {
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
          {state?.success === false && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <form action={formAction} className="space-y-6">
            {/* Hidden inputs for form state */}
            <input type="hidden" name="status" value={form.status} />
            <input type="hidden" name="priority" value={form.priority} />
            <input type="hidden" name="due_date" value={form.due_date} />

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
                      {new Date(form.due_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
              >
                Cancel
              </Button>
              <SubmitButton disabled={!form.title.trim()} />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
