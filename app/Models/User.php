<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $fillable = [
        'church_id', 'ci', 'name', 'email', 'phone', 'password', 'active', 'lastlogin', 'lastaction'
    ];    
}
