<?php

namespace App\Http\Controllers;

use App\Http\Requests\{RegisterRequest, LoginRequest};
use App\Handlers\AuthHandler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    /**
     * Authentication request handler instance
     */
    protected AuthHandler $authHandler;

    /**
     * Initialize controller with auth handler dependency
     */
    public function __construct(AuthHandler $authHandler)
    {
        $this->authHandler = $authHandler;
    }

    /**
     * Register a new user
     * Creates a new user account and returns a Sanctum API token
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        return $this->authHandler->handleRegister($request);
    }

    /**
     * Authenticate user
     * Validates credentials and returns a new Sanctum token if successful
     */
    public function login(LoginRequest $request): JsonResponse
    {
        return $this->authHandler->handleLogin($request);
    }

    /**
     * Get authenticated user profile
     * Requires valid Sanctum token in Authorization header
     */
    public function me(Request $request): JsonResponse
    {
        return $this->authHandler->handleGetUser($request->user());
    }

    /**
     * Invalidate current session
     * Deletes the current access token while preserving other sessions
     */
    public function logout(Request $request): JsonResponse
    {
        return $this->authHandler->handleLogout($request->user());
    }
}
