import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

const CATEGORIES = [
    "Technology",
    "Sports & Fitness",
    "Arts & Culture",
    "Music & Audio",
    "Gaming",
    "Education",
    "Business & Finance",
    "Health & Wellness",
    "Food & Drink",
    "Travel & Outdoor",
    "Other"
];

export default function Create({ communities }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        community_id: communities?.length > 0 ? communities[0].id : '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        max_attendees: 100,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('events.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Create Event</h2>}
        >
            <Head title="Create Event" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {communities?.length === 0 ? (
                            <div className="text-center py-8">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Communities Found</h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">You must create a community before you can host events.</p>
                                <a href={route('communities.create')} className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700">
                                    Create Community First
                                </a>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Event Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="community_id" value="Select Community" />
                                    <select
                                        id="community_id"
                                        name="community_id"
                                        value={data.community_id}
                                        onChange={(e) => setData('community_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        required
                                    >
                                        {communities.map((community) => (
                                            <option key={community.id} value={community.id}>
                                                {community.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.community_id} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="category" value="Category" />
                                        <input
                                            list="category-options"
                                            id="category"
                                            name="category"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            placeholder="Select or type a category..."
                                            required
                                        />
                                        <datalist id="category-options">
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat} />
                                            ))}
                                        </datalist>
                                        <InputError message={errors.category} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="max_attendees" value="Max Attendees" />
                                        <TextInput
                                            id="max_attendees"
                                            type="number"
                                            name="max_attendees"
                                            value={data.max_attendees}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('max_attendees', e.target.value)}
                                            required
                                            min="1"
                                        />
                                        <InputError message={errors.max_attendees} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="date" value="Date" />
                                        <TextInput
                                            id="date"
                                            type="date"
                                            name="date"
                                            value={data.date}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('date', e.target.value)}
                                            required
                                            min={new Date().toLocaleDateString('en-CA')}
                                        />
                                        <InputError message={errors.date} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="time" value="Time" />
                                        <TextInput
                                            id="time"
                                            type="time"
                                            name="time"
                                            value={data.time}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('time', e.target.value)}
                                            required
                                            min={data.date === new Date().toLocaleDateString('en-CA') ? new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : undefined}
                                        />
                                        <InputError message={errors.time} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="location" value="Location" />
                                    <TextInput
                                        id="location"
                                        type="text"
                                        name="location"
                                        value={data.location}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('location', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.location} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        rows="4"
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Create Event
                                    </PrimaryButton>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
