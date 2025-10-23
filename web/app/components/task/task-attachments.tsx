import { FileUpload, FileList } from "@/components/ui/file-upload";
import { uploadTaskAttachment, deleteTaskAttachment } from "@/lib/api";
import { Attachment, Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Paperclip, PaperclipIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskAttachmentsProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

export function TaskAttachments({ task, onUpdate }: TaskAttachmentsProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const attachment = (await uploadTaskAttachment(
        task.id,
        file
      )) as Attachment;
      onUpdate({
        ...task,
        attachments: [...(task.attachments || []), attachment],
      });
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = async (attachmentId: number) => {
    try {
      await deleteTaskAttachment(task.id, attachmentId);
      onUpdate({
        ...task,
        attachments:
          task.attachments?.filter((a) => a.id !== attachmentId) || [],
      });
      alert("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Paperclip className="h-4 w-4" />
          Attachments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/*Upload */}
        <FileUpload
          onUpload={handleFileUpload}
          isUploading={isUploading}
          accept={{
            "image/*": [],
            "application/pdf": [],
            "application/msword": [],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [],
            "application/vnd.ms-excel": [],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              [],
            "text/plain": [],
          }}
          maxSize={10 * 1024 * 1024}
        />

        {/* File list */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="space-y-2">
            {task.attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <a
                  href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${file.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 truncate hover:underline"
                >
                  {file.original_name}
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFileDelete(file.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
