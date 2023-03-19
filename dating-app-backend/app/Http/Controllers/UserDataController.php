<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use App\Models\Message;
use App\Models\Conversation;
use App\Models\Notification;

class UserDataController extends Controller{
    
    
    public function getConvos(Request $request)
        {
            
            $user = $request->user();
            $id = $user->id;
            $convos = Conversation::where('user_one_id', $id)->get();
            $messages = [];
            foreach ($convos as $convo) {
                $latest_message = Message::with('User')->where('conversation_id', $convo->id)->latest('created_at')
                ->first();
                $messages[] = $latest_message;
            }
            return response()->json([
                'convos' => $messages
            ]);
        }

    public function getNotifications(Request $request)
        {
            
            $user = $request->user();
            $id = $user->id;
            $notfs = Notification::with(['user', 'target_user'])->where('user_id', $id)->get();
            return response()->json([
                'notifications' => $notfs
            ]);
        }

}