<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Notification extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')->select('id', 'name');
    }

    public function target_user()
    {
        return $this->belongsTo(User::class, 'target_user_id')
            ->select('id', 'name');
    }
    
    protected $table = 'users_notifications';

    public $timestamps = false;

    protected $fillable = ['user_id', 'target_user_id', 'seen'];
}