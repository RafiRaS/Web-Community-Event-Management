<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/users/current', [ApiController::class, 'getCurrentUser']);
Route::get('/communities', [ApiController::class, 'getCommunities']);
Route::get('/events', [ApiController::class, 'getEvents']);
