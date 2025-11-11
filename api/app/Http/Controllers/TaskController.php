<?php

namespace App\Http\Controllers;

use App\Http\Resources\AttachmentResource;
use App\Models\Task;
use App\Models\Attachment;
use App\Handlers\TaskHandler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Responses\ApiResponse;
use App\Services\AttachmentService;


class TaskController extends Controller
{
    /**
     * Task request handler instance
     */
    protected TaskHandler $taskHandler;
    protected AttachmentService $attachmentService;

    /**
     * Initialize controller with task handler dependency
     */
    public function __construct(TaskHandler $taskHandler, AttachmentService $attachmentService)
    {
        $this->taskHandler = $taskHandler;
        $this->attachmentService = $attachmentService;
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
        return ApiResponse::success(
            AttachmentResource::collection($attachments),
            'Attachments retrieved successfully'
        );
    }

    // Upload attachment
    public function storeAttachment(Request $request, Task $task): JsonResponse
    {
       try
       {
             $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:jpeg,png,pdf,doc,docx,xls,xlsx,txt']
        ]);

        $attachment = $this->attachmentService->uploadAttachment(
            $task,
            $request->file('file')
        );

        return ApiResponse::created(
            new AttachmentResource($attachment->load('uploader:id,name')),
            'Attachment uploaded successfully'
        );
       }
       catch(\Exception $e){
            return ApiResponse::serverError('File upload failed',$e->getMessage());
       }
    }

    public function destroyAttachment(Task $task, Attachment $attachment): JsonResponse
    {
        abort_unless($attachment->task_id === $task->id, 403);
        $this->attachmentService->deleteAttachment($attachment);
        return ApiResponse::success(null, 'Attachment deleted successfully');
    }
}
