<?php


namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // List only the current user's tasks
    public function index(Request $r)
    {
        $user = $r->user();
        
        // If admin, show all tasks. Otherwise, only user's tasks
        if ($user->isAdmin()) {
            return response()->json(Task::with('user')->latest()->get());
        }
        
        return response()->json(
            Task::where('user_id', $user->id)->latest()->get()
        );
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'title' => 'required|string|max:120',
            'description' => 'nullable|string',
            'status' => 'in:todo,in_progress,done',
        ]);

        $task = new Task($data);
        $task->user()->associate($r->user());
        $task->save();

        return response()->json($task, 201);
    }

    public function show(Request $r, Task $task)
    {
        return response()->json($task);
    }

    public function update(Request $r, Task $task)
    {
        $data = $r->validate([
            'title' => 'sometimes|string|max:120',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:todo,in_progress,done',
        ]);
        
        $task->fill($data)->save();
        return response()->json($task);
    }

    public function destroy(Request $r, Task $task)
    {
        $task->delete();
        return response()->json(['message'=>'Deleted successfully']);
    }
}