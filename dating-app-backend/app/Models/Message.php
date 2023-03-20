<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Message extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class, 'author_id')->select('id', 'name');
    }
    
    protected $table = 'Messages';

    public $timestamps = true;

    protected $fillable = ['author_id', 'conversation_id', 'content', 'seen'];
}

