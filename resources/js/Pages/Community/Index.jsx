import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ communities }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Communities
                    </h2>
                    {(auth.user?.role === 'organizer' || auth.user?.role === 'admin') && (
                        <Link href={route('communities.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold text-sm transition">
                            + Create Community
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Communities" />
            <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {communities?.map(community => (
                        <Link href={route('communities.show', community.id)} key={community.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition">
                            <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">{community.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{community.description}</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-2 py-1 rounded-md">{community.category}</span>
                                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
                                        {community.members_count}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
