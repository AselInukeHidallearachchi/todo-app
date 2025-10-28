<?php

namespace App\Handlers;
use App\Models\Task;
use App\Services\TaskService;
use App\Http\Requests\{CreateTaskRequest, UpdateTaskRequest};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;

class TaskHandler
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function handleGetTasks(Request $request, User $user): JsonResponse
    {
        try{
            $filters = [
            'status' => $request->query('status'),
            'sort' => $request->query('sort'),
            'search' => $request->query('search')
        ];
        $tasks = $this->taskService->getAllTasks($user,$filters);
        return response()->json($tasks);
        }catch(\Exception $e){
            return response()->json([
            'message' => 'Error fetching tasks',
            'error' => $e->getMessage()
        ], 500);
        }
    }

    public function handleCreateTask(CreateTaskRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = $validated['status'] ?? 'todo';
        $validated['priority'] = $validated['priority'] ?? 'medium';
        $validated['due_date'] = $validated['due_date'] ?? null;

        $task = $this->taskService->createTask($validated, $request->user());
        
        return response()->json($task, 201);
    }

    public function handleGetTask(int $taskId): JsonResponse
    {
        $task = $this->taskService->getTask($taskId);
        return response()->json($task);
    }

    public function handleUpdateTask(UpdateTaskRequest $request, int $taskId): JsonResponse
    {
        $task = $this->taskService->updateTask($request->validated(), $taskId);
        return response()->json($task);
    }

    public function handleDeleteTask(int $taskId): JsonResponse
    {
        $this->taskService->deleteTask($taskId);
        return response()->json(['message' => 'Deleted successfully']);
    }
}