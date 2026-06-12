import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ recentEvents, topCommunities }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">

                    {/* Welcome Section */}
                    {auth.user && (
                        <div className="bg-white dark:bg-gray-800 p-6 shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center space-x-4">
                                {auth.user.avatar_uri ? (
                                    <img src={auth.user.avatar_uri} alt="Avatar" className="w-16 h-16 rounded-full object-cover shadow" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-2xl shadow">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                                        Welcome, {auth.user.name}!
                                        {auth.user.is_trusted === 1 && (
                                            <svg className="ml-2 w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">You are logged in as <span className="font-semibold">{auth.user.role}</span>.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Top Communities Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Top Communities</h3>
                            <Link href={route('communities.index')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">View All &rarr;</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {topCommunities?.map(community => (
                                <Link href={route('communities.show', community.id)} key={community.id} className="group block overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition">
                                    {community.cover_image_uri && community.cover_image_uri.startsWith('/storage') ? (
                                        <div className="h-32 w-full relative">
                                            <img src={community.cover_image_uri} alt={community.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="h-32 w-full bg-indigo-100 relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-80 group-hover:opacity-100 transition"></div>
                                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">{community.name.substring(0,2).toUpperCase()}</div>
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{community.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{community.category}</p>
                                        <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
                                            <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
                                            {community.member_count} Members
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Events Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 shadow-sm sm:rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Upcoming Events</h3>
                            <Link href={route('events.index')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">View All &rarr;</Link>
                        </div>
                        {recentEvents?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {recentEvents.map(event => (
                                    <Link href={route('events.show', event.id)} key={event.id} className="group block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition">
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{event.title}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{event.description}</p>
                                            <div className="mt-4 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                {event.date} • {event.time}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">No upcoming events found.</p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
