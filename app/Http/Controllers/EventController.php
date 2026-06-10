<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with('community')->get();
        return Inertia::render('Event/Index', [
            'events' => $events
        ]);
    }

    public function create()
    {
        if (auth()->user()->role !== 'organizer' && auth()->user()->role !== 'admin') {
            abort(403, 'Only organizers can create events.');
        }

        // Get communities owned by this organizer
        $communities = Community::where('organizer_id', auth()->id())->get();

        return Inertia::render('Event/Create', [
            'communities' => $communities
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'organizer' && auth()->user()->role !== 'admin') {
            abort(403, 'Only organizers can create events.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'community_id' => 'required|exists:communities,id',
            'description' => 'required|string',
            'date' => 'required|date|after_or_equal:today',
            'time' => [
                'required',
                'string',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->date === now()->toDateString()) {
                        if (strtotime($value) < strtotime(now()->toTimeString())) {
                            $fail('The time must be in the future if the event is today.');
                        }
                    }
                },
            ],
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'max_attendees' => 'required|integer|min:1',
        ]);

        // Ensure the selected community belongs to the organizer
        $community = Community::where('id', $request->community_id)
            ->where('organizer_id', auth()->id())
            ->first();

        if (!$community && auth()->user()->role !== 'admin') {
            abort(403, 'You can only create events for your own communities.');
        }

        $event = new Event();
        $event->title = $request->title;
        $event->community_id = $request->community_id;
        $event->description = $request->description;
        $event->date = $request->date;
        $event->time = $request->time;
        $event->location = $request->location;
        $event->category = $request->category;
        $event->max_attendees = $request->max_attendees;
        $event->attendee_count = 0;
        $event->save();

        return redirect()->route('events.show', $event->id)->with('message', 'Event created successfully!');
    }

    public function show(Event $event)
    {
        $event->load(['community', 'attendees', 'ratings']);
        return Inertia::render('Event/Show', [
            'event' => $event,
            'isRegistered' => auth()->check() ? $event->attendees->contains(auth()->id()) : false
        ]);
    }

    public function register(Event $event)
    {
        if ($event->is_past) {
            return back()->with('error', 'Cannot register for a past event.');
        }
        $event->attendees()->syncWithoutDetaching([auth()->id()]);
        $event->attendee_count = $event->attendees()->count();
        $event->save();
        return back()->with('message', 'Registered for event successfully');
    }

    public function unregister(Event $event)
    {
        if ($event->is_past) {
            return back()->with('error', 'Cannot unregister from a past event.');
        }
        $event->attendees()->detach(auth()->id());
        $event->attendee_count = $event->attendees()->count();
        $event->save();
        return back()->with('message', 'Unregistered from event successfully');
    }
}
