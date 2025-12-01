<?php


namespace App\Services;

use App\Models\Task;
use App\Models\User;

class TaskService
{
    /**
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

        // Priority filter
        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        //Search filter
        if(!empty($filters['search'])){
            $search = trim($filters['search']);
            $query->where('title','like',"%{$search}%");
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
        //Pagination
        $perPage = $filters['per_page'] ?? 15;
        $page = $filters['page'] ?? 1;

        return $query->paginate($perPage,['*'],'page',$page);
    }


    public function createTask(array $data, User $user): Task
    {
         // Default values for missing fields
        $data['user_id'] = $user->id;
        $data['status'] = $data['status'] ?? 'todo';
        $data['priority'] = $data['priority'] ?? 'medium';

        return Task::create($data);
    }


    public function getTask(int $taskId): Task
    {
        return Task::with('attachments.uploader')->findOrFail($taskId);
    }


    public function updateTask(array $data, int $taskId): Task
    {
        $task = Task::findOrFail($taskId);
        $task->update($data);
        return $task;
    }


    public function deleteTask(int $taskId): bool
    {
        $task = Task::findOrFail($taskId);
        return $task->delete();
    }

    /**
     * Get task statistics for a user with single query using groupBy
     */
    public function getTaskStatistics(User $user): array
    {
        $query = Task::query();

        // Admin sees all tasks, regular users see only their tasks
        if (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        // Get counts grouped by status
        $statusCounts = $query
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Map status to expected keys
        return [
            'total' => array_sum($statusCounts),
            'completed' => $statusCounts['completed'] ?? 0,
            'in_progress' => $statusCounts['in_progress'] ?? 0,
            'pending' => $statusCounts['todo'] ?? 0,
        ];
    }
}
