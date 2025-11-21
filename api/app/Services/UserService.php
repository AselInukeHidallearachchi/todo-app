<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    /**
     * Check if there's at least one admin remaining
     */
    public function ensureAtLeastOneAdmin(User $userToModify, ?string $newRole = null): void
    {
        // If we're changing to admin or user is not an admin, no check needed
        if ($newRole === 'admin' || !$userToModify->isAdmin()) {
            return;
        }

        // Count total admins
        $adminCount = User::where('role', 'admin')->count();

        if ($adminCount <= 1) {
            throw new \Exception('Cannot modify the last admin. There must be at least one admin in the system.');
        }
    }

    /**
     * Check if user can be deleted without removing the last admin
     */
    public function ensureAdminBeforeDelete(User $userToDelete): void
    {
        // If user is not admin, deletion is fine
        if (!$userToDelete->isAdmin()) {
            return;
        }

        $adminCount = User::where('role', 'admin')->count();

        if ($adminCount <= 1) {
            throw new \Exception('Cannot delete the last admin. There must be at least one admin in the system.');
        }
    }

    /**
     * Check if user can be deactivated without deactivating the last active admin
     */
    public function ensureActiveAdminBeforeDeactivate(User $userToDeactivate): void
    {
        // If user is not admin or already inactive, no check needed
        if (!$userToDeactivate->isAdmin() || !$userToDeactivate->is_active) {
            return;
        }

        $activeAdminCount = User::where('role', 'admin')
            ->where('is_active', true)
            ->count();

        if ($activeAdminCount <= 1) {
            throw new \Exception('Cannot deactivate the last active admin. There must be at least one active admin in the system.');
        }
    }
}
