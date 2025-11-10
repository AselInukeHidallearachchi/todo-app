<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Attachment;
use App\Handlers\TaskHandler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    /**
     * Task request handler instance
     */
    protected TaskHandler $taskHandler;

    /**
     * Initialize controller with task handler dependency
     */
    public function __construct(TaskHandler $taskHandler)
    {
        $this->taskHandler = $taskHandler;
    }

    /**
     * List tasks based on user's role
     * If user is admin, shows all tasks, otherwise shows only user's tasks
     */
    public function index(Request $request): JsonResponse
    {
        return $this->taskHandler->handleGetTasks($request, $request->user());
    }

    /**
     * Create a new task for the authenticated user
     */
    public function store(CreateTaskRequest $request): JsonResponse
    {
        return $this->taskHandler->handleCreateTask( $request);
    }

    /**
     * Display details of a specific task
     */
    public function show(Request $request, Task $task): JsonResponse
    {
        return $this->taskHandler->handleGetTask($task->id);
    }

    /**
     * Update an existing task
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        return $this->taskHandler->handleUpdateTask($request, $task->id);
    }

    /**
     * Remove a task from the system
     */
    public function destroy(Request $request, Task $task): JsonResponse
    {
        return $this->taskHandler->handleDeleteTask($task->id);
    }

    /**
     * Get task statistics for authenticated user
     */
    public function statistics(Request $request): JsonResponse
    {
        return $this->taskHandler->handleGetStatistics($request->user());
    }

    // List attachments for a task
    public function indexAttachments(Task $task): JsonResponse
    {
        $attachments = $task->attachments()
        ->with('uploader:id,name')
        ->latest()
        ->get();
        return response()->json($attachments);
    }

    // Upload attachment
    public function storeAttachment(Request $request, Task $task): JsonResponse
    {
       try
       {
             $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:jpeg,png,pdf,doc,docx,xls,xlsx,txt']
        ]);

        $file = $request->file('file');
        $path = $file->store('attachments', 'public');//file configuration

        $attachment = Attachment::create([
            'task_id' => $task->id,
            'uploaded_by' => auth()->id(),
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size_bytes' => $file->getSize(),
        ]);


        return response()->json($attachment->load('uploader:id,name'), 201);//trait or resource
       }
       catch(\Exception $e){
            return response()->json(
                [
                    'message' => 'File upload failed',
                    'error' => $e->getMessage()
                ],500);
       }
    }

    public function destroyAttachment(Task $task, Attachment $attachment): JsonResponse
    {
        //Ensure attachment belongs to this task
        abort_unless($attachment->task_id === $task->id, 403);

          // Delete file from storage
          \Illuminate\Support\Facades\Storage::disk('public')->delete($attachment->path);

        $attachment->delete();
        return response()->json(['ok' => true]);
    }
}
