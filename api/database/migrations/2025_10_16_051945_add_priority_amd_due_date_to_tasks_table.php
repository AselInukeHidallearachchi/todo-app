<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Only modify if the column exists(adding ENUM urgent)
            if (Schema::hasColumn('tasks', 'priority')) {
            DB::statement("ALTER TABLE tasks MODIFY priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium'");
        }
            if (!Schema::hasColumn('tasks', 'due_date')) {
                $table->timestamp('due_date')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['priority', 'due_date']);
        });
    }
};
