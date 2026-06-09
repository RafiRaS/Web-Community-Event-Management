<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $androidPath = 'C:/berkas_kuliah_semester4/PAB/Proyek/CommunityEventManagement/app/src/main/assets/data/';

        // 1. Seed Users and Organizers
        $usersJson = json_decode(file_get_contents($androidPath . 'users.json'), true);
        foreach ($usersJson as $u) {
            DB::table('users')->insert([
                'id' => $u['id'],
                'name' => $u['name'],
                'email' => $u['email'] ?? ($u['id'] . '@example.com'),
                'password' => Hash::make($u['password'] ?: 'password'),
                'bio' => $u['bio'] ?? null,
                'avatar_uri' => $u['avatar_uri'] ?? null,
                'role' => $u['role'] ?? 'user',
                'is_blocked' => $u['is_blocked'] ?? false,
                'is_trusted' => $u['is_trusted'] ?? false,
                'trusted_application_status' => $u['trusted_application_status'] ?? null,
            ]);

            if (isset($u['organizer']) && $u['organizer']) {
                DB::table('organizers')->insert([
                    'user_id' => $u['id'],
                    'community_name' => $u['organizer']['community_name'] ?? null,
                    'person_in_charge' => $u['organizer']['person_in_charge'] ?? null,
                    'description' => $u['organizer']['description'] ?? null,
                    'phone' => $u['organizer']['phone'] ?? null,
                ]);
            }
        }

        // 2. Seed Communities
        $communitiesJson = json_decode(file_get_contents($androidPath . 'communities.json'), true);
        foreach ($communitiesJson as $c) {
            DB::table('communities')->insert([
                'id' => $c['id'],
                'name' => $c['name'],
                'description' => $c['description'] ?? null,
                'category' => $c['category'] ?? null,
                'cover_image_uri' => $c['cover_image_uri'] ?? null,
                'organizer_id' => $c['organizer_id'] ?? null,
                'organizer_name' => $c['organizer_name'] ?? null,
                'member_count' => $c['member_count'] ?? 0,
            ]);

            // Seed Community Members
            if (isset($c['member_ids'])) {
                foreach ($c['member_ids'] as $memberId) {
                    // Check if user exists before adding member
                    if (DB::table('users')->where('id', $memberId)->exists()) {
                        DB::table('community_members')->insert([
                            'community_id' => $c['id'],
                            'user_id' => $memberId
                        ]);
                    }
                }
            }

            // Seed Events
            if (isset($c['events'])) {
                foreach ($c['events'] as $e) {
                    DB::table('events')->insert([
                        'id' => $e['id'],
                        'title' => $e['title'],
                        'description' => $e['description'] ?? null,
                        'date' => $e['date'] ?? null,
                        'time' => $e['time'] ?? null,
                        'location' => $e['location'] ?? null,
                        'category' => $e['category'] ?? null,
                        'max_attendees' => $e['max_attendees'] ?? 0,
                        'cover_image_uri' => $e['cover_image_uri'] ?? null,
                        'community_id' => $c['id'],
                        'attendee_count' => $e['attendee_count'] ?? 0,
                        'gallery_images' => isset($e['gallery_images']) ? json_encode($e['gallery_images']) : null,
                    ]);

                    // Attendees
                    if (isset($e['registered_user_ids'])) {
                        foreach ($e['registered_user_ids'] as $attendeeId) {
                            if (DB::table('users')->where('id', $attendeeId)->exists()) {
                                DB::table('event_attendees')->insert([
                                    'event_id' => $e['id'],
                                    'user_id' => $attendeeId
                                ]);
                            }
                        }
                    }

                    // Ratings
                    if (isset($e['ratings'])) {
                        foreach ($e['ratings'] as $r) {
                            if (DB::table('users')->where('id', $r['user_id'])->exists()) {
                                DB::table('event_ratings')->insert([
                                    'event_id' => $e['id'],
                                    'user_id' => $r['user_id'],
                                    'user_name' => $r['user_name'] ?? null,
                                    'score' => $r['score'] ?? 0,
                                    'comment' => $r['comment'] ?? null,
                                    'date' => $r['date'] ?? null
                                ]);
                            }
                        }
                    }
                }
            }
        }

        // 3. Seed Forum Messages
        if (file_exists($androidPath . 'forum_messages.json')) {
            $forumJson = json_decode(file_get_contents($androidPath . 'forum_messages.json'), true);
            foreach ($forumJson as $f) {
                $user = DB::table('users')->where('name', $f['sender'])->first();
                $senderId = $user ? $user->id : DB::table('users')->first()->id;

                DB::table('forum_messages')->insert([
                    'id' => $f['id'] ?? (string) Str::uuid(),
                    'community_id' => $f['community_id'],
                    'sender_id' => $senderId,
                    'sender' => $f['sender'] ?? null,
                    'message' => $f['message'] ?? '',
                    'time' => isset($f['time']) ? date('Y-m-d H:i:s', strtotime($f['time'])) : null,
                    'avatar_initials' => $f['avatar_initials'] ?? null
                ]);
            }
        }

        // 4. Seed Trusted Applications
        if (file_exists($androidPath . 'trusted_applications.json')) {
            $appsJson = json_decode(file_get_contents($androidPath . 'trusted_applications.json'), true);
            foreach ($appsJson as $app) {
                if (DB::table('users')->where('id', $app['user_id'])->exists()) {
                    DB::table('trusted_applications')->insert([
                        'id' => $app['id'] ?? (string) Str::uuid(),
                        'user_id' => $app['user_id'],
                        'user_name' => $app['user_name'] ?? 'Unknown',
                        'community_name' => $app['community_name'] ?? 'Unknown',
                        'reason' => $app['reason'] ?? '',
                        'experience' => $app['experience'] ?? '',
                        'status' => $app['status'] ?? 'PENDING',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
