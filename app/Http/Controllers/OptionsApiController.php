<?php

namespace App\Http\Controllers;

use App\Models\Option;
use Illuminate\Http\Request;

class OptionsApiController extends Controller
{
    public function index(){
        return Option::all();
    }
    public function store(){
        request()->validate([
            'election_id' => 'required',
            'name' => 'required'
        ]);
        return Option::create([
            'election_id' => request('election_id'),
            'name' => request('name')
        ]);
    }
    public function update(Option $option){
        request()->validate([
            'election_id' => 'required',
            'name' => 'required'
        ]);
        $success = $option->update([
            'election_id' => request('election_id'),
            'name' => request('name')
        ]);
        return [
            'success' => $success
        ];
    }
    public function destroy(Option $option){
        $success = $option->delete();
        return [
            'success' => $success
        ];
    }
}
