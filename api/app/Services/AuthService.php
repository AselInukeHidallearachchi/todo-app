<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Register a new user and generate API token
     */
    public function register(array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        $data['role'] = $data['role'] ?? 'user';  // Default role
        $data['is_active'] = true;  // New users active by default
        $user = User::create($data);
        $token = $user->createToken('api')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Authenticate user and generate API token
     */
    public function login(string $email, string $password): ?array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }
        //Block inactive users at login
        if(!$user->is_active){
            throw new \Illuminate\Auth\AuthenticationException(
            'Your account has been deactivated. Please contact administrator.'
        );
        }
        $token = $user->createToken('api')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Invalidate user's current access token
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}