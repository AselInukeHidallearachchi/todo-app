<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = ['user_id','daily_digest_enabled','digest_time'];
    public function user(){ return $this->belongsTo(User::class);}
}
