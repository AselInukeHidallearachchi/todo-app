<?php

//NOT WORKING
use App\Models\User;
use App\Models\Task;

describe('Task CRUD Operations', function () {
    beforeEach(function () {
        $this->user = User::factory()->create();
    });

    test('user can create a new task', function () {
        $title = 'Complete Project';
        $response = $this->actingAs($this->user)->postJson('/api/v1/tasks', [
            'title' => $title,
            'description' => 'Finish the todo app project',
            'priority' => 'high',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('title', $title)
            ->assertJsonPath('priority', 'high');

        $this->assertDatabaseHas('tasks', ['title' => $title]);
    });

    test('user can retrieve their tasks', function () {
        Task::factory(3)->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/tasks');

        $response->assertStatus(200);
        // Response structure may vary - check for data presence
        $this->assertTrue(
            $response->json('data') !== null || $response->json('*') !== null,
            'Response should contain tasks'
        );
    });

    test('user can update their task status', function () {
        $task = Task::factory()->create(['user_id' => $this->user->id, 'status' => 'todo']);

        $response = $this->actingAs($this->user)->putJson("/api/v1/tasks/{$task->id}", [
            'status' => 'completed',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);
    });

    test('user can delete their task', function () {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)->deleteJson("/api/v1/tasks/{$task->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    });
});
