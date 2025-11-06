import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, MessageSquare, TrendingUp,
  DollarSign, Settings, Eye, BarChart3,
  UserCheck, Activity
} from 'lucide-react';
import api from '../api/client';
import { toast } from 'react-hot-toast';

// Import admin components
import UsersTab from '../components/admin/UsersTab';
import ContactsTab from '../components/admin/ContactsTab';
import Analytics from '../components/admin/Analytics';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [userFilter, setUserFilter] = useState('all');
  const [contactFilter, setContactFilter] = useState('new');

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        toast.error('Failed to load users');
      }
    };

    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get('/admin/contacts');
        setContacts(response.data);
      } catch (error) {
        toast.error('Failed to load contacts');
      }
    };

    if (activeTab === 'contacts') {
      fetchContacts();
    }
  }, [activeTab]);

  // Handle contact response
  const handleContactResponse = async (contactId, response, status) => {
    try {
      await api.patch(`/admin/contacts/${contactId}`, { response, status });
      toast.success('Contact updated successfully');
      const newResponse = await api.get('/admin/contacts');
      setContacts(newResponse.data);
    } catch (error) {
      toast.error('Failed to update contact');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
              <div className="relative">
                <img
                  src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon={<Activity />}
            label="Overview"
          />
          <TabButton
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            icon={<Users />}
            label="Users"
          />
          <TabButton
            active={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
            icon={<Calendar />}
            label="Bookings"
          />
          <TabButton
            active={activeTab === 'contacts'}
            onClick={() => setActiveTab('contacts')}
            icon={<MessageSquare />}
            label="Contacts"
          />
          <TabButton
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            icon={<BarChart3 />}
            label="Analytics"
          />
        </div>

        {/* Content Area */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {activeTab === 'overview' && dashboardData && (
              <Overview data={dashboardData} />
            )}
            {activeTab === 'users' && (
              <UsersTab users={users} filter={userFilter} setFilter={setUserFilter} />
            )}
            {activeTab === 'contacts' && (
              <ContactsTab
                contacts={contacts}
                filter={contactFilter}
                setFilter={setContactFilter}
                onRespond={handleContactResponse}
              />
            )}
            {activeTab === 'analytics' && dashboardData && (
              <Analytics data={dashboardData.analytics} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Helper Components
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      active
        ? 'bg-blue-500 text-white'
        : 'bg-white text-gray-600 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  </div>
);

const Overview = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard
      title="Total Users"
      value={data.overview.totalUsers}
      icon={<Users className="text-blue-500" />}
      change="+12%"
    />
    <StatCard
      title="Total Bookings"
      value={data.overview.totalBookings}
      icon={<Calendar className="text-green-500" />}
      change="+8%"
    />
    <StatCard
      title="Revenue"
      value={`$${data.overview.totalRevenue.toLocaleString()}`}
      icon={<DollarSign className="text-yellow-500" />}
      change="+15%"
    />
    <StatCard
      title="Active Users"
      value={data.overview.activeUsers}
      icon={<UserCheck className="text-purple-500" />}
      change="+5%"
    />
  </div>
);

const StatCard = ({ title, value, icon, change }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
    </div>
    <div className="mt-4 flex items-center">
      <span className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </span>
      <span className="text-gray-400 text-sm ml-2">vs last month</span>
    </div>
  </div>
);

export default Admin;