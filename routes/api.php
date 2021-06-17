<?php

use App\Http\Controllers\ChurchesApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\Church;

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

// Route::post('/churches', function() {

//     request()->validate([
//         'name' => 'required',
//         'members' => 'required',
//     ]);
//     return Church::create([
//         'name' => request('name'),
//         'members' => request('members'),
//     ]);
// });

// Route::put('/churches/{church}', function(Church $church) {
//     request()->validate([
//         'name' => 'required',
//         'members' => 'required',
//     ]);

//     $sucess = $church->update([
//         'name' => request('name'),
//         'members' => request('members')
//     ]);

//     return [
//         'success' => $sucess
//     ];
// });

// Route::delete('/churches/{church}', function(Church $church) {

//     $sucess = $church->delete();

//     return [
//         'success' => $sucess
//     ];
// });

