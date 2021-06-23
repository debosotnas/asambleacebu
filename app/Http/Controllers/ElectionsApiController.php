<?php

namespace App\Http\Controllers;

use App\Models\Election;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
class ElectionsApiController extends Controller
{

    private function userAlreadyVoted($election_id) {
        $user_id = Session::get('user_id');

        $votes = DB::table('votes')
            // ->join('churches', 'users.church_id', '=', 'churches.id')
            ->select('votes.id', 'votes.election_id', 'votes.option_id')
            ->where('votes.election_id', '=', $election_id)
            ->where('votes.user_id', '=', $user_id)
            ->get();

        return count($votes) > 0;
    }

    private function getOptions($election_id) {
        $opts = DB::table('options')
            ->select('id', 'name')
            ->where('election_id', '=', $election_id)
            ->where('active', '=', true)
            ->orderBy('name')
            ->get();

        $options = array();

        foreach ($opts as $opt) {
            $tmp = [
                'id' => $opt->id,
                'name' => $opt->name
            ] ;
            array_push($options, $tmp);
        }
        return $options;
    }



    public function index(){
        return Election::all();
    }

    //get available to vote
    public function getReady(){
        $elections = DB::table('elections')
            ->select('elections.id', 'elections.title', 'elections.description')
            ->where('elections.visible', '=', true)
            ->where('elections.active', '=', true)
            ->get();

        $uuu = array();

        foreach ($elections as $election) {
            $opts = $this->getOptions($election->id);
            $alreadyVote = $this->userAlreadyVoted($election->id);

            $tmp = [
                'id' => $election->id,
                'title' => $election->title,
                'description' => $election->description,
                'alreadyVote' => $alreadyVote,
                'idSession' => session('user_id'),
                'opts' => $opts,
            ];
            array_push($uuu, $tmp);
        }

        return $uuu;
    }

    public function store(){
        request()->validate([
            'title' => 'required'
        ]);
        Election::create([
            'title' => request('title'),
            'description' => request('description'),
            'result' => 0,
            'active' => true,
            'visible' => false
        ]);

        return $this->getElections();
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

    private function getElections() {
        $churchesDb = DB::table('elections')
            ->select('id', 'title', 'description', 'result', 'visible')
            ->where('active', '=', true)
            ->orderBy('title')
            ->get();

        $churches = array();

        foreach ($churchesDb as $church) {
            $tmp = [
                'id' => $church->id,
                'title' => $church->title,
                'description' => $church->description,
                'result' => $church->result,
                'visible' => $church->visible
            ] ;
            array_push($churches, $tmp);
        }
        return $churches;
    }


    public function enableElection(Election $election){
        $election->update([
            'visible' => request('visible')
        ]);
        return $this->getElections();
    }

    public function softDelete(Election $election){
        $election->update([
            'active' => false
        ]);
        return $this->getElections();
    }

}
