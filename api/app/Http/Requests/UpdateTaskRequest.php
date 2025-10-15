<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'sometimes|string|max:120',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,todo,in_progress,completed,done',
        ];
    }
}