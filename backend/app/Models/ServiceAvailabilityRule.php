<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceAvailabilityRule extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'service_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}

