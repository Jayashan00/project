import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Menu,
    X,
    Home,
    MapPin,
    Users, // For About Us
    MessageSquare, // For Contact
    Ticket, // For Subscriptions
    User,
    Shield,
    LogOut,
    Camera, // For Gallery
    BookOpen, // For Blog
    Star,
    Calendar, // For Planning
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <Star className="h-8 w-8 text-cyan-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">TravelLanka</span>
                        </Link>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <NavLink to="/" icon={Home} label="Home" />
                        <NavLink to="/destinations" icon={MapPin} label="Destinations" />
                        <NavLink to="/gallery" icon={Camera} label="Gallery" />
                        <NavLink to="/blog" icon={BookOpen} label="Blog" />
                        <NavLink to="/planning" icon={Calendar} label="Planning" />
                        <NavLink to="/about" icon={Users} label="About" />
                        <NavLink to="/subscription" icon={Ticket} label="Subscriptions" />
                        <NavLink to="/contact" icon={MessageSquare} label="Contact" />
                    </div>

                    {/* User Profile Section (Desktop) */}
                    <div className="hidden md:flex md:items-center">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-cyan-600 focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                                        {user.firstName ? (
                                            <span className="text-cyan-600 font-medium">
                                                {user.firstName.charAt(0)}
                                                {user.lastName?.charAt(0)}
                                            </span>
                                        ) : (
                                            <User className="w-5 h-5 text-cyan-600" />
                                        )}
                                    </div>
                                    <span className="font-medium">{user.firstName || user.username}</span>
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <User className="w-4 h-4 mr-3" />
                                            Dashboard
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <Shield className="w-4 h-4 mr-3" />
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-cyan-600 font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-cyan-600"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden py-4">
                        <div className="space-y-2">
                            <MobileNavLink to="/" icon={Home} label="Home" />
                            <MobileNavLink to="/destinations" icon={MapPin} label="Destinations" />
                            <MobileNavLink to="/gallery" icon={Camera} label="Gallery" />
                            <MobileNavLink to="/blog" icon={BookOpen} label="Blog" />
                            <MobileNavLink to="/planning" icon={Calendar} label="Planning" />
                            <MobileNavLink to="/about" icon={Users} label="About" />
                            <MobileNavLink to="/subscription" icon={Ticket} label="Subscriptions" />
                            <MobileNavLink to="/contact" icon={MessageSquare} label="Contact" />
                            
                            {user ? (
                                <>
                                    <MobileNavLink to="/dashboard" icon={User} label="Dashboard" />
                                    {user.role === 'admin' && (
                                        <MobileNavLink to="/admin" icon={Shield} label="Admin Panel" />
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-3 py-2 text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="pt-4 space-y-2 px-3">
                                    <Link
                                        to="/login"
                                        className="block text-center text-gray-700 hover:text-cyan-600 font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block text-center bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

const NavLink = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive ? 'text-cyan-600 bg-cyan-50' : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
            }`}
        >
            <Icon className="w-5 h-5 mr-2" />
            {label}
        </Link>
    );
};

const MobileNavLink = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                isActive ? 'text-cyan-600 bg-cyan-50' : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
            }`}
        >
            <Icon className="w-5 h-5 mr-3" />
            {label}
        </Link>
    );
};

export default Header;

