<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organizer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'community_name', 'person_in_charge', 'description', 'phone'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
