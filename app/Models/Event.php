<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;


    protected $fillable = [
        'title', 'description', 'date', 'time', 'location', 'category', 
        'max_attendees', 'cover_image_uri', 'community_id', 'attendee_count', 'gallery_images'
    ];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function attendees()
    {
        return $this->belongsToMany(User::class, 'event_attendees', 'event_id', 'user_id');
    }

    public function ratings()
    {
        return $this->hasMany(EventRating::class);
    }
}
