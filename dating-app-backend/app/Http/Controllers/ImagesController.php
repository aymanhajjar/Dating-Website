<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\UserPhoto;

class ImagesController extends Controller{
    
    
    public function updateImage(Request $request)
        {
            $request->validate([
                'image' => 'required|image|mimes:jpg,jpeg,png',
            ]);

            $user = $request->user();
            $id = $user->id;
            $name = $user->name;
            $type = $request->input('type');

            if ($request->hasFile('image')) {
    
                $file = $request->file('image');

                $path = 'uploads/' . strval($id) . '_' . $type .$file->getClientOriginalExtension();

                Storage::delete($path);

                $name = strval($id) . '_' . $type .  '.' .$file->getClientOriginalExtension();
                $path = Storage::putFileAs('uploads', $file, $name);
                // $photo = new UserPhoto;
                $model = UserPhoto::updateOrCreate(
                    ['path' => $path],
                    ['user_id' => $id,
                    'is_profile' => $type == 'img-main' ? 1 : 0],
                );
                return response()->json(['path' => $path]);
            } else {
                return response()->json(['error' => 'No file selected']);
            }
        }

    public function getImages(Request $request)
    {
        $user = $request->user();
        $id = $user->id;
        $images = UserPhoto::where('user_id', $id)->get();
        return response()->json([
            'images' => $images
        ]);
    }

}