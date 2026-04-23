<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'wallet_balance',
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'wallet_balance' => 'float',
        'email_verified_at' => 'datetime',
    ];
}
