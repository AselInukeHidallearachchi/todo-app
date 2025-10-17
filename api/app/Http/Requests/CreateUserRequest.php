<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest 
{
    public function authorize():bool {return true;}

    public function rules():array
    {
        return [
             'name' => 'required|string|max:120',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'sometimes|in:user,admin',
            'is_active' => 'sometimes|boolean',
        ];
    }

}
