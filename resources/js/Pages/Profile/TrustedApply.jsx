import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function TrustedApply({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        community_name: '',
        reason: '',
        experience: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.apply-trusted.submit'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-4">
                    <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition" aria-label="Go Back">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </button>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Apply for Trusted Organizer</h2>
                </div>
            }
        >
            <Head title="Apply for Trusted Organizer" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 max-w-2xl">
                            
                            <h3 className="text-lg font-medium mb-4">Trusted Organizer Application</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Submit your details to become a Trusted Organizer. Admin will review your application.
                            </p>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="community_name" value="Community Name" />
                                    <TextInput
                                        id="community_name"
                                        className="mt-1 block w-full"
                                        value={data.community_name}
                                        onChange={(e) => setData('community_name', e.target.value)}
                                        required
                                        isFocused
                                    />
                                    <InputError className="mt-2" message={errors.community_name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="reason" value="Reason to Apply" />
                                    <textarea
                                        id="reason"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows="4"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        required
                                    ></textarea>
                                    <InputError className="mt-2" message={errors.reason} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="experience" value="Relevant Experience" />
                                    <textarea
                                        id="experience"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows="4"
                                        value={data.experience}
                                        onChange={(e) => setData('experience', e.target.value)}
                                        required
                                    ></textarea>
                                    <InputError className="mt-2" message={errors.experience} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Submit Application</PrimaryButton>
                                    <Link
                                        href={route('profile.edit')}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 underline"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
