<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // List all users (admin only)
    public function index(): JsonResponse
    {
        $users = User::all();
        return response()->json($users);
    }

    // Get user details
    public function show(User $user): JsonResponse
    {
        return response()->json($user);
    }

    // Create new user (admin only)
    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = User::create($request->validated());
        return response()->json($user, 201);
    }

    // Update user (admin only)
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $user->update($request->validated());
        return response()->json($user);
    }

    // Delete user (admin only)
    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    // Change user role/status (admin only)
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'sometimes|in:user,admin',
            'is_active' => 'sometimes|boolean',
        ]);
        
        $user->update($validated);
        return response()->json($user);
    }

    public function toggleActive(Request $request, User $user)
{
    // Optional: Prevent admin from deactivating self
    if ($user->id === $request->user()->id) {
        return response()->json(['message' => 'You cannot deactivate your own account'], 403);
    }

    // Flip the boolean
    $user->is_active = !$user->is_active;
    $user->save();

    return response()->json([
        'message' => $user->is_active
            ? "{$user->name} has been activated"
            : "{$user->name} has been deactivated",
        'user' => $user->refresh(),
    ]);
}
public function getPreferences()
{
    $user = auth()->user();

    // Get or create default preferences for this user
    $preference = $user->preference ?? $user->preference()->create([
        'daily_digest_enabled' => false,
        'digest_time' => '06:00:00',
    ]);

    return response()->json([
        'daily_digest_enabled' => (bool) $preference->daily_digest_enabled,
        'digest_time' => substr($preference->digest_time, 0, 5), // HH:MM
    ]);
}

public function updatePreferences(Request $request)
{
    $validated = $request->validate([
        'daily_digest_enabled' => 'required|boolean',
        'digest_time' => 'required|date_format:H:i',
    ]);

    $preference = auth()->user()->preference()->updateOrCreate(
        ['user_id' => auth()->id()],
        [
            'daily_digest_enabled' => $validated['daily_digest_enabled'],
            'digest_time' => $validated['digest_time'] . ':00',
        ]
    );

    return response()->json([
        'daily_digest_enabled' => (bool) $preference->daily_digest_enabled,
        'digest_time' => substr($preference->digest_time, 0, 5),
    ]);
}


}