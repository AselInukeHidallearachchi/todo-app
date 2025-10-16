<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;

class TaskService
{
    /**
     * Get tasks based on user's role
     * Admin sees all tasks, regular users see only their tasks
     */
    public function getAllTasks(User $user)
    {
        if ($user->isAdmin()) {
            return Task::with('user')->latest()->get();
        }
        
        return Task::where('user_id', $user->id)
                  ->latest()
                  ->get();
    }

    /**
     * Create a new task for a user
     */
    public function createTask(array $data, User $user): Task
    {
        $task = new Task($data);
        $task->user()->associate($user);
        $task->save();
        
        return $task;
    }

    /**
     * Get a specific task by ID
     */
    public function getTask(int $taskId): Task
    {
        return Task::findOrFail($taskId);
    }

    /**
     * Update task details
     */
    public function updateTask(array $data, int $taskId): Task
    {
        $task = Task::findOrFail($taskId);

        $task->fill($data)->save();
        
        return $task;
    }

    /**
     * Remove a task from the system
     */
    public function deleteTask(int $taskId): bool
    {
        return Task::findOrFail($taskId)->delete();
    }
}