<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use Illuminate\Http\Request;

class VotesApiController extends Controller
{
    public function index(){
        return Vote::all();
    }
    public function store(){
        request()->validate([
            'election_id' => 'required',
            'option_id' => 'required',
            'user_id' => 'required'
        ]);
        return Vote::create([
            'election_id' => request('election_id'),
            'option_id' => request('option_id'),
            'user_id' => request('user_id')
        ]);
    }
    public function update(Vote $vote){
        request()->validate([
            'election_id' => 'required',
            'option_id' => 'required',
            'user_id' => 'required'
        ]);
        $success = $vote->update([
            'election_id' => request('election_id'),
            'option_id' => request('option_id'),
            'user_id' => request('user_id')
        ]);
        return [
            'success' => $success
        ];
    }
    public function destroy(Vote $vote){
        $success = $vote->delete();
        return [
            'success' => $success
        ];
    }

}
