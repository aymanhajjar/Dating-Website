<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserInfo;
use App\Models\UserPhoto;
use App\Models\BlockedUser;
use App\Models\FavoriteUser;
use PhpParser\Node\Expr\FuncCall;

class DataController extends Controller{


    public function getLocations()
    {
    $locations = Location::all();
    return response()->json($locations);
    }

    public function getUsers(Request $request) {

        $user = $request->user();
        $id = $user->id;

        $response = [];
        $users = UserInfo::with(['user_get'])->whereNot('user_id', '=', $id)->get();
        foreach ($users as $user) {
            $photo = UserPhoto::select('path')->where('user_id', $user->user_id)->where('is_profile', 1)->first();
            $user->path = $photo;
            $response[] = $user;
        }
        return response()->json($response);
    }

    public function getUser($id, Request $request) {

        $user = $request->user();

        $blocked = BlockedUser::where('blocker_id', $user->id)->where('blocked_id', $id)->first();

        $favorite = FavoriteUser::where('user_id', $user->id)->where('favorite_user_id', $id)->first();

        $getuser = UserInfo::with(['user_get', 'location'])->where('user_id', $id)->first();
        $photo = UserPhoto::select('path', 'is_profile')->where('user_id', $id)->get();
        $getuser->photos = $photo;
        return response()->json([
            'info' => $getuser,
            'blocked' => $blocked ? 'true' : 'false',
            'favorite' => $favorite ? 'true' : 'false'
        ]);
    }


    public function filterUsers(Request $request) {
        $user = $request->user();
        $id = $user->id;

        $age = $request->query('age') ? $request->query('age') : null;
        $gender = $request->query('gender') ? $request->query('gender') : null;
        $location = $request->query('location') ? $request->query('location') : null;

        $response = [];

        $users = UserInfo::with(['user_get'])
                            ->when($age, function ($query, $age) {
                                return $query->where('age', '<' , intval($age));
                            })
                            ->when($age, function ($query, $age) {
                                return $query->where('age', '>' , intval($age)-5);
                            })
                            ->when($gender, function ($query, $gender) {
                                return $query->where('gender', $gender);
                            })
                            ->when($location, function ($query, $location) {
                                return $query->where('location_id', $location);
                            })
                            ->whereNot('user_id', '=', $id)
                            ->get();

        foreach ($users as $user) {
            $photo = UserPhoto::select('path')->where('user_id', $user->user_id)->where('is_profile', 1)->first();
            $user->path = $photo;
            $response[] = $user;
        }
        return response()->json($response);
    }

    public function searchUser($name, Request $request) {
        $user = $request->user();
        $id = $user->id;

        $response = [];

        $users = UserInfo::with(['user_get'])
                            ->whereHas('user_get', function($query) use($name) {
                                $query -> where('name', 'LIKE', '%'. $name .'%');
                            })
                            ->whereNot('user_id', '=', $id)
                            ->get();

        foreach ($users as $user) {
            $photo = UserPhoto::select('path')->where('user_id', $user->user_id)->where('is_profile', 1)->first();
            $user->path = $photo;
            $response[] = $user;
        }
        $response[] = $name;
        return response()->json($response);
    }

}