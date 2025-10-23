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

        //Admin see all tasks, users only their own
        if(!$user->isAdmin()){
            $query->where('user_id',$user->id);
        }

        if(!empty($filters['status'])) {
            $query->where('status',$filters['status']);
        }
        
         if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (!empty($filters['due_date'])) {
            $query->whereDate('due_date', $filters['due_date']);
        }

        return $query->orderBy('due_date', 'asc')->get(); //tasks ordering change based on date 
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