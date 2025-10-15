<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTaskRequest extends FormRequest
{
    public function authorize()
    {
        return true; //TODO:add policy later
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:120',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|string|in:pending,in_progress,completed',
        ];
    }
}