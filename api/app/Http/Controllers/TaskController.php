<?php

namespace App\Http\Controllers;

use App\Models\Task;
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
        //$filters = $request->only(['status', 'priority', 'due_date']);
        return $this->taskHandler->handleGetTasks($request,$request->user());
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
}