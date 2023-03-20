<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\BlockedUser;
use App\Models\FavoriteUser;
use App\Models\Notification;

class RelationController extends Controller{
    
    function blockUser(Request $request) {
        $user = $request->user();
        $id = $user->id;

        $blocked = $request->input('blocked_id');

        $is_blocked = BlockedUser::with(['user'])->where('blocker_id', $id)->where('blocked_id', $blocked)->first();

        $user_info = User::where('id', $id)->first();

        if($is_blocked) {
            $is_blocked->delete();
            Notification::Create(
                ['user_id' => $blocked,
                'target_user_id' => $id,
                'content' => $user_info->name . ' has unblocked you']
            );
        } else {
            BlockedUser::Create(
                ['blocker_id' => $id,
                'blocked_id' => $blocked]
            );
            Notification::Create(
                ['user_id' => $blocked,
                'target_user_id' => $id,
                'content' => $user_info->name . ' has blocked you']
            );
        }

        return response()->json(!$is_blocked);

    }

    function favoriteUser(Request $request) {
        $user = $request->user();
        $id = $user->id;

        $favorite = $request->input('favorite_id');

        $is_favorite = FavoriteUser::with(['user'])->where('user_id', $id)->where('favorite_user_id', $favorite)->first();

        $user_info = User::where('id', $id)->first();

        if($is_favorite) {
            $is_favorite->delete();
            Notification::Create(
                ['user_id' => $favorite,
                'target_user_id' => $id,
                'content' => $user_info->name . ' have removed you from their favorites']
            );
        } else {
            FavoriteUser::Create(
                ['user_id' => $id,
                'favorite_user_id' => $favorite]
            );
            Notification::Create(
                ['user_id' => $favorite,
                'target_user_id' => $id,
                'content' => $user_info->name . ' have added you to their favorites']
            );
        }

        return response()->json(!$is_favorite);

    }
}