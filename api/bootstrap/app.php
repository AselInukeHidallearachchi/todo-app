<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureAdmin::class,
    ]);
    })
    ->withSchedule(function ($schedule) {
        $schedule->command('tasks:send-digests')->everyMinute();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle authentication exceptions for API requests
        $exceptions->render(function (Illuminate\Auth\AuthenticationException $e, Illuminate\Http\Request $request) {
            // For API routes, return JSON response instead of redirecting
            if ($request->expectsJson() || $request->is('api/*') || $request->is('v1/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Please log in.',
                    'error' => 'authentication_required'
                ], 401);
            }

            return null; // Let Laravel handle it normally for other requests
        });
    })->create();
