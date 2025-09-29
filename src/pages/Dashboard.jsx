import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    DollarSign,
    MapPin,
    Heart,
    ArrowUp,
    Star,
    Bell,
    RefreshCw
} from 'lucide-react';
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import api from '../api/client';
import toast from 'react-hot-toast';

// --- Helper Components ---

const StatCard = ({ title, value, change, positive, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center">
            {positive && <ArrowUp size={16} className="text-green-500" />}
            <span className={`text-sm ml-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
                {change}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">from last period</span>
        </div>
    </motion.div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
);


// --- Main Dashboard Component ---

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // This API endpoint combines data from users, bookings, etc.
            const response = await api.get('/api/users/dashboard');
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
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    }

    // Safely access data with default fallbacks to prevent .map errors
    const stats = [
        { title: 'Total Bookings', value: dashboardData.overview?.totalBookings || 0, change: '+12%', positive: true, icon: Calendar, color: 'bg-blue-500' },
        { title: 'Total Spent', value: `$${(dashboardData.overview?.totalSpent || 0).toLocaleString()}`, change: '+8.2%', positive: true, icon: DollarSign, color: 'bg-green-500' },
        { title: 'Active Bookings', value: dashboardData.overview?.activeBookings || 0, change: '+3', positive: true, icon: MapPin, color: 'bg-purple-500' },
        { title: 'Favorites Added', value: dashboardData.favoriteDestinations?.length || 0, change: '+5', positive: true, icon: Heart, color: 'bg-red-500' }
    ];

    const recentBookings = dashboardData.recentBookings || [];
    const favoriteDestinations = dashboardData.favoriteDestinations || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Welcome back! 👋
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Here's your Sri Lankan adventure at a glance.
                        </p>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="p-2 mt-4 sm:mt-0 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        Refresh Data
                    </button>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} delay={index} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Bookings */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Bookings</h2>
                        <div className="space-y-4">
                            {/* *** THE FIX IS HERE *** */}
                            {/* We check if recentBookings is an array and has items before mapping */}
                            {Array.isArray(recentBookings) && recentBookings.length > 0 ? (
                                recentBookings.map((booking) => (
                                    <div key={booking._id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <img
                                            src={booking.destination?.primaryImage || 'https://placehold.co/100x100/000000/FFFFFF/png?text=SL'}
                                            alt={booking.destination?.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white">{booking.destination?.name || 'Unknown Destination'}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 dark:text-white">${booking.pricing?.totalAmount || 0}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">You have no recent bookings.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Favorites */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Your Favorites</h2>
                        <div className="space-y-4">
                            {/* We check if favoriteDestinations is an array and has items before mapping */}
                            {Array.isArray(favoriteDestinations) && favoriteDestinations.length > 0 ? (
                                favoriteDestinations.slice(0, 4).map((fav) => (
                                    <div key={fav._id} className="flex items-center space-x-4 group cursor-pointer">
                                        <img src={fav.primaryImage || 'https://placehold.co/100x100/000000/FFFFFF/png?text=SL'} alt={fav.name} className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-500">{fav.name}</h3>
                                            <div className="flex items-center">
                                                <Star size={14} className="text-yellow-400 fill-current mr-1" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{fav.ratings?.average || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">You haven't added any favorites yet.</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
