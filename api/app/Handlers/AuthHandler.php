<?php

namespace App\Handlers;

use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Http\Requests\{RegisterRequest, LoginRequest};
use Illuminate\Http\JsonResponse;
use App\Http\Responses\ApiResponse;
use App\Models\User;

class AuthHandler
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handleRegister(RegisterRequest $request): JsonResponse
    {
       try
       {
         $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role ?? 'user',
        ];

        $result = $this->authService->register($userData);
        return ApiResponse::created($result,'User registered successfully');
       }catch (\Exception $e){
        return ApiResponse::serverError($e->getMessage());
       }
    }

    public function handleLogin(LoginRequest $request): JsonResponse
    {
        try{
            $result = $this->authService->login($request->email, $request->password);

        if (!$result) {
                return ApiResponse::unauthorized('Invalid credentials');
        }

        return ApiResponse::success($result, 'Login successful');
        }catch(\Illuminate\Auth\AuthenticationException $e){
            return ApiResponse::forbidden($e->getMessage());
        }
    }

    public function handleLogout(User $user): JsonResponse
    {
        $this->authService->logout($user);
        return ApiResponse::success(null, 'Logged out successfully');
    }

    public function handleGetUser(User $user): JsonResponse
    {
        return ApiResponse::success(new UserResource($user), 'User profile retrieved successfully');
    }
}

