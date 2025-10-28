<?php

namespace App\Http\Request;

use Illuminate\Foundation\Http\FormRequest;

class TaskFilterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return[
                        
            // Filter fields
            'status'     => 'nullable|string|in:todo,in_progress,completed', 
            'priority'   => 'nullable|string|in:low,medium,high,urgent',
            'due_date'   => 'nullable|date',
            'search'     => 'nullable|string|max:255',
            // Sorting and pagination
            'order_by'   => 'nullable|string|in:due_date,created_at,priority,status',
            'order_dir'  => 'nullable|string|in:asc,desc',
            'page'       => 'nullable|integer|min:1',
            'per_page'   => 'nullable|integer|min:1|max:100',
        ];
    }
}