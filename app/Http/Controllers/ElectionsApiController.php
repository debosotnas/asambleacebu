<?php

namespace App\Http\Controllers;

use App\Models\Election;
use Exception;
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

        $user_already_voted = false;
        foreach ($elections as $election) {
            $opts = $this->getOptions($election->id);
            $alreadyVote = $this->userAlreadyVoted($election->id);
            $user_already_voted = $alreadyVote ? $alreadyVote : $user_already_voted;

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

        if(count($uuu) > 0 && !$user_already_voted) {
            try {
                $user_id = Session::get('user_id');
                if ($user_id) {
                    DB::table('users')
                    ->where('id', $user_id)
                        ->update(['lastaction' => DB::raw('CURRENT_TIMESTAMP')]);
                }
            } catch (Exception $e) {
                    
            }
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

    public function getGeneralResults($election) {

/*
select
    options.name, votes.option_id, count(*) as total
from
    votes inner join options
    on
        votes.option_id = options.id
where
    votes.election_id = $election
group by 
    votes.option_id
*/

        $counter = DB::table('votes')
            ->join('options', 'votes.option_id', '=', 'options.id')
            ->select('options.name', 'votes.option_id', DB::raw('count(*) as total'))
            ->where('votes.election_id', '=', $election)
            ->groupBy('votes.option_id')
            ->get();

/*
select 
    churches.name, churches.members, count(*) as perChurch, (count(*) * 100 / churches.members) as percent 
from 
    votes, users, churches 
where 
    votes.user_id = users.id and users.church_id = churches.id and users.active = true and votes.election_id = 1 
group by 
    churches.id
*/
        $bychurches = DB::table('votes')
            ->join('users', 'votes.user_id', '=', 'users.id')
            ->join('churches', 'users.church_id', '=', 'churches.id')
            ->select(DB::raw('churches.name, churches.members, count(*) as perChurch, (count(*) * 100 / churches.members) as percent'))
            ->where('users.active', '=', true) 
            ->where('votes.election_id', '=', $election)
            ->groupBy('churches.id')
            ->get();


        $tmpChurches = array();

        foreach ($bychurches as $ch) {
            $tmp = [
                'name' => $ch->name,
                'members' => $ch->members,
                'perChurch' => $ch->perChurch,
                'percent' => $ch->percent,
            ];
            array_push($tmpChurches, $tmp);
        }
// pending return also for every church, how many:
    // - login (from 9am)
    // - click on "try to vote" ('something ready?')
    // - 
        return [
            'totals' => $counter,
            'churches' => $tmpChurches
        ];
            

        // return count($votes) > 0;

    }

}
