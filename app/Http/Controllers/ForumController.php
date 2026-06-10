<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\ForumMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ForumController extends Controller
{
    public function show(Community $community)
    {
        if (!auth()->check() || !$community->members()->where('user_id', auth()->id())->exists()) {
            return redirect()->route('communities.show', $community->id)
                ->with('error', 'You must join the community to view its group chat.');
        }

        $messages = $community->forumMessages()->with('senderUser')->orderBy('created_at', 'asc')->get();
        return Inertia::render('Forum/Index', [
            'community' => $community,
            'messages' => $messages
        ]);
    }

    public function store(Request $request, Community $community)
    {
        $request->validate(['message' => 'required|string|max:1000']);

        $community->forumMessages()->create([
            'sender_id' => auth()->id(),
            'sender' => auth()->user()->name,
            'message' => $request->message,
            'time' => now()
        ]);

        return back();
    }
}
