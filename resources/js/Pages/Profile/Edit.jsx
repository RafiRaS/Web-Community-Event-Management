import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { usePage, Link } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status, joinedCommunities, joinedEvents, createdCommunities, createdEvents }) {
    const user = usePage().props.auth.user;
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {(user?.role === 'organizer' || user?.role === 'admin') && (
                        <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Organizer Dashboard</h2>
                            
                            <div className="mb-6">
                                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Communities You Manage</h3>
                                {createdCommunities?.length > 0 ? (
                                    <ul className="space-y-2">
                                        {createdCommunities.map(c => (
                                            <li key={c.id}>
                                                <Link href={route('communities.show', c.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                    {c.name}
                                                </Link>
                                                <span className="text-xs text-gray-500 ml-2">({c.member_count} members)</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">You haven't created any communities yet.</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Events You Host</h3>
                                {createdEvents?.length > 0 ? (
                                    <ul className="space-y-2">
                                        {createdEvents.map(e => (
                                            <li key={e.id}>
                                                <Link href={route('events.show', e.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                    {e.title}
                                                </Link>
                                                <span className="text-xs text-gray-500 ml-2">({e.date} at {e.time})</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">You haven't created any events yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">My Activity</h2>
                        
                        <div className="mb-6">
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Joined Communities</h3>
                            {joinedCommunities?.length > 0 ? (
                                <ul className="space-y-2">
                                    {joinedCommunities.map(c => (
                                        <li key={c.id}>
                                            <Link href={route('communities.show', c.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">You haven't joined any communities.</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Registered Events</h3>
                            {joinedEvents?.length > 0 ? (
                                <ul className="space-y-2">
                                    {joinedEvents.map(e => (
                                        <li key={e.id}>
                                            <Link href={route('events.show', e.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                {e.title}
                                            </Link>
                                            <span className="text-xs text-gray-500 ml-2">({e.date})</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">You haven't registered for any events.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {user?.role?.toUpperCase() === 'USER' && (
                        <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8">
                            <section className="max-w-xl">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Become an Organizer</h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Become an organizer to host events and create communities.
                                    </p>
                                </header>
                                
                                <div className="mt-6 flex items-center gap-4">
                                    <Link
                                        href={route('profile.apply-organizer.form')}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-900"
                                    >
                                        Apply for Organizer
                                    </Link>
                                </div>
                            </section>
                        </div>
                    )}

                    {user && user.role === 'organizer' && !user.is_trusted && (
                        <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8">
                            <section className="max-w-xl">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Trusted Organizer</h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Become a trusted organizer to host official events and create verified communities.
                                    </p>
                                </header>
                                
                                <div className="mt-6 flex items-center gap-4">
                                    {user.trusted_application_status === 'PENDING' ? (
                                        <div className="px-4 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-md text-sm font-medium border border-yellow-200 dark:border-yellow-700/50">
                                            Application Pending Review by Admin
                                        </div>
                                    ) : (
                                        <Link
                                            href={route('profile.apply-trusted.form')}
                                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-900"
                                        >
                                            Apply for Trusted Organizer
                                        </Link>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
