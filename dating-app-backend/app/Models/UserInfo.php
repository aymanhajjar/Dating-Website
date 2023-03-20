<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Location;

class UserInfo extends Model
{
    use HasFactory;
    
    protected $table = 'users_info';

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')->select('id', 'name', 'email');
    }

    public function user_get()
    {
        return $this->belongsTo(User::class, 'user_id')->select('id', 'name');
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id')->select('id', 'name');
    }

    protected $fillable = ['user_id', 'bio', 'age', 'gender', 'location_id'];
}

