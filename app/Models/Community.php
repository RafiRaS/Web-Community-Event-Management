<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    use HasFactory;


    protected $fillable = [
        'name', 'description', 'category', 'cover_image_uri', 'organizer_id', 'organizer_name', 'member_count'
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'community_members', 'community_id', 'user_id');
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function forumMessages()
    {
        return $this->hasMany(ForumMessage::class);
    }
}
