<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'client_id',
        'service_id',
        'provider_id',
        'booking_date',
        'address',
        'status',
        'payment_method',
        'payment_status',
        'payment_id',
        'paid_at',
        'completed_at',
    ];

    protected $casts = [
        'booking_date' => 'datetime',
        'paid_at' => 'datetime',
        'completed_at' => 'datetime',
    ];
}
