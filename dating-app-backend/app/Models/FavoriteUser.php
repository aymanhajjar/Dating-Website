<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteUser extends Model
{
    use HasFactory;
    
    protected $table = 'favorite_users';

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')->select('id', 'name');
    }

    protected $fillable = ['user_id', 'favorite_user_id'];
}

