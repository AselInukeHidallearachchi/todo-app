<?php

namespace App\Http\Controllers;

use App\Http\Requests\{RegisterRequest, LoginRequest};
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user registration
     * Creates a new user and returns a Sanctum API token
     */
    public function register(RegisterRequest $req) {
        // Create a new user with hashed password
        $u = User::create([
            'name' => $req->name,
            'email' => $req->email,
            'password' => Hash::make($req->password),
        ]);

        // Generate a new personal access token for API authentication
        $token = $u->createToken('api')->plainTextToken;

        // Return user details and token as JSON response
        return response()->json(['user' => $u, 'token' => $token], 201);
    }

    /**
     * Handle user login
     * Validates credentials and returns a new Sanctum token if successful
     */
    public function login(LoginRequest $req) {
        // Find user by email
        $u = User::where('email', $req->email)->first();

        // Check if user exists and password matches
        if (!$u || !Hash::check($req->password, $u->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Generate a new token for the authenticated user
        $token = $u->createToken('api')->plainTextToken;

        // Return user info and token
        return response()->json(['user' => $u, 'token' => $token]);
    }

    /**
     * Get the currently authenticated user
     * Requires valid Sanctum token in Authorization header
     */
    public function me(Request $req) {
        // Return the authenticated user (automatically resolved by Sanctum)
        return response()->json(['user' => $req->user()]);
    }

    /**
     * Logout the currently authenticated user
     * Deletes the current access token only
     */
    public function logout(Request $req) {
        // Delete only the token used in this request (not all tokens)
        $req->user()->currentAccessToken()->delete();

        // Send logout confirmation message
        return response()->json(['message' => 'Logged out']);
    }
}
