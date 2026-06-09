<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\TrustedApplication;
use App\Models\Organizer;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $createdCommunities = [];
        $createdEvents = [];
        if ($user->role === 'organizer' || $user->role === 'admin') {
            $createdCommunities = \App\Models\Community::where('organizer_id', $user->id)->get();
            $createdEvents = \App\Models\Event::whereHas('community', function($q) use ($user) {
                $q->where('organizer_id', $user->id);
            })->get();
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'joinedCommunities' => $user->joinedCommunities()->get(),
            'joinedEvents' => $user->joinedEvents()->get(),
            'createdCommunities' => $createdCommunities,
            'createdEvents' => $createdEvents,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Show the form for applying to be a Trusted Organizer.
     */
    public function applyTrustedForm(Request $request): Response
    {
        return Inertia::render('Profile/TrustedApply', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Handle the submission of the Trusted Organizer application.
     */
    public function submitTrustedApplication(Request $request): RedirectResponse
    {
        $request->validate([
            'community_name' => 'required|string|max:255',
            'reason' => 'required|string',
            'experience' => 'required|string',
        ]);

        $user = $request->user();

        // Prevent duplicate pending applications
        $existing = TrustedApplication::where('user_id', $user->id)
                                        ->where('status', 'PENDING')
                                        ->first();
        if ($existing) {
            return Redirect::route('profile.edit')->with('status', 'You already have a pending application.');
        }

        TrustedApplication::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'user_name' => $user->name,
            'community_name' => $request->community_name,
            'reason' => $request->reason,
            'experience' => $request->experience,
            'status' => 'PENDING',
        ]);

        $user->trusted_application_status = 'PENDING';
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Application submitted successfully.');
    }

    /**
     * Show the form for applying to be an Organizer.
     */
    public function applyOrganizerForm(Request $request): Response
    {
        return Inertia::render('Profile/OrganizerApply', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Handle the submission of the Organizer application.
     */
    public function submitOrganizerApplication(Request $request): RedirectResponse
    {
        $request->validate([
            'community_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
        ]);

        $user = $request->user();

        // Check if already an organizer
        if ($user->role === 'organizer') {
            return Redirect::route('profile.edit')->with('status', 'You are already an Organizer.');
        }

        // Create Organizer profile
        Organizer::updateOrCreate(
            ['user_id' => $user->id],
            [
                'community_name' => $request->community_name,
                'phone' => $request->phone,
                'person_in_charge' => $user->name,
            ]
        );

        // Update user role
        $user->role = 'organizer';
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'You are now an Organizer!');
    }
}
