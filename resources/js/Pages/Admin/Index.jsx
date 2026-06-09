import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function AdminIndex({ auth, users, pendingApplications }) {
    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddAdmin, setShowAddAdmin] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleBlock = (userId) => {
        if (confirm("Are you sure you want to toggle block status for this user?")) {
            router.post(route('admin.users.block', userId));
        }
    };

    const handleApprove = (appId) => {
        router.post(route('admin.applications.approve', appId));
    };

    const handleReject = (appId) => {
        router.post(route('admin.applications.reject', appId));
    };

    const submitAddAdmin = (e) => {
        e.preventDefault();
        post(route('admin.admins.add'), {
            onSuccess: () => {
                setShowAddAdmin(false);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Panel</h2>}
        >
            <Head title="Admin Panel" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        
                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex">
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                        activeTab === 'users'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Users
                                </button>
                                <button
                                    onClick={() => setActiveTab('applications')}
                                    className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                        activeTab === 'applications'
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Trusted Applications
                                </button>
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {activeTab === 'users' ? (
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <input 
                                            type="text" 
                                            placeholder="Search user or organizer..." 
                                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-1/2"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button 
                                            onClick={() => setShowAddAdmin(true)}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                        >
                                            Add Admin
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {filteredUsers.map(user => (
                                            <div key={user.id} className="border p-4 rounded-md flex justify-between items-center shadow-sm">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.email} ({user.role})</p>
                                                        {user.is_blocked && <span className="text-xs font-bold text-red-500">BLOCKED</span>}
                                                    </div>
                                                </div>
                                                {user.role !== 'ADMIN' && (
                                                    <button 
                                                        onClick={() => handleToggleBlock(user.id)}
                                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                                            user.is_blocked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {user.is_blocked ? 'Unblock' : 'Block'}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {filteredUsers.length === 0 && <p className="text-gray-500 text-center py-4">No users found.</p>}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {pendingApplications.length === 0 ? (
                                        <p className="text-center text-gray-500 py-12">No Pending Applications</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {pendingApplications.map(app => (
                                                <div key={app.id} className="border p-4 rounded-md shadow-sm">
                                                    <h3 className="font-bold text-lg">{app.user_name}</h3>
                                                    <p className="text-sm text-indigo-600 font-medium mb-2">Community: {app.community_name}</p>
                                                    
                                                    <div className="mb-2">
                                                        <span className="font-semibold text-xs text-gray-500 uppercase">Reason</span>
                                                        <p className="text-sm text-gray-700">{app.reason}</p>
                                                    </div>
                                                    
                                                    <div className="mb-4">
                                                        <span className="font-semibold text-xs text-gray-500 uppercase">Experience</span>
                                                        <p className="text-sm text-gray-700">{app.experience}</p>
                                                    </div>

                                                    <div className="flex space-x-4">
                                                        <button 
                                                            onClick={() => handleReject(app.id)}
                                                            className="flex-1 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 font-medium"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button 
                                                            onClick={() => handleApprove(app.id)}
                                                            className="flex-1 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                                                        >
                                                            Approve
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showAddAdmin} onClose={() => setShowAddAdmin(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Admin</h2>
                    <form onSubmit={submitAddAdmin}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                type="email" 
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={() => setShowAddAdmin(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Admin</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
