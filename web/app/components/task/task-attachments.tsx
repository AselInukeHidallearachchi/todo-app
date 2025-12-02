"use client";

import { useState } from "react";
import { Paperclip, X, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  uploadTaskAttachmentAction,
  deleteTaskAttachmentAction,
} from "@/app/actions/tasks";
import type { Task, Attachment } from "@/types/task";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/context/ToastContext";

interface TaskAttachmentsProps {
  task: Task;
  onUpdate: (task: Task) => void;
  isEditMode?: boolean;
  onAttachmentAdded?: (attachment: Attachment) => void;
  onAttachmentDeleted?: (attachmentId: number) => void;
  deferDeletions?: boolean; // If true, don't delete immediately, just notify parent
}

export function TaskAttachments({
  task,
  onUpdate,
  isEditMode = false,
  onAttachmentAdded,
  onAttachmentDeleted,
  deferDeletions = false,
}: TaskAttachmentsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false); // UI state for drag feedback
  const { showSuccess, showError } = useToast();

  // Single helper used by BOTH input change and drop
  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);

      // Create FormData for the server action
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadTaskAttachmentAction(task.id, formData);

      if (result.success && result.data) {
        // Notify parent component with the full attachment object for tracking
        if (onAttachmentAdded && result.data) {
          onAttachmentAdded(result.data as Attachment);
        }

        // The task will be updated when user clicks Save
        if (!isEditMode) {
          // Only update task if NOT in edit mode (view mode)
          onUpdate({
            ...task,
            attachments: [...(task.attachments || []), result.data as never],
          });
        }

        showSuccess("Upload Successful", `${file.name} uploaded successfully`);
      } else {
        showError(
          "Upload Failed",
          result.message || "Failed to upload file. Please try again."
        );
      }
    } catch (error: unknown) {
      showError("Upload Failed", "Failed to upload file. Please try again.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  //  Click-to-upload path
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    await uploadFile(e.target.files[0]);
    // clear the input so selecting the same file twice still fires onChange
    e.target.value = "";
  };

  // Native drag & drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragActive(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    await uploadFile(file);
  };

  const handleFileDelete = async (
    e: React.MouseEvent,
    attachmentId: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!deferDeletions) {
        // Delete immediately if not deferring
        const result = await deleteTaskAttachmentAction(task.id, attachmentId);
        if (!result.success) {
          showError("Delete Failed", result.message || "Failed to delete file");
          return;
        }
      }

      // Notify parent component of the deleted attachment for tracking
      if (onAttachmentDeleted) {
        onAttachmentDeleted(attachmentId);
      }

      // In edit mode, only notify parent about deletion, don't update the full task
      // The task will be updated when user clicks Save
      if (!isEditMode) {
        // Only update task if NOT in edit mode (view mode)
        onUpdate({
          ...task,
          attachments:
            task.attachments?.filter((a) => a.id !== attachmentId) || [],
        });
      }

      showSuccess("File Deleted", "File deleted successfully");
    } catch (error) {
      showError("Delete Failed", "Failed to delete file");
      console.error(error);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base font-medium">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span>Attachments</span>
          </div>
          {task.attachments && task.attachments.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {task.attachments.length} file
              {task.attachments.length !== 1 && "s"}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditMode && (
          <div className="flex justify-center">
            <label
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-32",
                "border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
                isUploading && "pointer-events-none opacity-50",
                isDragActive
                  ? "border-primary bg-primary/10 scale-[1.01] shadow-sm"
                  : "border-muted-foreground/30 hover:bg-muted/50"
              )}
            >
              {/* overlay glow when dragging */}
              {isDragActive && (
                <div className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-primary/40 animate-in fade-in" />
              )}

              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <Upload
                  className={cn(
                    "h-8 w-8 mb-2 transition-colors",
                    isDragActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {isDragActive ? (
                  <p className="text-sm font-medium text-primary">
                    Drop your file here…
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground/75 mt-1">
                      PDF, Word, Excel (up to 10MB)
                    </p>
                  </>
                )}
              </div>

              {/* hidden input still handles click-to-upload */}
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </label>
          </div>
        )}

        {task.attachments && task.attachments.length > 0 ? (
          <div className="space-y-2">
            {task.attachments.map((file) => (
              <div
                key={file.id}
                className="group relative rounded-md border bg-card"
              >
                <a
                  href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${file.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Badge
                      variant="outline"
                      className="h-auto py-1 px-2 font-normal"
                    >
                      {file.original_name}
                    </Badge>
                  </div>
                  {isEditMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleFileDelete(e, file.id)}
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete attachment</span>
                    </Button>
                  )}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No attachments yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
