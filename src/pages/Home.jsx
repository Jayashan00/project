import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, 
    MapPin, 
    Star, 
    Users, 
    Award,
    Shield,
    Globe,
    TrendingUp,
    PlayCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import api from '../api/client';

// Local assets
import heroAncient from "../assets/ancient.jpg";
import heroBeach from "../assets/beach.jpg";
import heroTea from "../assets/tea.jpg";
import heroSigiriya from "../assets/sigiriya.jpg";

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        location: 'United Kingdom',
        text: 'An absolutely incredible experience! The cultural heritage sites are breathtaking and our guide was phenomenal.',
        rating: 5,
        image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
    },
    {
        id: 2,
        name: 'Michael Chen',
        location: 'Australia',
        text: 'The wildlife safari exceeded all expectations. Seeing leopards in their natural habitat was unforgettable!',
        rating: 5,
        image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    {
        id: 3,
        name: 'Emma Rodriguez',
        location: 'Spain',
        text: 'Perfect blend of adventure and relaxation. The beaches are pristine and the local food is amazing.',
        rating: 5,
        image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg'
    }
];

const stats = [
    { number: '50,000+', label: 'Happy Travelers', icon: Users },
    { number: '200+', label: 'Destinations', icon: MapPin },
    { number: '15+', label: 'Years Experience', icon: Award },
    { number: '4.9/5', label: 'Customer Rating', icon: Star }
];

const Home = () => {
    const [heroImages] = useState([heroAncient, heroBeach, heroTea, heroSigiriya]);
    const [featuredDestinations, setFeaturedDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentHeroImage, setCurrentHeroImage] = useState(0);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/destinations/featured');
                // *** FIX IMPLEMENTED HERE ***
                // The API returns an object { data: [...] }, so we need to access the .data property.
                // We also check if the response is an array before setting the state.
                if (Array.isArray(response.data.data)) {
                    setFeaturedDestinations(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch featured destinations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroImages.length]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const nextHeroImage = () => {
        setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    };

    const prevHeroImage = () => {
        setCurrentHeroImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentHeroImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroImages[currentHeroImage]})` }}
                    />
                </AnimatePresence>
                
                <div className="absolute inset-0 bg-black/40" />
                
                <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        Discover
                        <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Sri Lanka
                        </span>
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl mb-8 text-gray-200"
                    >
                        The Pearl of the Indian Ocean awaits your exploration
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link
                            to="/destinations"
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <span>Start Your Journey</span>
                            <ArrowRight size={20} />
                        </Link>
                        
                        <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center space-x-2">
                            <PlayCircle size={20} />
                            <span>Watch Video</span>
                        </button>
                    </motion.div>
                </div>

                <button
                    onClick={prevHeroImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                
                <button
                    onClick={nextHeroImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
                >
                    <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentHeroImage(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                currentHeroImage === index ? 'bg-white' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full mb-4">
                                    <stat.icon size={28} />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Destinations */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Featured Destinations
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Explore our most popular destinations that showcase the best of Sri Lanka's natural beauty and cultural heritage
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* *** SAFETY CHECK IMPLEMENTED HERE *** */}
                        {/* This check ensures .map is only called if featuredDestinations is an array */}
                        {Array.isArray(featuredDestinations) && featuredDestinations.map((destination, index) => (
                            <motion.div
                                key={destination._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={destination.primaryImage || "https://placehold.co/600x400/000000/FFFFFF?text=Sri+Lanka"}
                                        alt={destination.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <button className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors">
                                            <Heart size={16} className="text-gray-600" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 left-3">
                                        <span className="px-2 py-1 bg-cyan-500 text-white text-xs font-semibold rounded-full">
                                            {destination.category}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
                                    <div className="flex items-center text-gray-600 mb-3">
                                        <MapPin size={16} className="mr-1" />
                                        <span className="text-sm">{destination.location}</span>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-1">
                                            <Star size={16} className="text-yellow-400 fill-current" />
                                            <span className="text-sm font-semibold">{destination.ratings.average.toFixed(1)}</span>
                                        </div>
                                        <div className="text-2xl font-bold text-cyan-600">${destination.entryFee.foreign}</div>
                                    </div>
                                    
                                    <Link
                                        to={`/destinations/${destination._id}`}
                                        className="block w-full text-center py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
                                    >
                                        Explore Now
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/destinations"
                            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <span>View All Destinations</span>
                            <ArrowRight size={20} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Why Choose Us
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We provide exceptional travel experiences with personalized service and local expertise
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: 'Safe & Secure',
                                description: 'Your safety is our top priority. We ensure secure bookings and safe travel experiences throughout your journey.'
                            },
                            {
                                icon: Globe,
                                title: 'Local Expertise',
                                description: 'Our local guides provide authentic insights and hidden gems that you won\'t find in guidebooks.'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Best Value',
                                description: 'Get the most value for your money with our competitive prices and exclusive deals on accommodations and tours.'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-colors group"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Travelers Say
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Don't just take our word for it - hear from thousands of satisfied travelers
                        </p>
                    </motion.div>

                    <div className="relative max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTestimonial}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-2xl p-8 shadow-xl text-center"
                            >
                                <img
                                    src={testimonials[currentTestimonial].image}
                                    alt={testimonials[currentTestimonial].name}
                                    className="w-20 h-20 rounded-full object-cover mx-auto mb-6 border-4 border-cyan-500"
                                />
                                
                                <div className="flex justify-center mb-4">
                                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                        <Star key={i} size={24} className="text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                
                                <p className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                                    "{testimonials[currentTestimonial].text}"
                                </p>
                                
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                                    <p className="text-gray-600">{testimonials[currentTestimonial].location}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-center mt-8 space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        currentTestimonial === index ? 'bg-cyan-500' : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready for Your Sri Lankan Adventure?
                        </h2>
                        <p className="text-xl mb-8 max-w-3xl mx-auto text-cyan-100">
                            Join thousands of travelers who have discovered the magic of Sri Lanka with us. Your perfect vacation is just a click away.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/subscription"
                                className="px-8 py-4 bg-white text-cyan-600 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                            >
                                <span>Get Started Today</span>
                                <ArrowRight size={20} />
                            </Link>
                            
                            <Link
                                to="/contact"
                                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-cyan-600 transition-all duration-300"
                            >
                                Talk to an Expert
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;

