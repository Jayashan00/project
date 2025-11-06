import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, DollarSign, MapPin, User, Edit, X,
    Mail, Phone, Globe, Save, RefreshCw, Star, Ticket, MessageSquare
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
    </div>
);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/dashboard');
            setDashboardData(response.data.data);
        } catch (error) {
            toast.error('Could not load dashboard data.');
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading || !dashboardData) {
        return <LoadingSpinner />;
    }

    const { profile, subscription, overview, recentBookings, recentContacts } = dashboardData;

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {profile?.firstName || profile?.username}! 👋
                        </h1>
                        <p className="text-gray-600 mt-1">Here's your travel dashboard at a glance.</p>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="p-2 mt-4 sm:mt-0 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-8">
                        <ProfileCard profile={profile} onEdit={() => setIsEditModalOpen(true)} />
                        <SubscriptionCard subscription={subscription} />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <OverviewStats overview={overview} />
                        <RecentBookings bookings={recentBookings} />
                        <RecentContacts contacts={recentContacts} />
                    </div>
                </div>
            </div>
            
            <AnimatePresence>
                {isEditModalOpen && (
                    <EditProfileModal
                        profile={profile}
                        onClose={() => setIsEditModalOpen(false)}
                        onUpdate={fetchData}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Child Components ---

const ProfileCard = ({ profile, onEdit }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-cyan-600">{profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{profile.firstName} {profile.lastName}</h2>
                    <p className="text-sm text-gray-500">@{profile.username}</p>
                </div>
            </div>
            <button onClick={onEdit} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Edit size={18} /></button>
        </div>
        <div className="mt-6 space-y-3 text-sm text-gray-600">
            <div className="flex items-center"><Mail size={16} className="mr-3 text-cyan-500" /> {profile.email}</div>
            <div className="flex items-center"><Phone size={16} className="mr-3 text-cyan-500" /> {profile.phone || 'Not provided'}</div>
            <div className="flex items-center"><Globe size={16} className="mr-3 text-cyan-500" /> {profile.country || 'Not provided'}</div>
        </div>
    </motion.div>
);

const SubscriptionCard = ({ subscription }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{delay: 0.1}} className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="font-bold text-lg mb-4 flex items-center"><Ticket size={20} className="mr-2 text-amber-500"/> My Subscription</h3>
        {subscription ? (
            <div>
                <p className="text-2xl font-bold text-amber-600 capitalize">{subscription.plan}</p>
                <p className="text-sm capitalize"><span className={`capitalize px-2 py-1 rounded-full text-xs ${subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{subscription.status}</span></p>
                <p className="text-xs text-gray-500 mt-2">Renews on: {new Date(subscription.endDate).toLocaleDateString()}</p>
            </div>
        ) : <p className="text-gray-500">No active subscription.</p>}
        <Link to="/subscription" className="mt-4 inline-block w-full text-center bg-amber-500 text-white font-semibold py-2 rounded-lg hover:bg-amber-600 transition">Manage Plan</Link>
    </motion.div>
);

const OverviewStats = ({ overview }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatItem icon={<Calendar />} value={overview.totalBookings} label="Total Bookings" color="blue" />
        <StatItem icon={<DollarSign />} value={`$${(overview.totalSpent || 0).toLocaleString()}`} label="Total Spent" color="green" />
        <StatItem icon={<MapPin />} value={overview.activeBookings} label="Active Trips" color="purple" />
    </motion.div>
);

const StatItem = ({ icon, value, label, color }) => (
    <div className={`bg-${color}-50 p-4 rounded-xl flex items-center space-x-4`}>
        <div className={`p-3 bg-${color}-100 text-${color}-600 rounded-full`}>{icon}</div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

const RecentBookings = ({ bookings }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.3}} className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="font-bold text-lg mb-4">Recent Bookings</h3>
        <div className="space-y-4">
            {bookings.length > 0 ? bookings.map(b => (
                <div key={b._id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <img src={b.destinationId?.images?.[0]?.url || 'https://placehold.co/100x100/0891b2/white?text=Trip'} alt={b.destinationId?.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                        <p className="font-semibold">{b.destinationId?.name}</p>
                        <p className="text-sm text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">${b.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span>
                    </div>
                </div>
            )) : <p className="text-gray-500 text-center py-4">No recent bookings found.</p>}
        </div>
    </motion.div>
);

const RecentContacts = ({ contacts }) => (
     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.4}} className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="font-bold text-lg mb-4 flex items-center"><MessageSquare size={20} className="mr-2 text-cyan-500"/> Recent Inquiries</h3>
        <div className="space-y-3">
            {contacts.length > 0 ? contacts.map(c => (
                 <div key={c._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-700">{c.tourType || 'General Inquiry'}</p>
                         <span className={`text-xs px-2 py-1 rounded-full capitalize ${c.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>{c.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.message}</p>
                     <p className="text-xs text-gray-400 mt-2">{new Date(c.createdAt).toLocaleString()}</p>
                 </div>
            )) : <p className="text-gray-500 text-center py-4">You haven't made any requesr.</p>}
        </div>
    </motion.div>
);

const EditProfileModal = ({ profile, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        country: profile.country || '',
        phone: profile.phone || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put('/users/profile', formData);
            toast.success('Profile updated successfully!');
            onUpdate(); // Refetch dashboard data
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                        <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <InputField label="Country" name="country" value={formData.country} onChange={handleChange} icon={<Globe size={18}/>} />
                    <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} icon={<Phone size={18}/>} />

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-2">
                            {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save size={16} />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const InputField = ({ label, name, value, onChange, icon = null }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className="relative">
            {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>}
            <input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${icon ? 'pl-10' : ''}`}
            />
        </div>
    </div>
);

export default Dashboard;

