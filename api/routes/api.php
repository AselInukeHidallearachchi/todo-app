<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{AuthController, TaskController, UserController};

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum'])->group(function () {
        // First check auth, then check if user is active
        Route::middleware([\App\Http\Middleware\CheckUserActive::class])->group(function () {
            Route::get('/auth/me', [AuthController::class, 'me']);
            Route::post('/auth/logout', [AuthController::class, 'logout']);
            Route::apiResource('tasks', TaskController::class);

            // Admin routes
            Route::middleware('admin')->group(function () {
                Route::apiResource('users', UserController::class);
                Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
                Route::patch('/users/{user}/toggle', [UserController::class, 'toggleActive']);
            });
        });
    });
});