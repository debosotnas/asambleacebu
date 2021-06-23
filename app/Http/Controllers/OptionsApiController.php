<?php

namespace App\Http\Controllers;

use App\Models\Option;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OptionsApiController extends Controller
{

    private function getOptions() {
        $churchesDb = DB::table('options')
            ->select('id', 'election_id', 'name')
            ->where('active', '=', true)
            ->orderBy('name')
            ->get();

        $churches = array();

        foreach ($churchesDb as $church) {
            $tmp = [
                'id' => $church->id,
                'election_id' => $church->election_id,
                'name' => $church->name,
            ] ;
            array_push($churches, $tmp);
        }
        return $churches;
    }

    public function index(){
        return Option::all();
    }
    public function store(){
        request()->validate([
            'election_id' => 'required',
            'name' => 'required'
        ]);

        Option::create([
            'election_id' => request('election_id'),
            'name' => request('name'),
            'active' => true,
        ]);
        
        return $this->getOptions();
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

    public function softDelete(Option $option){
        $option->update([
            'active' => false
        ]);
        return $this->getOptions();
    }
}
