<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\UserDataController;

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');

});

Route::controller(DataController::class)->group(function () {
    Route::get('getlocations', 'getLocations');

});

Route::controller(UserDataController::class)->group(function () {
    Route::middleware('auth:api')->get('getconvos', 'getConvos');
    Route::middleware('auth:api')->get('getnotifications', 'getNotifications');

});
