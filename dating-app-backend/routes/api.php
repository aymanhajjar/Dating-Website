<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\UserDataController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\RelationController;

Route::get('/storage/{path}', function ($path) {
    $path = storage_path('app/' . $path);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
})->where('path', '.*');

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');

});

Route::controller(DataController::class)->group(function () {
    Route::get('getlocations', 'getLocations');
    Route::middleware('auth:api')->get('getuser/{id}', 'getUser');
    Route::middleware('auth:api')->get('getusers', 'getUsers');
    Route::middleware('auth:api')->get('search/{name}', 'searchUser');
    Route::middleware('auth:api')->get('filterusers', 'filterUsers');

});

Route::controller(UserDataController::class)->group(function () {
    Route::middleware('auth:api')->get('getconvos', 'getConvos');
    Route::middleware('auth:api')->get('getconvo/{id}', 'getConvo');
    Route::middleware('auth:api')->get('getnotifications', 'getNotifications');
    Route::middleware('auth:api')->get('getinfo', 'getInfo');
    Route::middleware('auth:api')->post('updateinfo', 'updateInfo');
    Route::middleware('auth:api')->post('sendmessage', 'sendMessage');
});

Route::controller(ImagesController::class)->group(function () {
    Route::middleware('auth:api')->post('updateimage', 'updateImage');
    Route::middleware('auth:api')->get('getimages', 'getImages');
});

Route::controller(RelationController::class)->group(function () {
    Route::middleware('auth:api')->post('block', 'blockUser');
    Route::middleware('auth:api')->post('favorite', 'favoriteUser');
});