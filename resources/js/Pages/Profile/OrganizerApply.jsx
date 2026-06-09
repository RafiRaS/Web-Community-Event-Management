import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function OrganizerApply({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        community_name: '',
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.apply-organizer.submit'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Apply for Organizer</h2>}
        >
            <Head title="Apply for Organizer" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 max-w-2xl">
                            
                            <h3 className="text-lg font-medium mb-4">Organizer Application</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Submit your details to become an Organizer. This process is instant and requires no approval.
                            </p>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="community_name" value="Organization Name" />
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
                                    <InputLabel htmlFor="phone" value="Phone Number" />
                                    <TextInput
                                        id="phone"
                                        className="mt-1 block w-full"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.phone} />
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
