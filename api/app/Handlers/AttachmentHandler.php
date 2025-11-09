<?php

namespace App\Handlers;

use App\Models\Task;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

// class AttachmentHandler
// {
//     /**
//      * List all attachments for a task
//      */
//     public function handleListAttachments(Task $task): JsonResponse
//     {
//         try {
//             $attachments = $task->attachments()
//                 ->with('uploader:id,name')
//                 ->latest()
//                 ->get();

//             return response()->json($attachments);
//         } catch (\Exception $e) {
//             Log::error('Error fetching attachments: ' . $e->getMessage());
//             return response()->json([
//                 'message' => 'Error fetching attachments',
//                 'error' => $e->getMessage()
//             ], 500);
//         }
//     }

//     /**
//      * Upload a new attachment to a task
//      */
//     public function handleUploadAttachment(Request $request, Task $task): JsonResponse
//     {
//         try {
//             // Validate the request first
//             $request->validate([
//                 'file' => [
//                     'required',
//                     'file',
//                     'max:10240',
//                     'mimes:jpeg,png,pdf,doc,docx,xls,xlsx,txt'
//                 ]
//             ]);

//             $file = $request->file('file');

//             // Store the file
//             $path = $file->store('attachments', 'public');

//             if (!$path) {
//                 Log::error('Failed to store file: ' . $file->getClientOriginalName());
//                 return response()->json([
//                     'message' => 'Failed to save file',
//                     'errors' => ['file' => ['Could not save file to storage.']]
//                 ], 500);
//             }

//             // Create attachment record
//             $attachment = Attachment::create([
//                 'task_id' => $task->id,
//                 'uploaded_by' => auth()->id(),
//                 'original_name' => $file->getClientOriginalName(),
//                 'path' => $path,
//                 'mime_type' => $file->getMimeType(),
//                 'size_bytes' => $file->getSize(),
//             ]);

//             // Load the uploader relationship before returning
//             $attachment->load('uploader:id,name');

//             return response()->json($attachment, 201);

//         } catch (\Exception $e) {
//             Log::error('File upload error: ' . $e->getMessage());
//             return response()->json([
//                 'message' => 'File upload failed',
//                 'errors' => ['file' => [$e->getMessage()]]
//             ], 500);
//         }
//     }

//     /**
//      * Delete an attachment from a task
//      */
//     public function handleDeleteAttachment(Task $task, Attachment $attachment): JsonResponse
//     {
//         try {
//             abort_unless($attachment->task_id === $task->id, 403, 'Not this task');

//             Storage::disk('public')->delete($attachment->path);
//             $attachment->delete();

//             return response()->json(['ok' => true]);
//         } catch (\Exception $e) {
//             Log::error('Error deleting attachment: ' . $e->getMessage());
//             return response()->json([
//                 'message' => 'Error deleting attachment',
//                 'error' => $e->getMessage()
//             ], 500);
//         }
//     }
// }
