<?php

use App\Models\User;
use App\Models\Task;

describe('Authorization', function () {
    test('user cannot access another user\'s task via direct API call', function () {
        $owner = User::factory()->create();
        $other_user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $owner->id]);

        // Attempt to get task as different user - expect 403 or 404
        $response = $this->actingAs($other_user)
            ->getJson("/api/v1/tasks/{$task->id}");

        $this->assertThat(
            $response->status(),
            $this->logicalOr(
                $this->equalTo(403),
                $this->equalTo(404)
            ),
            'User should not be able to access another user\'s task'
        );
    });

    test('unauthenticated user cannot access protected routes', function () {
        $response = $this->getJson('/api/v1/tasks');

        $response->assertStatus(401);
    });
});
