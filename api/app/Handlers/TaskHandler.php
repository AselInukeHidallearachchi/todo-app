<?php

namespace App\Handlers;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;
use App\Http\Requests\{CreateTaskRequest, UpdateTaskRequest};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\PaginationResource;
use App\Http\Responses\ApiResponse;

class TaskHandler
{
    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function handleGetTasks(Request $request, User $user): JsonResponse
    {
        try {
            $filters = [
                'status' => $request->query('status'),
                'sort' => $request->query('sort'),
                'search' => $request->query('search'),
                'page' => (int) $request->query('page', 1),
                'per_page' => (int) $request->query('per_page', 15),
            ];

            $tasks = $this->taskService->getAllTasks($user, $filters);
            $formatted = PaginationResource::transform($tasks);

            return ApiResponse::success($formatted, 'Tasks retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Error fetching tasks',
                $e->getMessage()
            );
        }
    }

    public function handleCreateTask(CreateTaskRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $validated['user_id'] = $request->user()->id;
            $validated['status'] = $validated['status'] ?? 'todo';
            $validated['priority'] = $validated['priority'] ?? 'medium';
            $validated['due_date'] = $validated['due_date'] ?? null;

            $task = $this->taskService->createTask($validated, $request->user());

            return ApiResponse::created(new TaskResource($task), 'Task created successfully');
        } catch (\Exception $e) {
            return ApiResponse::serverError('Error creating task', $e->getMessage());
        }
    }

    public function handleGetTask(int $taskId): JsonResponse
    {
        try {
            $task = $this->taskService->getTask($taskId);
            return ApiResponse::success(new TaskResource($task), 'Task retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponse::notFound('Task not found');
        }
    }

    public function handleUpdateTask(UpdateTaskRequest $request, int $taskId): JsonResponse
    {
        try {
            $task = $this->taskService->updateTask($request->validated(), $taskId);
            return ApiResponse::success(new TaskResource($task), 'Task updated successfully');
        } catch (\Exception $e) {
            return ApiResponse::serverError('Error updating task', $e->getMessage());
        }
    }

    public function handleDeleteTask(int $taskId): JsonResponse
    {
        try {
            $this->taskService->deleteTask($taskId);
            return ApiResponse::success(null, 'Task deleted successfully');
        } catch (\Exception $e) {
            return ApiResponse::serverError('Error deleting task', $e->getMessage());
        }
    }

    public function handleGetStatistics(User $user): JsonResponse
    {
        try {
            $stats = $this->taskService->getTaskStatistics($user);
            return ApiResponse::success($stats, 'Statistics retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponse::serverError('Error fetching statistics', $e->getMessage());
        }
    }
}
