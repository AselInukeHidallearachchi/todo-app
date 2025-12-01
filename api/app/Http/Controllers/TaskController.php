<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Attachment;
use Illuminate\Http\Request;
use App\Handlers\TaskHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Responses\ApiResponse;
use App\Services\AttachmentService;
use App\Http\Resources\TaskResource;
use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\AttachmentResource;

class TaskController extends Controller
{

    protected TaskHandler $taskHandler;
    protected AttachmentService $attachmentService;


    public function __construct(TaskHandler $taskHandler, AttachmentService $attachmentService)
    {
        $this->taskHandler = $taskHandler;
        $this->attachmentService = $attachmentService;
    }

    /**
     * If user is admin, shows all tasks, otherwise shows only user's tasks
     */
    public function index(Request $request): JsonResponse
    {
        return $this->taskHandler->handleGetTasks($request, $request->user());
    }


    public function store(CreateTaskRequest $request): JsonResponse
    {
        return $this->taskHandler->handleCreateTask( $request);
    }


    public function show(Request $request, Task $task): JsonResponse
    {
        return $this->taskHandler->handleGetTask($task->id);
    }


    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        return $this->taskHandler->handleUpdateTask($request, $task->id);
    }


    public function destroy(Request $request, Task $task): JsonResponse
    {
        return $this->taskHandler->handleDeleteTask($task->id);
    }


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

    /**
     * Create task with attachments in single request
     */
    public function createWithAttachments(Request $request): JsonResponse
    {
        try
        {
           $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'required|in:todo,in_progress,completed',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'required|date|after_or_equal:today',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240|mimes:jpeg,png,pdf,doc,docx,xls,xlsx,txt'
           ]);

           $task = DB::transaction(function() use ($validated, $request) {
            $task = Task::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? '',
                'status' => $validated['status'],
                'priority' => $validated['priority'],
                'due_date' => $validated['due_date'],
                'user_id' => auth()->user()->id,
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $attachment = $this->attachmentService->uploadAttachment($task, $file);
                    $task->attachments()->save($attachment);
                }
            }

            return $task;
           });

           $task->load('attachments.uploader:id,name');

            return ApiResponse::created(
            new TaskResource($task),
            'Task created with attachments successfully'
        );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::validationError($e->errors());
        } catch (\Exception $e) {
            return ApiResponse::serverError('Failed to create task', $e->getMessage());
        }
    }
}
