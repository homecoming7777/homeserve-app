<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'provider_id',
        'category_id',
        'area_id',
        'title',
        'description',
        'image_url',
        'price',
        'latitude',
        'longitude',
        'slot_duration_minutes',
        'is_available',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'latitude' => 'float',
        'longitude' => 'float',
        'slot_duration_minutes' => 'integer',
        'is_available' => 'boolean',
    ];

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function availabilityRules()
    {
        return $this->hasMany(ServiceAvailabilityRule::class)->orderBy('day_of_week');
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'service_favorites', 'service_id', 'client_id');
    }
}

