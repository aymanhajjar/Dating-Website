<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use App\Models\Message;
use App\Models\Conversation;

class DataController extends Controller{


    public function getLocations()
    {
    $locations = Location::all();
    return response()->json($locations);
    }

}