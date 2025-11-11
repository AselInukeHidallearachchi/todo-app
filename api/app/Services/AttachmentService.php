<?php

namespace App\Services;

use App\Models\Task;
use App\Models\Attachment;
use illuminate\Http\UploadedFile;

class AttachmentService
{
    public function uploadAttachment(Task $task,UploadedFile $file): Attachment
    {
        $path = $file->store('attachments','public');

         $attachment = Attachment::create([
            'task_id' => $task->id,
            'uploaded_by' => auth()->id(),
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size_bytes' => $file->getSize(),
        ]);

        return $attachment->load('uploader:id,name');
    }

    public function deleteAttachment(Attachment $attachment)
    {
         // Delete file from storage
          \Illuminate\Support\Facades\Storage::disk('public')->delete($attachment->path);
         $attachment->delete();
    }
}
