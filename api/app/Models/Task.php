<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model {
    protected $fillable = ['title','description','status','priority','due_date','completed_at'];
    protected $casts = ['due_date' => 'date', 'completed_at' => 'datetime'];
    public function user(){ return $this->belongsTo(User::class); }
    public function attachments(){ return $this->hasMany(Attachment::class); }
}

