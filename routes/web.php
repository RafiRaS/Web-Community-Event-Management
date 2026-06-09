<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\Community;

Route::get('/', function () {
    $recentEvents = Event::latest()->take(3)->get();
    $topCommunities = Community::orderBy('member_count', 'desc')->take(3)->get();
    return Inertia::render('Dashboard', [
        'recentEvents' => $recentEvents,
        'topCommunities' => $topCommunities,
    ]);
})->name('dashboard');



Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/apply-trusted', [ProfileController::class, 'applyTrustedForm'])->name('profile.apply-trusted.form');
    Route::post('/profile/apply-trusted', [ProfileController::class, 'submitTrustedApplication'])->name('profile.apply-trusted.submit');

    Route::get('/profile/apply-organizer', [ProfileController::class, 'applyOrganizerForm'])->name('profile.apply-organizer.form');
    Route::post('/profile/apply-organizer', [ProfileController::class, 'submitOrganizerApplication'])->name('profile.apply-organizer.submit');

    // Authenticated Actions
    Route::get('/communities/create', [CommunityController::class, 'create'])->name('communities.create');
    Route::post('/communities', [CommunityController::class, 'store'])->name('communities.store');
    Route::post('/communities/{community}/join', [CommunityController::class, 'join'])->name('communities.join');
    Route::post('/communities/{community}/leave', [CommunityController::class, 'leave'])->name('communities.leave');

    Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::post('/events/{event}/register', [EventController::class, 'register'])->name('events.register');
    Route::post('/events/{event}/unregister', [EventController::class, 'unregister'])->name('events.unregister');

    // Forum
    Route::get('/communities/{community}/forum', [ForumController::class, 'show'])->name('forum.show');
    Route::post('/communities/{community}/forum', [ForumController::class, 'store'])->name('forum.store');

    // Admin Routes
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/admin/users/{user}/block', [AdminController::class, 'toggleBlock'])->name('admin.users.block');
    Route::post('/admin/applications/{application}/approve', [AdminController::class, 'approveApplication'])->name('admin.applications.approve');
    Route::post('/admin/applications/{application}/reject', [AdminController::class, 'rejectApplication'])->name('admin.applications.reject');
    Route::post('/admin/admins', [AdminController::class, 'addAdmin'])->name('admin.admins.add');
});

// Guest Community Routes
Route::get('/communities', [CommunityController::class, 'index'])->name('communities.index');
Route::get('/communities/{community}', [CommunityController::class, 'show'])->name('communities.show');

// Guest Event Routes
Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');

require __DIR__.'/auth.php';
