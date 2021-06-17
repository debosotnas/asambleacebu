<?php

namespace App\Http\Controllers;

use App\Models\Church;
use Illuminate\Http\Request;

class ChurchesApiController extends Controller
{
    public function index(){
        return Church::all();
    }

    public function store(){
        request()->validate([
            'name' => 'required',
            'members' => 'required',
        ]);
        return Church::create([
            'name' => request('name'),
            'members' => request('members'),
        ]);
    }

    public function update(Church $church){
        request()->validate([
            'name' => 'required',
            'members' => 'required',
        ]);
        $success = $church->update([
            'name' => request('name'),
            'members' => request('members')
        ]);
        return [
            'success' => $success
        ];
    }
    
    public function destroy(Church $church){
        $success = $church->delete();
        return [
            'success' => $success
        ];
    }
}
