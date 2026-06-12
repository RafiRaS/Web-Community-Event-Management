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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: '',
        description: '',
        cover_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('communities.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition" aria-label="Go Back">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Create Community
                    </h2>
                </div>
            }
        >
            <Head title="Create Community" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Community Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

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

                            <div>
                                <InputLabel htmlFor="cover_image" value="Cover Image (Optional)" />
                                <input
                                    id="cover_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('cover_image', e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/50 dark:file:text-indigo-400 dark:hover:file:bg-indigo-900/70"
                                />
                                <InputError message={errors.cover_image} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Create Community
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
