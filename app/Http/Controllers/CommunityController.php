<?php

namespace App\Http\Controllers;

use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CommunityController extends Controller
{
    public function index(Request $request)
    {
        $query = Community::withCount('members')->with('organizer:id,is_trusted');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->has('category') && $request->category != '') {
            $query->where('category', $request->category);
        }

        $communities = $query->get();
        $categories = Community::select('category')->distinct()->pluck('category')->filter()->values();

        return Inertia::render('Community/Index', [
            'communities' => $communities,
            'categories' => $categories,
            'filters' => $request->only('search', 'category')
        ]);
    }

    public function show(Community $community)
    {
        $community->load(['events', 'members', 'organizer:id,is_trusted']);
        return Inertia::render('Community/Show', [
            'community' => $community,
            'isJoined' => auth()->check() ? $community->members->contains(auth()->id()) : false
        ]);
    }

    public function create()
    {
        if (auth()->user()->role !== 'organizer' && auth()->user()->role !== 'admin') {
            abort(403, 'Only organizers can create communities.');
        }
        return Inertia::render('Community/Create');
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'organizer' && auth()->user()->role !== 'admin') {
            abort(403, 'Only organizers can create communities.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $community = new Community();
        $community->name = $request->name;
        $community->category = $request->category;
        $community->description = $request->description;
        $community->organizer_id = auth()->id();
        $community->organizer_name = auth()->user()->name;
        $community->member_count = 1; // Organizer joins by default

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('communities', 'public');
            $community->cover_image_uri = '/storage/' . $path;
        }

        $community->save();

        // Organizer is added as the first member
        $community->members()->attach(auth()->id());

        return redirect()->route('communities.show', $community->id)->with('message', 'Community created successfully!');
    }

    public function edit(Community $community)
    {
        if (auth()->id() !== $community->organizer_id && auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Community/Edit', [
            'community' => $community
        ]);
    }

    public function update(Request $request, Community $community)
    {
        if (auth()->id() !== $community->organizer_id && auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $community->name = $request->name;
        $community->category = $request->category;
        $community->description = $request->description;

        if ($request->hasFile('cover_image')) {
            // Delete old image if it exists
            if ($community->cover_image_uri) {
                $oldPath = str_replace('/storage/', '', $community->cover_image_uri);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('cover_image')->store('communities', 'public');
            $community->cover_image_uri = '/storage/' . $path;
        }

        $community->save();

        return redirect()->route('communities.show', $community->id)->with('message', 'Community updated successfully!');
    }

    public function join(Community $community)
    {
        $community->members()->syncWithoutDetaching([auth()->id()]);
        // Update member_count
        $community->member_count = $community->members()->count();
        $community->save();
        return back()->with('message', 'Joined community successfully');
    }

    public function leave(Community $community)
    {
        $userId = auth()->id();

        // Find events in this community that the user is attending and haven't passed yet
        $eventsToLeave = $community->events()->whereHas('attendees', function($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get()->filter(function($event) {
            return !$event->is_past;
        });

        // Unregister from those events
        foreach ($eventsToLeave as $event) {
            $event->attendees()->detach($userId);
            $event->attendee_count = $event->attendees()->count();
            $event->save();
        }

        $community->members()->detach($userId);
        // Update member_count
        $community->member_count = $community->members()->count();
        $community->save();
        
        return back()->with('message', 'Left community successfully');
    }
}
