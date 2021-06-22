<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class UsersApiController extends Controller
{
    private function createPassword() {
        $pass = time().rand(1,100000);
        return substr($pass, -8);
    }

    private function getRole($id) {
        $arr_admins = array(1,10);
        return in_array($id, $arr_admins) ? 'admin' : 'user';
    }

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

    public function fromChurch($church) {
        $uuu = array();

        if ($church) {
            $users = DB::table('users')
                ->join('churches', 'users.church_id', '=', 'churches.id')
                ->select('users.id', 'users.ci', 'users.name', 'users.email', 'users.phone', 'users.password')
                ->where('churches.id', '=', $church)
                ->where('churches.active', '=', true)
                ->where('users.active', '=', true)
                ->get();

            foreach ($users as $user) {
                $tmp = [
                    'id' => $user->id,
                    'ci' => $user->ci,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'password' => $user->password,
                ];
                array_push($uuu, $tmp);
            }
                    
        }
        return $uuu;
    }

    public function signin() {
        request()->validate([
            'ci' => 'required',
            'code' => 'required',
        ]);
        $ci = request('ci');
        $cel = request('cel');
        // $email = request('email');
        $code = request('code');

        $users = DB::table('users')
            ->join('churches', 'users.church_id', '=', 'churches.id')
            ->select('users.id', 'users.ci', 'users.name', 'users.email', 'users.phone', 'churches.name as cname', 'churches.id as cid')
            ->where('users.ci', '=', $ci)
            ->where('users.password', '=', $code)
            ->where('users.phone', '=', $cel)
            // ->where('users.email', '=', $email)
            ->where('churches.active', '=', true)
            ->get();

        // response()->json($user);

        if (count($users)) {
            $firstUser = $users[0];
            $role = $this->getRole($firstUser->id);
            $returnUser = [
                'cid' => $firstUser->cid,
                'cname' => $firstUser->cname,
                'ci' => $firstUser->ci,
                'email' => $firstUser->email,
                'id' => $firstUser->id,
                'name' => $firstUser->name,
                'phone' => $firstUser->phone,
                'role' => $role
            ];

            // session(['cebuid' => md5($firstUser->cid . '-' . $firstUser->id . '-' . $code)]);
            // session(['user_id' => $firstUser->id]);
            Session::put('user_id', $firstUser->id);

            if($role === 'admin') {
                $returnUser['churches'] = $this->getChurches();
                $returnUser['idSession'] = Session::get('user_id');
            }

            /*
            -
            // accessing key in session
            $value = session('key');
            // Specifying a default value...
            $value = session('key', 'default');
            // Store a piece of data in the session...
            session(['key' => 'value']);
            */
            
        } else {
            $returnUser = [];
        }


        return $returnUser;

        /*
        $firstUser = $users[0];
        if($firstUser->id <= 5) {
            $firstUser['role'] = 'admin';
        } else {
            $firstUser['role'] = 'user';
        }
        return $firstUser;

        return $users;
        */

        // return [
        //     'login' => 'ok',
        //     'ci' => $ci,
        //     'cel' => $cel,
        //     'email' => $email,
        //     'code' => $code,
        // ];

/*
        //-------------------- get all users
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            echo $user->name;
        }
        //-------------------- single row (first of a where)
        $user = DB::table('users')->where('name', 'John')->first();
        //-------------------- single field by where
        $email = DB::table('users')->where('name', 'John')->value('email');
        //-------------------- single row by id
        $user = DB::table('users')->find(3);
        //-------------------- get aggregate value 'count' (with where)
        $price = DB::table('orders')
                    ->where('finalized', 1)
                    ->count(); // originaly -----> ->avg('price')
        //-------------------- make raw select
        $users = DB::table('users')
            ->select('name', 'email as user_email')
            ->get();
        //-------------------- create/insert RAW sql
        $users = DB::table('users')
             ->select(DB::raw('count(*) as user_count, status'))
             ->where('status', '<>', 1)
             ->groupBy('status')
             ->get();
        //-------------------- basic INNER JOIN 
        $users = DB::table('users')
            ->join('contacts', 'users.id', '=', 'contacts.user_id')
            ->join('orders', 'users.id', '=', 'orders.user_id')
            ->select('users.*', 'contacts.phone', 'orders.price')
            ->get();        
        //-------------------- 
        //-------------------- 
*/
    }
}