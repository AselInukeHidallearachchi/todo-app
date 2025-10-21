<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->is_active) {
            // Revoke the current token and block requests
            if ($user->currentAccessToken()) {
                $user->currentAccessToken()->delete();
            }

            return response()->json([
                'message' => 'Your account has been deactivated. Please contact administrator.'
            ], 403);
        }

        return $next($request);
    }
}