"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export function FileUpload({
  onUpload,
  isUploading,
  accept = {
    "image/*": [],
    "application/pdf": [],
    "application/msword": [],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      [],
    "application/vnd.ms-excel": [],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    "text/plain": [],
  },
  maxSize = 10 * 1024 * 1024,
}: FileUploadProps) {
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError("");

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(
            `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`
          );
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Invalid file type");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > maxSize) {
          setError(
            `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`
          );
          return;
        }
        await onUpload(file);
      }
    },
    [onUpload, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: isUploading,
    accept,
    maxSize,
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-secondary/50"
            : "border-border hover:border-primary",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <p>
                {isDragActive
                  ? "Drop the file here"
                  : "Drag and drop a file here, or click to select"}
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: {maxSize / 1024 / 1024}MB
              </p>
            </>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface FileListProps {
  files: Array<{
    id: number;
    original_name: string;
    mime_type: string;
    size_bytes: number;
  }>;
  onDelete?: (id: number) => Promise<void>;
}

export function FileList({ files, onDelete }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-2 rounded-md bg-secondary"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{file.original_name}</span>
            <span className="text-xs text-muted-foreground">
              ({(file.size_bytes / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(file.id)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
