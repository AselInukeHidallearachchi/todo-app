<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Users can view only their own tasks or, if admin, all tasks
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        return $user->id === $task->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // All active users can create tasks
        return $user->is_active;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        return $user->id === $task->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->id === $task->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can attach files to the task.
     */
    public function attach(User $user, Task $task): bool
    {
        return $user->id === $task->user_id || $user->isAdmin();
    }

    /**
     * Optionally allow restore/force delete only for admins.
     */
    public function restore(User $user, Task $task): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Task $task): bool
    {
        return $user->isAdmin();
    }
}
