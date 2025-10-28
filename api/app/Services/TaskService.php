<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;

class TaskService
{
    /**
     * Get tasks based on user's role with attachments
     * Admin sees all tasks, regular users see only their tasks
     */
    public function getAllTasks(User $user, array $filters=[])
{
    $query = Task::with('attachments');

    // Base filters
    if (!$user->isAdmin()) {
        $query->where('user_id', $user->id);
    }

    // Status filter
    if (!empty($filters['status'])) {
        $query->where('status', $filters['status']);
    }

    // Sorting
    if (!empty($filters['sort'])) {
        switch ($filters['sort']) {
            case 'priority':
                $query->orderByRaw("FIELD(priority, 'urgent', 'high', 'medium', 'low')");
                break;
            case 'due_date':
                $query->orderBy('due_date', 'asc');
                break;
            default:
                $query->latest(); // Default sort by created_at desc
        }
    } else {
        $query->latest(); // Default sort
    }

    return $query->get();
}

    /**
     * Create a new task for a user
     */
    public function createTask(array $data, User $user): Task
    {
         // Default values for missing fields
        $data['user_id'] = $user->id;
        $data['status'] = $data['status'] ?? 'todo';
        $data['priority'] = $data['priority'] ?? 'medium';

        return Task::create($data);
    }

    /**
     * Get a specific task by ID with its attachments
     */
    public function getTask(int $taskId): Task
    {
        return Task::with('attachments.uploader')->findOrFail($taskId);
    }

    /**
     * Update task details
     */
    public function updateTask(array $data, int $taskId): Task
    {
        $task = Task::findOrFail($taskId);
        $task->update($data);
        return $task;
    }

    /**
     * Remove a task from the system
     */
    public function deleteTask(int $taskId): bool
    {
        $task = Task::findOrFail($taskId);
        return $task->delete();
    }
}