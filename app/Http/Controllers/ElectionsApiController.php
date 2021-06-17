<?php

namespace App\Http\Controllers;

use App\Models\Election;
use Illuminate\Http\Request;

class ElectionsApiController extends Controller
{
    //'title', 'description', 'result', 'active'

    /*
    public function index(){
        
    }
    public function store(){

    }
    public function update(){

    }
    public function destroy(){

    }
    */

    public function index(){
        return Election::all();
    }
    public function store(){
        request()->validate([
            'title' => 'required'
        ]);
        return Election::create([
            'title' => request('title'),
            'description' => request('description'),
            'result' => 0,
            'active' => 0
        ]);
    }
    public function update(Election $election){
        request()->validate([
            'title' => 'required',
            'active' => 'required'
        ]);
        $success = $election->update([
            'title' => request('title'),
            'description' => request('description'),
            'result' => request('result'),
            'active' => request('active')
        ]);
        return [
            'success' => $success
        ];
    }
    public function destroy(Election $election){
        $success = $election->delete();
        return [
            'success' => $success
        ];
    }
}
