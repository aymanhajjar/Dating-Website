<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;

class DataController extends Controller{
    
    public function getLocations()
    {
    $locations = Location::all();
    return response()->json($locations);
    }
}