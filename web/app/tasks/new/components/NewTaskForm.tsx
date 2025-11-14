"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createTaskAction } from "@/app/actions/tasks";
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
import { ArrowLeft, AlertCircle, CheckCircle2, Loader } from "lucide-react";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";

function SubmitButton({ isValid }: { isValid: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || !isValid}
      className="flex-1 shadow-soft-md hover:shadow-soft-lg transition-shadow"
    >
      {pending ? (
        <>
          <Loader className="h-4 w-4 animate-spin mr-2" />
          Creating...
        </>
      ) : (
        "Create Task"
      )}
    </Button>
  );
}

export function NewTaskForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(createTaskAction, null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: STATUS_LABELS.TODO,
    priority: PRIORITY_LABELS.MEDIUM,
    due_date: "",
  });

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => router.push("/tasks"), 1500);
    }
  }, [state, router]);

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
          <div className="text-sm text-muted-foreground">Redirecting...</div>
        </Card>
      </div>
    );
  }

  const isValid = form.title.trim().length > 0;

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
          {state?.errors && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {Object.values(state.errors).flat().join(", ")}
              </AlertDescription>
            </Alert>
          )}

          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Task Title *
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-10 text-base"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add task details..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="min-h-[120px] text-base resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold">
                  Priority
                </Label>
                <Select
                  name="priority"
                  value={form.priority}
                  onValueChange={(value) =>
                    setForm({ ...form, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PRIORITY_LABELS.LOW}>
                      Low Priority
                    </SelectItem>
                    <SelectItem value={PRIORITY_LABELS.MEDIUM}>
                      Medium Priority
                    </SelectItem>
                    <SelectItem value={PRIORITY_LABELS.HIGH}>
                      High Priority
                    </SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status
                </Label>
                <Select
                  name="status"
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
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

            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-sm font-semibold">
                Due Date
              </Label>
              <DatePicker
                value={form.due_date}
                onChange={(date) => setForm({ ...form, due_date: date })}
                placeholder="Select a due date"
                minDate={new Date().toISOString().split("T")[0]}
              />
              <input type="hidden" name="due_date" value={form.due_date} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <SubmitButton isValid={isValid} />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
