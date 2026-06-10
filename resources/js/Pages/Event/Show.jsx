import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ event, isRegistered }) {
    const { post } = useForm();

    const toggleRegister = () => {
        if (isRegistered) {
            post(route('events.unregister', event.id));
        } else {
            post(route('events.register', event.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition" aria-label="Go Back">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {event.title}
                        </h2>
                    </div>
                    {event.is_past ? (
                        <div className="px-6 py-2.5 font-bold rounded-lg shadow bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed text-center">
                            Event Completed
                        </div>
                    ) : (
                        <button 
                            onClick={toggleRegister}
                            className={`px-6 py-2.5 font-bold rounded-lg shadow transition ${isRegistered ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            {isRegistered ? 'Cancel Registration' : 'Register Now'}
                        </button>
                    )}
                </div>
            }
        >
            <Head title={event.title} />
            <div className="py-12 mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">
                
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="h-64 bg-gradient-to-r from-blue-600 to-indigo-700 w-full relative"></div>
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-semibold rounded-full text-sm mb-3">
                                    {event.category}
                                </span>
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">{event.title}</h1>
                                {event.community && (
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                                        Organized by <Link href={route('communities.show', event.community.id)} className="text-indigo-600 dark:text-indigo-400 hover:underline">{event.community.name}</Link>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-y border-gray-100 dark:border-gray-700 py-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Date & Time</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100">{event.date}</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{event.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Location</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100">{event.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Attendees</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100">{event.attendee_count} / {event.max_attendees || 'Unlimited'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">About this Event</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">{event.description}</p>
                        </div>
                    </div>
                </div>

                {/* Ratings */}
                <div className="bg-white dark:bg-gray-800 p-8 shadow-sm sm:rounded-2xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Reviews</h3>
                    {event.ratings?.length > 0 ? (
                        <div className="space-y-6">
                            {event.ratings.map(rating => (
                                <div key={rating.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{rating.user_name}</p>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < rating.score ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">{rating.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet for this event.</p>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
