<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ForumMessage extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'community_id', 'sender_id', 'sender', 'message', 'time', 'avatar_initials'
    ];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function senderUser()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
