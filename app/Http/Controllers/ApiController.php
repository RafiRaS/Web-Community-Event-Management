<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Community;
use App\Models\Event;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function getCurrentUser(Request $request)
    {
        // For testing, just return the first user or mock
        $user = User::first();
        if (!$user) {
            return response()->json(['message' => 'No user found'], 404);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'bio' => $user->bio,
            'avatar_uri' => $user->avatar_uri,
            'role' => $user->role,
            'is_blocked' => (bool)$user->is_blocked,
            'is_trusted' => (bool)$user->is_trusted,
            'trusted_application_status' => $user->trusted_application_status,
            'organizer' => null // Implement relationship later
        ]);
    }

    public function getCommunities()
    {
        $communities = Community::all()->map(function($community) {
            return [
                'id' => $community->id,
                'name' => $community->name,
                'description' => $community->description,
                'category' => $community->category,
                'cover_image_uri' => $community->cover_image_uri,
                'organizer_id' => $community->organizer_id,
                'organizer_name' => $community->organizer_name,
                'member_count' => $community->member_count,
                'member_ids' => [], // Implement relationships
                'events' => [] 
            ];
        });

        return response()->json($communities);
    }

    public function getEvents()
    {
        $events = Event::all()->map(function($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'date' => $event->date,
                'time' => $event->time,
                'location' => $event->location,
                'category' => $event->category,
                'max_attendees' => $event->max_attendees,
                'cover_image_uri' => $event->cover_image_uri,
                'community_id' => $event->community_id,
                'registered_user_ids' => [],
                'gallery_images' => $event->gallery_images,
                'ratings' => [],
                'attendee_count' => $event->attendee_count
            ];
        });

        return response()->json($events);
    }
}
