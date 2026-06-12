<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TrustedApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function index()
    {
        $role = strtoupper(auth()->user()->role);
        if ($role !== 'ADMIN' && $role !== 'SUPER_ADMIN') {
            abort(403);
        }

        $users = User::all();
        $pendingApplications = TrustedApplication::where('status', 'PENDING')->get();

        return Inertia::render('Admin/Index', [
            'users' => $users,
            'pendingApplications' => $pendingApplications
        ]);
    }

    public function toggleBlock(User $user)
    {
        $role = strtoupper(auth()->user()->role);
        if ($role !== 'ADMIN' && $role !== 'SUPER_ADMIN') abort(403);
        if (strtoupper($user->role) === 'ADMIN' || strtoupper($user->role) === 'SUPER_ADMIN') {
            return back()->with('error', 'Cannot block an admin');
        }

        $user->is_blocked = !$user->is_blocked;
        $user->save();

        return back()->with('message', 'User block status toggled');
    }

    public function approveApplication(TrustedApplication $application)
    {
        $role = strtoupper(auth()->user()->role);
        if ($role !== 'ADMIN' && $role !== 'SUPER_ADMIN') abort(403);

        $application->status = 'APPROVED';
        $application->save();

        $user = $application->user;
        $user->is_trusted = true;
        $user->trusted_application_status = 'APPROVED';
        $user->save();

        return back()->with('message', 'Application approved');
    }

    public function rejectApplication(TrustedApplication $application)
    {
        $role = strtoupper(auth()->user()->role);
        if ($role !== 'ADMIN' && $role !== 'SUPER_ADMIN') abort(403);

        $application->status = 'REJECTED';
        $application->save();

        $user = $application->user;
        $user->is_trusted = false;
        $user->trusted_application_status = 'REJECTED';
        $user->save();

        return back()->with('message', 'Application rejected');
    }

    public function addAdmin(Request $request)
    {
        if (strtoupper(auth()->user()->role) !== 'SUPER_ADMIN') abort(403);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = new User();
        $user->id = 'user_' . time();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'ADMIN';
        $user->save();

        return back()->with('message', 'Admin added successfully');
    }
}
