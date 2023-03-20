<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPhoto extends Model
{
    use HasFactory;
    
    protected $table = 'users_photos';

    public $timestamps = false;
    

    protected $fillable = ['user_id', 'path', 'is_profile'];
}

