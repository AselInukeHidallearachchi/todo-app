<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    //list attachments for a task 
    public function index(Task $task)
    {
        return $task->attachments()->with('uploader:id,name')->latest()->get();
    }

//upload one file      
public function store(Request $request, Task $task)
{
    try {
        
        $request->validate([
            'file' => 'required|max:10240|mimes:jpeg,png,pdf,doc,docx,xls,xlsx,txt',
        ]);
        info($request);
        if (!$request->hasFile('file')) {
            return response()->json([
                'message' => 'No file uploaded',
                'errors' => ['file' => ['No file was uploaded.']]
            ], 422);
        }

        $file = $request->file('file');
        
        if (!$file->isValid()) {
            return response()->json([
                'message' => 'Invalid file upload',
                'errors' => ['file' => [$file->getErrorMessage()]]
            ], 422);
        }

        // Make sure the storage directory exists and is writable
        $storage = Storage::disk('public');
        $path = $storage->putFile('attachments', $file);

        if (!$path) {
            return response()->json([
                'message' => 'Failed to save file',
                'errors' => ['file' => ['Could not save file to storage.']]
            ], 422);
        }

        $attachment = Attachment::create([
            'task_id' => $task->id,
            'uploaded_by' => $request->user()->id,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'size_bytes' => $file->getSize(),
        ]);

        return response()->json($attachment, 201);

    } catch (\Exception $e) {
        \Log::error('File upload error: ' . $e->getMessage());
        return response()->json([
            'message' => 'Upload failed',
            'errors' => ['file' => [$e->getMessage()]]
        ], 500);
    }
}


    public function destroy(Task $task, Attachment $attachment)
    {
       abort_unless($attachment->task_id === $task->id,403,'Not this task');
       Storage::disk('public')->delete($attachment->path);
       $attachment->delete();
       return response()->json(['ok'=>true]);
    }
}
