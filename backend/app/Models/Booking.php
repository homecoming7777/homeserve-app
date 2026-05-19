<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'client_id',
        'service_id',
        'booking_date',
        'address',
        'status',
        'payment_method',
        'payment_status',
        'payment_id',
        'paid_at',
    ];

    protected $casts = [
        'booking_date' => 'datetime',
        'paid_at' => 'datetime',
        'provider_completed_at' => 'datetime',
        'client_approved_at' => 'datetime',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}

