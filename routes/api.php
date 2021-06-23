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

// add church
Route::post('/churches', [ChurchesApiController::class, 'store']);
Route::put('/churches/del/{church}', [ChurchesApiController::class, 'softDelete']);
Route::put('/churches/{church}', [ChurchesApiController::class, 'update']);
/*
Route::get('/churches', [ChurchesApiController::class, 'index']);
Route::delete('/churches/{church}', [ChurchesApiController::class, 'destroy']);


Route::get('/users', [UsersApiController::class, 'index']);
Route::put('/users/{user}', [UsersApiController::class, 'update']);
Route::delete('/users/{user}', [UsersApiController::class, 'destroy']);
*/
// CREATE USER
Route::post('/users', [UsersApiController::class, 'store']);

Route::get('/users/from/{church}', [UsersApiController::class, 'fromChurch']);
Route::post('/users/signin', [UsersApiController::class, 'signin']);

// get available elections
Route::get('/elections', [ElectionsApiController::class, 'index']);
// get available elections to vote
Route::get('/elections/ready', [ElectionsApiController::class, 'getReady']);
// soft delete election
Route::put('/elections/del/{election}', [ElectionsApiController::class, 'softDelete']);

// ACTIVATE election!
Route::put('/elections/activate/{election}', [ElectionsApiController::class, 'enableElection']);

// create election
Route::post('/elections', [ElectionsApiController::class, 'store']);
// create option
Route::post('/options', [OptionsApiController::class, 'store']);
// soft delete option 
Route::put('/options/del/{option}', [OptionsApiController::class, 'softDelete']);

/*
Route::put('/elections/{election}', [ElectionsApiController::class, 'update']);
Route::delete('/elections/{election}', [ElectionsApiController::class, 'destroy']);

Route::get('/options', [OptionsApiController::class, 'index']);
Route::put('/options/{option}', [OptionsApiController::class, 'update']);
Route::delete('/options/{option}', [OptionsApiController::class, 'destroy']);

Route::get('/votes', [VotesApiController::class, 'index']);
//TODO: remove/disable Edit and Delete vote
Route::put('/votes/{vote}', [VotesApiController::class, 'update']);
Route::delete('/votes/{vote}', [VotesApiController::class, 'destroy']);
*/
// get available elections/votes
Route::get('/votes', [VotesApiController::class, 'index']);
// MAKE VOTE!!!!
Route::post('/votes', [VotesApiController::class, 'store']);
