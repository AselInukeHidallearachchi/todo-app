<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
     public function up(): void {
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title', 120);
        $table->text('description')->nullable();
        $table->enum('status', ['todo','in_progress','completed'])->default('todo')->index();
        $table->enum('priority', ['low','medium','high'])->default('medium')->index();
        $table->date('due_date')->nullable()->index();
        $table->timestamp('completed_at')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
