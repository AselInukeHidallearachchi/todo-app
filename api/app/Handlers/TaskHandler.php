<?php

namespace App\Handlers;

use App\Services\TaskService;
use App\Http\Requests\{CreateTaskRequest, UpdateTaskRequest};
use Illuminate\Http\JsonResponse;

class TaskHandler
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function handleGetTasks($user): JsonResponse
    {
        $tasks = $this->taskService->getAllTasks($user);
        return response()->json($tasks);
    }

    public function handleCreateTask(CreateTaskRequest $request): JsonResponse
    {
        $task = $this->taskService->createTask($request->validated(), $request->user());
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