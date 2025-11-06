import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mountain, Waves } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// --- THE FIX IS HERE ---
// Importing local images instead of using URLs
import back1 from '../assets/back1.jpg';
import back2 from '../assets/back2.jpg';
import back3 from '../assets/back3.jpg';

const backgroundImages = [back1, back2, back3];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bgIndex, setBgIndex] = useState(0);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ email, password });
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background with transition */}
            {backgroundImages.map((img, index) => (
                <motion.div
                    key={index}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: index === bgIndex ? 1 : 0 }}
                    transition={{ duration: 1.5 }}
                />
            ))}
            <div className="absolute inset-0 bg-black/50" />

            {/* Animated Sri Lanka elements */}
            <motion.div className="absolute top-10 left-10 text-white/30" animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }} transition={{ duration: 3, repeat: Infinity }}><Leaf size={48} /></motion.div>
            <motion.div className="absolute bottom-20 right-20 text-white/30" animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}><Mountain size={64} /></motion.div>
            <motion.div className="absolute top-1/2 left-1/4 text-white/30" animate={{ x: [0, 10, 0], rotate: [0, 3, 0] }} transition={{ duration: 5, repeat: Infinity }}><Waves size={56} /></motion.div>

            {/* Login Form */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
            >
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-white mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-white mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white"
                            placeholder="********"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-3 rounded-lg font-bold disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>}
                        {loading ? 'Logging in...' : 'Login'}
                    </motion.button>
                </form>
                <p className="text-center text-white mt-4">
                    Don't have an account? <Link to="/register" className="text-cyan-300 hover:underline">Register</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
