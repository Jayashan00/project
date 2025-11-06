import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Mail, Phone, MapPin, Send, Clock, MessageSquare, Leaf,
    Mountain, Waves, Calendar, User, Users, Plane, Star,
    Shield, Award, Heart, DollarSign
} from "lucide-react";
import toast from 'react-hot-toast';
import api from '../api/client';

// Featured tours data
const featuredTours = [
    {
        title: "Cultural Triangle",
        description: "Ancient cities and UNESCO World Heritage sites",
        image: "https://images.pexels.com/photos/5945716/pexels-photo-5945716.jpeg"
    },
    {
        title: "Wildlife Safari",
        description: "Yala and Udawalawe National Parks",
        image: "https://images.pexels.com/photos/33724002/pexels-photo-33724002.jpeg"
    },
    {
        title: "Tea Country Experience",
        description: "Scenic train rides through hill country",
        image: "https://images.pexels.com/photos/32414369/pexels-photo-32414369.jpeg"
    },
    {
        title: "Beach Paradise",
        description: "Pristine southern coast beaches",
        image: "https://images.pexels.com/photos/31613784/pexels-photo-31613784.jpeg"
    }
];

// Testimonials data
const testimonials = [
    {
        name: "Sarah & James",
        country: "Australia",
        text: "Our two-week tour of Sri Lanka was absolutely magical. The ancient sites, wildlife, and beautiful beaches exceeded all expectations.",
        rating: 5
    },
    {
        name: "Michael",
        country: "Germany",
        text: "The personalized itinerary created just for us was perfect. We experienced the true essence of Sri Lankan culture and natural beauty.",
        rating: 5
    },
    {
        name: "The Johnson Family",
        country: "UK",
        text: "Traveling with children can be challenging, but our guide made everything so easy. The kids loved the elephant safari!",
        rating: 4
    }
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        tourType: "",
        travelers: "",
        duration: "",
        budget: "",
        date: "",
        message: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post('/contact', formData);
            setIsSubmitted(true);
            toast.success(response.data.message || 'Your message has been sent successfully!');
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: "", email: "", tourType: "", travelers: "", duration: "", budget: "", date: "", message: "" });
            }, 4000);
        } catch (error) {
            console.error('Contact form error:', error);
            toast.error(error.response?.data?.error || 'Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-amber-100 via-green-50 to-blue-50 text-slate-800 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15"
                style={{ backgroundImage: `url(https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg)` }}
            ></div>

            {/* Animated elements */}
            <motion.div
                initial={{ y: -100, x: -100, rotate: 0 }}
                animate={{ y: 100, x: 100, rotate: 10 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 20, ease: "easeInOut" }}
                className="absolute w-64 h-64 bg-green-400/10 rounded-full blur-2xl top-[-50px] left-[-50px]"
            />
            <motion.div
                initial={{ y: 100, x: 100, rotate: 0 }}
                animate={{ y: -100, x: -100, rotate: -10 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 25, ease: "easeInOut" }}
                className="absolute w-64 h-64 bg-amber-400/10 rounded-full blur-2xl bottom-[-50px] right-[-50px]"
            />

            {/* Floating leaves */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: Math.random() * 100 - 50, x: Math.random() * 100 - 50, rotate: Math.random() * 360, opacity: 0 }}
                    animate={{
                        y: [null, Math.random() * 200 - 100, Math.random() * 300 - 150],
                        x: [null, Math.random() * 200 - 100, Math.random() * 300 - 150],
                        rotate: [null, Math.random() * 360, Math.random() * 720],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{ duration: Math.random() * 15 + 15, repeat: Infinity, delay: Math.random() * 5 }}
                    className="absolute text-green-600/30"
                    style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                >
                    <Leaf size={28} />
                </motion.div>
            ))}

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 max-w-4xl"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                        className="inline-flex items-center justify-center mb-6"
                    >
                        <div className="w-80 h-40 rounded-full overflow-hidden shadow-md bg-amber-50/60 flex items-center justify-center">
                            <iframe
                                src="https://my.spline.design/genkubgreetingrobot-g8kiWuyTijAqJy4DyGnvC5qQ/"
                                frameBorder="0"
                                width="130%"
                                height="170%"
                                className="pointer-events-auto rounded-full"
                                style={{ filter: "brightness(0.9)" }}
                            ></iframe>
                        </div>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">
                        Experience the Wonder of Sri Lanka
                    </h1>
                    <p className="text-lg text-slate-600 mb-8">
                        Let us craft your perfect journey through the pearl of the Indian Ocean
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm"><Award size={16} className="text-amber-600" /> <span className="text-sm">Award-Winning Tours</span></div>
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm"><Shield size={16} className="text-amber-600" /> <span className="text-sm">24/7 Support</span></div>
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm"><Heart size={16} className="text-amber-600" /> <span className="text-sm">Sustainable Tourism</span></div>
                    </div>
                </motion.div>

                <div className="w-full flex flex-col lg:flex-row gap-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="w-full lg:w-2/5 space-y-8"
                    >
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-green-800"><MessageSquare size={24} /> Plan Your Journey</h2>
                            <p className="text-slate-600 mb-8">Our travel experts are ready to craft your perfect Sri Lankan experience.</p>
                            <div className="grid grid-cols-2 gap-3">
                                <motion.a whileHover={{ scale: 1.05 }} href="tel:+94771234567" className="bg-amber-100 text-amber-700 p-3 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2"><Phone size={16} /> Call Now</motion.a>
                                <motion.a whileHover={{ scale: 1.05 }} href="mailto:travel@srilankatours.com" className="bg-green-100 text-green-700 p-3 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2"><Mail size={16} /> Email Us</motion.a>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white"><div className="p-3 bg-amber-100 rounded-lg"><Mail className="text-amber-600" size={20} /></div><div><h3 className="font-medium text-slate-800">Email Us</h3><p className="text-slate-600">travel@srilankatours.com</p></div></div>
                            <div className="flex items-start gap-4 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white"><div className="p-3 bg-amber-100 rounded-lg"><Phone className="text-amber-600" size={20} /></div><div><h3 className="font-medium text-slate-800">Call Us</h3><p className="text-slate-600">+94 77 123 4567</p></div></div>
                            <div className="flex items-start gap-4 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white"><div className="p-3 bg-amber-100 rounded-lg"><MapPin className="text-amber-600" size={20} /></div><div><h3 className="font-medium text-slate-800">Visit Us</h3><p className="text-slate-600">123 Galle Road, Colombo</p></div></div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="w-full lg:w-3/5"
                    >
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-amber-100 p-8 md:p-10">
                            {isSubmitted ? (
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 150 }} className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"><Leaf className="w-10 h-10 text-green-600" /></motion.div>
                                    <h3 className="text-2xl font-semibold mb-2 text-green-800">Request Received!</h3>
                                    <p className="text-slate-600 mb-6">Thank you! Our experts will contact you within 24 hours.</p>
                                </motion.div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-semibold mb-2 text-green-800">Customize Your Tour</h2>
                                    <p className="text-slate-600 mb-8">Tell us about your dream vacation.</p>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2"><User size={16} className="inline mr-1" /> Your Name *</label>
                                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full p-4 rounded-xl bg-amber-50/50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Your full name" />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2"><Mail size={16} className="inline mr-1" /> Email Address *</label>
                                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-4 rounded-xl bg-amber-50/50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="your@email.com" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="tourType" className="block text-sm font-medium text-slate-700 mb-2"><Mountain size={16} className="inline mr-1" /> Tour Type</label>
                                                <select id="tourType" name="tourType" value={formData.tourType} onChange={handleChange} className="w-full p-4 rounded-xl bg-amber-50/50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                                    <option value="">Select tour type</option>
                                                    <option value="cultural">Cultural & Heritage</option>
                                                    <option value="wildlife">Wildlife Safari</option>
                                                    <option value="beach">Beach Holiday</option>
                                                    <option value="adventure">Adventure & Trekking</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="travelers" className="block text-sm font-medium text-slate-700 mb-2"><Users size={16} className="inline mr-1" /> Number of Travelers</label>
                                                <select id="travelers" name="travelers" value={formData.travelers} onChange={handleChange} className="w-full p-4 rounded-xl bg-amber-50/50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                                    <option value="">Select number</option>
                                                    <option value="1">1 Person</option>
                                                    <option value="2">2 People</option>
                                                    <option value="3-4">3-4 People</option>
                                                    <option value="5+">5+ People</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2"><Clock size={16} className="inline mr-1" /> Duration</label>
                                                <select id="duration" name="duration" value={formData.duration} onChange={handleChange} className="w-full p-4 rounded-xl bg-amber-50/50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                                    <option value="">Select duration</option>
                                                    <option value="1-3 Days">1-3 Days</option>
                                                    <option value="4-7 Days">4-7 Days</option>
                                                    <option value="8-14 Days">8-14 Days</option>
                                                    <option value="15+ Days">15+ Days</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2"><DollarSign size={16} className="inline mr-1" /> Budget</label>
                                                <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className="w-full p-4 rounded-xl bg-amber-50/50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                                    <option value="">Select budget</option>
                                                    <option value="Budget">Budget Friendly</option>
                                                    <option value="Mid-range">Mid-range</option>
                                                    <option value="Luxury">Luxury</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Your Message *</label>
                                            <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full p-4 rounded-xl bg-amber-50/50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Tell us about your interests..."></textarea>
                                        </div>
                                        <motion.button whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(245, 158, 11, 0.3)" }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                                            {isLoading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Sending...</>) : (<><Send size={18} /> Plan My Adventure</>)}
                                        </motion.button>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

