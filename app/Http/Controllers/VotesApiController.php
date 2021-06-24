<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;

class VotesApiController extends Controller
{

    private function isElectionActive($election_id) {

        $elections = DB::table('elections')
            ->select('elections.id')
            ->where('elections.id', '=', $election_id)
            ->where('elections.visible', '=', true)
            ->where('elections.active', '=', true)
            ->get();

        return count($elections) > 0;

        // $isActive = false;
        // if (is_array($elections) && count($elections) > 0) {
        //     $curr = $elections[0];
        //     $isActive = $curr->id === $election_id;
        // }
        // return $isActive;
    }

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
/*
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
*/
    private function getReady(){
        $elections = DB::table('elections')
            ->select('elections.id', 'elections.title', 'elections.description')
            ->where('elections.visible', '=', true)
            ->where('elections.active', '=', true)
            ->get();

        $uuu = array();

        foreach ($elections as $election) {
            // $opts = $this->getOptions($election->id);
            $alreadyVote = $this->userAlreadyVoted($election->id);

            $tmp = [
                'id' => $election->id,
                'title' => $election->title,
                'description' => $election->description,
                'alreadyVote' => $alreadyVote,
                'idSession' => session('user_id'),
                // 'opts' => $opts,
            ];
            array_push($uuu, $tmp);
        }

        // if(count($uuu) > 0 && !$alreadyVote) {
        //     $user_id = Session::get('user_id');
        //     if ($user_id) {
        //         DB::table('users')
        //         ->where('id', $user_id)
        //             ->update(['lastaction' => DB::raw('CURRENT_TIMESTAMP')]);
        //     }
        // }

        return $uuu;
    }


    public function index(){
        return Vote::all();
    }
    public function store(){
        request()->validate([
            'election_id' => 'required',
            'option_id' => 'required',
            'user_id' => 'required'
        ]);

        if (Session::get('user_id') != request('user_id')) {
            return ['error' => 'Authorization error'];
        }

        if(!$this->isElectionActive(request('election_id'))) {
            return ['error' => 'Lo sentimos pero parece que la votación ha terminado. No fue posible enviar tu voto.'];
        }

        if ($this->userAlreadyVoted(request('election_id'))) {
            return ['error' => 'User has an existing vote for: '. request('election_id')];
        }

        Vote::create([
            'election_id' => request('election_id'),
            'option_id' => request('option_id'),
            'user_id' => request('user_id'),
            'active' => true
        ]);

        return $this->getReady();
        // return app('App\Http\Controller\ElectionsApiController')->getReady();
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
