<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // List all users (admin only)
    public function index(): JsonResponse
    {
        $users = User::all();
        return ApiResponse::success(
            UserResource::collection($users),
            'Users retrieved successfully'
        );
    }

    // Get user details
    public function show(User $user): JsonResponse
    {
        return ApiResponse::success(
            new UserResource($user),
            'User retrieved successfully'
        );
    }

    // Create new user (admin only)
    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = User::create($request->validated());
        return ApiResponse::created(
            new UserResource($user),
            'User created successfully'
        );
    }

    // Update user (admin only)
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $user->update($request->validated());
        return ApiResponse::success(
            new UserResource($user),
            'User updated successfully'
        );
    }

    // Delete user (admin only)
    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return ApiResponse::success(null, 'User deleted successfully');
    }

    // Change user role/status (admin only)
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'sometimes|in:user,admin',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($validated);
        return ApiResponse::success(
            new UserResource($user),
            'User role updated successfully'
        );
    }

    public function toggleActive(Request $request, User $user): JsonResponse
    {
        // Optional: Prevent admin from deactivating self
        if ($user->id === $request->user()->id) {
            return ApiResponse::forbidden('You cannot deactivate your own account');
        }

        // Flip the boolean
        $user->is_active = !$user->is_active;
        $user->save();

        $message = $user->is_active
            ? "{$user->name} has been activated"
            : "{$user->name} has been deactivated";

        return ApiResponse::success(
            new UserResource($user->refresh()),
            $message
        );
    }
    public function getPreferences(Request $request): JsonResponse
    {
        $user = $request->user();

        // Get or create default preferences for this user
        $preference = $user->preference ?? $user->preference()->create([
            'daily_digest_enabled' => false,
            'digest_time' => '06:00:00',
        ]);

        return ApiResponse::success([
            'daily_digest_enabled' => (bool) $preference->daily_digest_enabled,
            'digest_time' => substr($preference->digest_time, 0, 5), // HH:MM
        ], 'Preferences retrieved successfully');
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'daily_digest_enabled' => 'required|boolean',
            'digest_time' => 'required|date_format:H:i',
        ]);

        $user = $request->user();
        $preference = $user->preference()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'daily_digest_enabled' => $validated['daily_digest_enabled'],
                'digest_time' => $validated['digest_time'] . ':00',
            ]
        );

        return ApiResponse::success([
            'daily_digest_enabled' => (bool) $preference->daily_digest_enabled,
            'digest_time' => substr($preference->digest_time, 0, 5),
        ], 'Preferences updated successfully');
    }
}
