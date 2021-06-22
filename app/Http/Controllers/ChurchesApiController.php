<?php

namespace App\Http\Controllers;

use App\Models\Church;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChurchesApiController extends Controller
{

    private function getChurches() {
        $churchesDb = DB::table('churches')
            ->select('id', 'name', 'members')
            ->where('active', '=', true)
            ->orderBy('name')
            ->get();

        $churches = array();

        foreach ($churchesDb as $church) {
            $tmp = [
                'id' => $church->id,
                'name' => $church->name,
                'members' => $church->members
            ] ;
            array_push($churches, $tmp);
        }
        return $churches;
    }

    public function index(){
        return Church::all();
    }

    public function store(){
        request()->validate([
            'name' => 'required',
            'members' => 'required',
        ]);
        // return Church::create([
        Church::create([
            'name' => request('name'),
            'members' => request('members'),
            'active' => 1,
        ]);

        return [
            'churches' => $this->getChurches()
        ];
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
            'churches' => $this->getChurches()
        ];

        // return [
        //     'success' => $success
        // ];
    }

    public function softDelete(Church $church){
        // request()->validate([
        //     'name' => 'required',
        //     'members' => 'required',
        // ]);
        $church->update([
            'active' => false
        ]);
        // return [
        //     'success' => $success
        // ];
        return [
            'churches' => $this->getChurches()
        ];
    }
    
    public function destroy(Church $church){
        // $success = $church->delete();
        // return [
        //     'success' => $success
        // ];

        return [
            'churches' => $this->getChurches()
        ];

    }
}
