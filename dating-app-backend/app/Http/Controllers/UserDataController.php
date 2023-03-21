<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

    public function getConvo(Request $request)
        {
            
            $user = $request->user();
            $id = $user->id;
            $newconvo = null;

            if($request->query('convo_id') == null) {
                $target_user = $request->query('target_user');
                $convo = Conversation::where('user_one_id', $id)->where('user_two_id', $target_user)->first();
                if($convo) {
                    $convo_id = $convo->id;
                    $messages = Message::with('User')->where('conversation_id', $convo_id)->orderBy('created_at', 'ASC')->get();
                    $newconvo = $convo;
                } else {
                    $messages = [];
                    $newconvo = Conversation::Create([
                        'user_one_id' => $id,
                        'user_two_id' => $target_user
                    ]);
                };
                return response()->json([
                    'messages' => $messages,
                    'convo_id' => $newconvo->id
                ]);
            } else {
                $convo_id = $request->query('convo_id');
                $messages = Message::with('User')->where('conversation_id', $convo_id)->orderBy('created_at', 'ASC')->get();
                return response()->json([
                    'messages' => $messages
                ]);
            }
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

    public function reset(Request $request) {
            $email = $request->email;
            $password = $request->password;
            User::where('email', $email)->update(['password' => Hash::make($password)]);
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