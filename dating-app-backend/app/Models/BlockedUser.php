<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlockedUser extends Model
{
    use HasFactory;
    
    protected $table = 'blocked_users';

    public function user()
    {
        return $this->belongsTo(User::class, 'blocker_id')->select('id', 'name');
    }

    public $timestamps = false;

    protected $fillable = ['blocker_id', 'blocked_id'];
}

