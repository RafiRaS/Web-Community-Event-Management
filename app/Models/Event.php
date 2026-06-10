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

    protected $appends = ['is_past'];

    public function getIsPastAttribute()
    {
        try {
            // Extract start time if it's a range like "10:00 - 15:00 WIB"
            $timeParts = explode('-', $this->time);
            $timeString = trim(str_replace(['WIB', 'WITA', 'WIT'], '', $timeParts[0]));
            
            // Format date appropriately
            $dateString = $this->date;
            
            // Check if it's the weird space-separated format (e.g. "10 1 2024" or "05 9 2024")
            if (preg_match('/^(\d{1,2})\s+(\d{1,2})\s+(\d{4})$/', trim($dateString), $matches)) {
                $dateString = $matches[3] . '-' . str_pad($matches[2], 2, '0', STR_PAD_LEFT) . '-' . str_pad($matches[1], 2, '0', STR_PAD_LEFT);
            }
            
            return \Carbon\Carbon::parse($dateString . ' ' . $timeString)->isPast();
        } catch (\Exception $e) {
            return false;
        }
    }

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
