<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'provider_id',
        'category',
        'area',
        'title',
        'description',
        'price',
        'is_available',
    ];

    protected $casts = [
        'price' => 'float',
        'is_available' => 'boolean',
    ];
}
