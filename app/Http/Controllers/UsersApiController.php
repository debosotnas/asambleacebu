<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UsersApiController extends Controller
{
    private function createPassword() {
        $pass = time().rand(1,100000);
        return substr($pass, -8);
    }

    public function index(){
        return User::all();
    }
    public function store(){
        request()->validate([
            'church_id' => 'required',
            'ci' => 'required',
            'name' => 'required',
            'email' => 'required',
            'phone' => 'required',
        ]);
        return User::create([
            'church_id' => request('church_id'),
            'ci' => request('ci'),
            'name' => request('name'),
            'email' => request('email'),
            'phone' => request('phone'),
            'password' => $this->createPassword()
        ]);
    }

    public function update(User $user){
        request()->validate([
            'church_id' => 'required',
            'ci' => 'required',
            'name' => 'required',
            'email' => 'required',
            'phone' => 'required',
        ]);
        $success = $user->update([
            'church_id' => request('church_id'),
            'ci' => request('ci'),
            'name' => request('name'),
            'email' => request('email'),
            'phone' => request('phone'),
        ]);
        return [
            'success' => $success
        ];
    }

    public function destroy(User $user){
        $success = $user->delete();
        return [
            'success' => $success
        ];
    }

    public function signin() {
        request()->validate([
            'ci' => 'required',
            'code' => 'required',
        ]);
        return [
            'login' => 'ok'
        ];
    }
}