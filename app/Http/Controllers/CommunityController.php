<?php

namespace App\Http\Controllers;

use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CommunityController extends Controller
{
    public function index()
    {
        $communities = Community::withCount('members')->get();
        return Inertia::render('Community/Index', [
            'communities' => $communities
        ]);
    }

    public function show(Community $community)
    {
        $community->load(['events', 'members']);
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
        ]);

        $community = new Community();
        $community->name = $request->name;
        $community->category = $request->category;
        $community->description = $request->description;
        $community->organizer_id = auth()->id();
        $community->organizer_name = auth()->user()->name;
        $community->member_count = 1; // Organizer joins by default
        $community->save();

        // Organizer is added as the first member
        $community->members()->attach(auth()->id());

        return redirect()->route('communities.show', $community->id)->with('message', 'Community created successfully!');
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
        $community->members()->detach(auth()->id());
        // Update member_count
        $community->member_count = $community->members()->count();
        $community->save();
        return back()->with('message', 'Left community successfully');
    }
}
