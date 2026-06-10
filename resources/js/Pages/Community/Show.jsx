import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Show({ community, isJoined }) {
    const { post } = useForm();
    const { auth } = usePage().props;
    const isOrganizer = auth.user && auth.user.id === community.organizer_id;

    // Reload data when navigating back via browser history
    useEffect(() => {
        const handlePopState = () => {
            router.reload({ only: ['isJoined', 'community'] });
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const toggleJoin = () => {
        if (isJoined) {
            post(route('communities.leave', community.id));
        } else {
            post(route('communities.join', community.id));
        }
    };

    const openForum = (e) => {
        e.preventDefault();
        if (!isJoined) {
            alert('You must join the community before opening the group chat.');
            return;
        }
        router.visit(route('forum.show', community.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition" aria-label="Go Back">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center">
                            {community.name}
                            {!!community.organizer?.is_trusted && (
                                <svg className="w-6 h-6 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" title="Trusted Organizer">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </h2>
                    </div>
                    <div className="space-x-3">
                        {isOrganizer && (
                            <Link href={route('communities.edit', community.id)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition">
                                Edit Community
                            </Link>
                        )}
                        <button onClick={openForum} className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-lg shadow-sm hover:bg-purple-200 transition">
                            Open Group Chat
                        </button>
                        <button 
                            onClick={toggleJoin}
                            className={`px-4 py-2 font-bold rounded-lg shadow-sm transition ${isJoined ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            {isJoined ? 'Leave Community' : 'Join Community'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={community.name} />
            <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                
                <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {community.cover_image_uri && community.cover_image_uri.startsWith('/storage') ? (
                        <img src={community.cover_image_uri} alt={community.name} className="w-full h-64 object-cover" />
                    ) : (
                        <div className="w-full h-64 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    )}
                    <div className="p-8">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-semibold rounded-full text-sm mb-3">
                                {community.category}
                            </span>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                            {community.name}
                            {!!community.organizer?.is_trusted && (
                                <svg className="w-8 h-8 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" title="Trusted Organizer">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{community.description}</p>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 font-medium">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
                        {community.member_count} Members • Organizer: {community.organizer_name}
                    </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 shadow-sm sm:rounded-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Events by this Community</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {community.events?.map(event => (
                            <Link href={route('events.show', event.id)} key={event.id} className="block p-5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-md transition">
                                <h4 className="font-bold text-lg dark:text-gray-100 mb-2">{event.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{event.date} • {event.location}</p>
                                {event.is_past ? (
                                    <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Event Completed</span>
                                ) : (
                                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">View Details &rarr;</span>
                                )}
                            </Link>
                        ))}
                        {community.events?.length === 0 && <p className="text-gray-500 dark:text-gray-400">No events found.</p>}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
