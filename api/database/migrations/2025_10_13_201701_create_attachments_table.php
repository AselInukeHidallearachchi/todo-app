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
    Schema::create('attachments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('task_id')->constrained()->cascadeOnDelete();
        $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
        $table->string('original_name');
        $table->string('path');
        $table->string('mime_type', 191)->nullable();
        $table->unsignedBigInteger('size_bytes')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
