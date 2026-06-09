import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Community Event Management" />
            <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
                {/* Navbar */}
                <nav className="w-full bg-white dark:bg-gray-800 shadow-sm py-4 px-6 md:px-12 flex justify-between items-center transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            CommunityEvents
                        </span>
                    </div>
                    <div>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-2">
                                Dashboard
                            </Link>
                        ) : (
                            <div className="space-x-4">
                                <Link href={route('login')} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-full shadow hover:bg-indigo-700 transition">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white">
                        Discover & Join <br /> <span className="text-indigo-600 dark:text-indigo-400">Amazing Communities</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed">
                        The easiest way to find, manage, and attend local events. Join our platform to connect with organizers and like-minded people.
                    </p>
                    <div className="flex space-x-4">
                        <Link href={route('register')} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition transform duration-200">
                            Get Started
                        </Link>
                        <a href="#features" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-1 transition transform duration-200">
                            Learn More
                        </a>
                    </div>
                </main>

                {/* Features / Showcase */}
                <section id="features" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
                    <div className="max-w-7xl mx-auto px-6 sm:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="text-center p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 hover:shadow-xl transition duration-300">
                                <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 dark:text-white">Explore Communities</h3>
                                <p className="text-gray-600 dark:text-gray-400">Find communities that match your hobbies, career, and lifestyle.</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 hover:shadow-xl transition duration-300">
                                <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 dark:text-white">Attend Events</h3>
                                <p className="text-gray-600 dark:text-gray-400">Never miss out on exciting local gatherings, workshops, and webinars.</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 hover:shadow-xl transition duration-300">
                                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 dark:text-white">Connect & Network</h3>
                                <p className="text-gray-600 dark:text-gray-400">Meet incredible people, grow your network, and share experiences.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Footer */}
                <footer className="bg-gray-900 text-gray-400 py-12 text-center">
                    <p>&copy; 2026 Community Event Management. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
