import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Forum({ community, messages, auth }) {
    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const submit = (e) => {
        e.preventDefault();
        post(route('forum.store', community.id), {
            onSuccess: () => reset('message'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link href={route('communities.show', community.id)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        &larr; Back
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {community.name} - Group Chat
                    </h2>
                </div>
            }
        >
            <Head title={`Group Chat - ${community.name}`} />
            <div className="py-8 mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col h-[70vh]">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900 rounded-t-2xl">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                No messages yet. Be the first to say hi!
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMe = msg.sender_id === auth.user.id;
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">{msg.sender}</span>
                                        <div className={`px-4 py-2 max-w-[75%] rounded-2xl ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
                                            {msg.message}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 rounded-b-2xl">
                        <form onSubmit={submit} className="flex space-x-4">
                            <input
                                type="text"
                                className="flex-1 rounded-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                                placeholder="Type your message..."
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                required
                            />
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
