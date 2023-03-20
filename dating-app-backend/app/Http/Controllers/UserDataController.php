<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use App\Models\Message;
use App\Models\Conversation;
use App\Models\Notification;
use App\Models\UserInfo;
use App\Models\User;

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

    public function getConvo($convo_id, Request $request)
        {
            
            $user = $request->user();
            $id = $user->id;
            $messages = Message::with('User')->where('conversation_id', $convo_id)->orderBy('created_at', 'ASC')->get();
            return response()->json([
                'messages' => $messages
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

    public function getInfo(Request $request)
    {
        $user = $request->user();
        $id = $user->id;
        $info = UserInfo::with(['user'])->where('user_id', $id)->get();
        return response()->json([
            'info' => $info
        ]);
    }

    public function updateInfo(Request $request) {
        $user = $request->user();
        $id = $user->id;
        UserInfo::where('user_id', $id)->update([
            'age' => $request->input('age'),
            'gender' => $request->input('gender'),
            'location_id' => $request->input('location'),
            'bio' => $request->input('bio') ? $request->input('bio') : ''
        ]);
        User::where('id', $id)->update([
            'name' => $request->input('name'),
            'email' => $request->input('email')
        ]);
        return response()->json([
            'status' => 'success!'
        ]);
    }

    public function sendMessage(Request $request) {
        $user = $request->user();
        $id = $user->id;

        Message::Create(
            ['author_id' => $id,
            'conversation_id' => $request->input('convo_id'),
            'content' => $request->input('message')]
        );

        return response()->json([
            'status' => 'success!'
        ]);
    }

}