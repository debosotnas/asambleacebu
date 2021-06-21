<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // $table->string('name');
        // $table->integer('members');
        // $table->boolean('active');

        $id_c_1 = DB::table('churches')->insertGetId([
            'name' => Str::random(10),
            'members' => 3,
            'active' => true,
        ]);        
        $id_c_2 = DB::table('churches')->insertGetId([
            'name' => Str::random(10),
            'members' => 5,
            'active' => true,
        ]);        
        $id_c_3 = DB::table('churches')->insertGetId([
            'name' => Str::random(10),
            'members' => 5,
            'active' => true,
        ]);        

//------- Churches

        DB::table('users')->insert([
            'church_id' => $id_c_1,
            'ci' => '11111111',
            'name' => Str::random(10). ' '. Str::random(10),
            'email' => '111@gmail.com',
            'phone' => '091111111',
            'password' => '111',
            'active' => true,
        ]);
        DB::table('users')->insert([
            'church_id' => $id_c_1,
            'ci' => '22222222',
            'name' => Str::random(10). ' '. Str::random(10),
            'email' => '222@gmail.com',
            'phone' => '092222222',
            'password' => '222',
            'active' => true,
        ]);
        DB::table('users')->insert([
            'church_id' => $id_c_1,
            'ci' => '33333333',
            'name' => Str::random(10). ' '. Str::random(10),
            'email' => '333@gmail.com',
            'phone' => '093333333',
            'password' => '333',
            'active' => true,
        ]);

        DB::table('users')->insert([
            'church_id' => $id_c_2,
            'ci' => '44444444',
            'name' => Str::random(10). ' '. Str::random(10),
            'email' => '444@gmail.com',
            'phone' => '094444444',
            'password' => '444',
            'active' => true,
        ]);
        DB::table('users')->insert([
            'church_id' => $id_c_2,
            'ci' => '55555555',
            'name' => Str::random(10). ' '. Str::random(10),
            'email' => '555@gmail.com',
            'phone' => '095555555',
            'password' => '555',
            'active' => true,
        ]);
        DB::table('users')->insert([
            'church_id' => $id_c_2,
            'ci' => '66666666',
            'name' => Str::random(10). ' '. Str::random(10),
            'email' => '666@gmail.com',
            'phone' => '096666666',
            'password' => '666',
            'active' => true,
        ]);
        DB::table('users')->insert([
            'church_id' => $id_c_2,
            'ci' => '77777777',
            'name' => Str::random(10). ' '. Str::random(10),
            'email' => '777@gmail.com',
            'phone' => '097777777',
            'password' => '777',
            'active' => true,
        ]);
        DB::table('users')->insert([
            'church_id' => $id_c_2,
            'ci' => '88888888',
            'name' => Str::random(10). ' '. Str::random(10),
            'email' => '888@gmail.com',
            'phone' => '098888888',
            'password' => '888',
            'active' => true,
        ]);
        DB::table('users')->insert([
            'church_id' => $id_c_3,
            'ci' => '99999999',
            'name' => Str::random(10). ' '. Str::random(10),
            'email' => '999@gmail.com',
            'phone' => '099999999',
            'password' => '999',
            'active' => true,
        ]);
        DB::table('users')->insert([
            'church_id' => $id_c_3,
            'ci' => '123',
            'name' => Str::random(10). ' '. Str::random(10),
            'email' => 'asdf@gmail.com',
            'phone' => '123',
            'password' => '123',
            'active' => true,
        ]);

        // DB::table('users')->insert([
        //     'church_id' => $id_c_1,
        //     'ci' => '22222222',
        //     'name' => Str::random(10). ' '. Str::random(10),
        //     'email' => Str::random(10).'@gmail.com',
        //     'phone' => '123-1234-2345',
        //     'password' => Hash::make('password'),
        //     'active' => true,
        // ]);        
    }
}
