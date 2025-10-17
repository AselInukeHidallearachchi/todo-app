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
}