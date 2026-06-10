<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with('community');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->has('category') && $request->category != '') {
            $query->where('category', $request->category);
        }

        $events = $query->get();

        if ($request->has('time') && in_array($request->time, ['upcoming', 'past'])) {
            $isPast = $request->time === 'past';
            $events = $events->filter(function($event) use ($isPast) {
                return $event->is_past === $isPast;
            })->values();
        }

        $categories = Event::select('category')->distinct()->pluck('category')->filter()->values();

        return Inertia::render('Event/Index', [
            'events' => $events,
            'categories' => $categories,
            'filters' => $request->only('search', 'category', 'time')
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
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('events', 'public');
            $event->cover_image_uri = '/storage/' . $path;
        }

        $event->save();

        return redirect()->route('events.show', $event->id)->with('message', 'Event created successfully!');
    }

    public function edit(Event $event)
    {
        $event->load('community');
        if (auth()->id() !== $event->community->organizer_id && auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $communities = Community::where('organizer_id', auth()->id())->get();

        return Inertia::render('Event/Edit', [
            'event' => $event,
            'communities' => $communities
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $event->load('community');
        if (auth()->id() !== $event->community->organizer_id && auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'community_id' => 'required|exists:communities,id',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'required|string',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'max_attendees' => 'required|integer|min:1',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // If community changes, check ownership
        if ($request->community_id != $event->community_id) {
            $community = Community::where('id', $request->community_id)
                ->where('organizer_id', auth()->id())
                ->first();

            if (!$community && auth()->user()->role !== 'admin') {
                abort(403, 'You can only assign events to your own communities.');
            }
        }

        $event->title = $request->title;
        $event->community_id = $request->community_id;
        $event->description = $request->description;
        $event->date = $request->date;
        $event->time = $request->time;
        $event->location = $request->location;
        $event->category = $request->category;
        $event->max_attendees = $request->max_attendees;

        if ($request->hasFile('cover_image')) {
            if ($event->cover_image_uri) {
                $oldPath = str_replace('/storage/', '', $event->cover_image_uri);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $path = $request->file('cover_image')->store('events', 'public');
            $event->cover_image_uri = '/storage/' . $path;
        }

        $event->save();

        return redirect()->route('events.show', $event->id)->with('message', 'Event updated successfully!');
    }

    public function show(Event $event)
    {
        $event->load(['community', 'attendees', 'ratings']);
        
        $isCommunityMember = false;
        if (auth()->check()) {
            $isCommunityMember = $event->community->members()->where('user_id', auth()->id())->exists();
        }

        return Inertia::render('Event/Show', [
            'event' => $event,
            'isRegistered' => auth()->check() ? $event->attendees->contains(auth()->id()) : false,
            'isCommunityMember' => $isCommunityMember
        ]);
    }

    public function register(Event $event)
    {
        if ($event->is_past) {
            return back()->with('error', 'Cannot register for a past event.');
        }

        if (!$event->community->members()->where('user_id', auth()->id())->exists()) {
            return redirect()->route('communities.show', $event->community_id)
                ->with('error', 'You must join the community before registering for this event.');
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
