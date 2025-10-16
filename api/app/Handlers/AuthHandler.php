<?php

namespace App\Handlers;

use App\Services\AuthService;
use App\Http\Requests\{RegisterRequest, LoginRequest};
use Illuminate\Http\JsonResponse;

class AuthHandler
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handleRegister(RegisterRequest $request): JsonResponse
    {
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ];

        $result = $this->authService->register($userData);
        return response()->json($result, 201);
    }

    public function handleLogin(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->email, $request->password);

        if (!$result) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json($result);
    }

    public function handleLogout($user): JsonResponse
    {
        $this->authService->logout($user);
        return response()->json(['message' => 'Logged out']);
    }

    public function handleGetUser($user): JsonResponse
    {
        return response()->json(['user' => $user]);
    }
    public function handleGetTasks($user, array $filters = []): JsonResponse
{
    $tasks = $this->taskService->getAllTasks($user, $filters);
    return response()->json($tasks);
}

}