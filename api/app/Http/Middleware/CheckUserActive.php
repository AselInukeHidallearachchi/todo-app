<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiResponse;
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

            return ApiResponse::forbidden(
                'Your account has been deactivated. Please contact the administrator.'
            );
        }

        return $next($request);
    }
}
