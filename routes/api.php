<?php

use App\Http\Controllers\ChurchesApiController;
use App\Http\Controllers\ElectionsApiController;
use App\Http\Controllers\OptionsApiController;
use App\Http\Controllers\UsersApiController;
use App\Http\Controllers\VotesApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// use App\Models\Church;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/churches', [ChurchesApiController::class, 'index']);
Route::post('/churches', [ChurchesApiController::class, 'store']);
Route::put('/churches/{church}', [ChurchesApiController::class, 'update']);
Route::delete('/churches/{church}', [ChurchesApiController::class, 'destroy']);

Route::get('/users', [UsersApiController::class, 'index']);
Route::post('/users', [UsersApiController::class, 'store']);
Route::put('/users/{user}', [UsersApiController::class, 'update']);
Route::delete('/users/{user}', [UsersApiController::class, 'destroy']);
Route::post('/users/signin', [UsersApiController::class, 'signin']);

Route::get('/elections', [ElectionsApiController::class, 'index']);
Route::post('/elections', [ElectionsApiController::class, 'store']);
Route::put('/elections/{election}', [ElectionsApiController::class, 'update']);
Route::delete('/elections/{election}', [ElectionsApiController::class, 'destroy']);

Route::get('/options', [OptionsApiController::class, 'index']);
Route::post('/options', [OptionsApiController::class, 'store']);
Route::put('/options/{option}', [OptionsApiController::class, 'update']);
Route::delete('/options/{option}', [OptionsApiController::class, 'destroy']);

Route::get('/votes', [VotesApiController::class, 'index']);
Route::post('/votes', [VotesApiController::class, 'store']);
//TODO: remove/disable Edit and Delete vote
Route::put('/votes/{vote}', [VotesApiController::class, 'update']);
Route::delete('/votes/{vote}', [VotesApiController::class, 'destroy']);
