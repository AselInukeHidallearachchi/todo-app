<?php

namespace App\Http\Controllers;

use App\Http\Requests\{RegisterRequest, LoginRequest};
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $req) {
        $u = User::create([
            'name' => $req->name,
            'email' => $req->email,
            'password' => Hash::make($req->password),
        ]);
        $token = $u->createToken('api')->plainTextToken;
        return response()->json(['user'=>$u, 'token'=>$token], 201);
    }

    public function login(LoginRequest $req) {
        $u = User::where('email', $req->email)->first();
        if (!$u || !Hash::check($req->password, $u->password)) {
            return response()->json(['message'=>'Invalid credentials'], 401);
        }
        $token = $u->createToken('api')->plainTextToken;
        return response()->json(['user'=>$u, 'token'=>$token]);
    }

    public function me(Request $req) {
        return response()->json(['user' => $req->user()]);
    }

    public function logout(Request $req) {
        $req->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'Logged out']);
    }
}
