<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model {
    protected $fillable = ['task_id','uploaded_by','original_name','path','mime_type','size_bytes'];
    public function task(){ return $this->belongsTo(Task::class); }
    public function uploader(){ return $this->belongsTo(User::class,'uploaded_by'); }
}

