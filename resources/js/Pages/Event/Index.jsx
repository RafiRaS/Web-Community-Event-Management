import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Index({ events, categories, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [category, setCategory] = useState(filters?.category || '');
    const [time, setTime] = useState(filters?.time || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            router.get(route('events.index'), { search, category, time }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, category, time]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('events.index'), { search, category, time }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Events
                    </h2>
                    {(auth.user?.role === 'organizer' || auth.user?.role === 'admin') && (
                        <Link href={route('events.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold text-sm transition">
                            + Create Event
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Events" />
            <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
                    <form onSubmit={handleSearch} className="w-full md:w-2/3 relative">
                        <input 
                            type="text" 
                            placeholder="Search events by title, description, category, or location..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <button type="submit" className="hidden">Search</button>
                    </form>

                    <div className="w-full md:w-1/3 flex gap-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-1/2 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Categories</option>
                            {categories?.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-1/2 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Time</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past / Completed</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events?.map(event => (
                        <Link href={route('events.show', event.id)} key={event.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition flex flex-col">
                            <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                                <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-400 shadow">
                                    {event.category}
                                </div>
                                {event.is_past && (
                                    <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                                        Completed
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-2">{event.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">{event.description}</p>
                                <div className="space-y-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {event.date} • {event.time}
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {event.location}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{event.attendee_count} Attendees</span>
                                    {event.community && <span className="text-xs text-gray-500 dark:text-gray-400">By {event.community.name}</span>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
