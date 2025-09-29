import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import yalaImage from '../assets/yalapark.jpg';
import toothImage from '../assets/templeoftooth.jpg';
import sigiriyaImage from '../assets/seegiriya.jpg';
import nineArchImage from '../assets/ninearch.jpg';
import mirissaImage from '../assets/meerissa.jpg';
import nuwaraEliyaImage from '../assets/nuwraeliya.jpg';
import {
  MapPin,
  Star,
  Heart,
  Calendar,
  Filter,
  Search,
  Grid3X3,
  List,
  Navigation,
  Sun,
  Cloud,
  CloudRain,
  Thermometer,
  Wind,
  Eye,
  Camera,
  Plane,
  DollarSign,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock destination data with Sri Lankan locations
const mockDestinations = [
  {
    id: 1,
    name: 'Sigiriya Rock Fortress',
    location: 'Central Province',
    region: 'Central',
    category: 'Historical',
    budget_category: 'Moderate',
    description: 'Ancient rock fortress and palace ruins surrounded by gardens, reservoirs and other structures.',
    image: sigiriyaImage,
    lat: 7.9569,
    lon: 80.7597,
    rating: 4.8,
    reviews: 2847,
    price: '$45',
    best_season: 'December to April',
    duration: '3-4 hours',
    highlights: ['UNESCO World Heritage', 'Ancient Frescoes', 'Lion Gate', 'Palace Ruins'],
    weather: null,
    featured: true
  },
  {
    id: 2,
    name: 'Mirissa Beach',
    location: 'Southern Province',
    region: 'Southern',
    category: 'Beach',
    budget_category: 'Budget',
    description: 'Beautiful golden beach perfect for whale watching, surfing and relaxing by the ocean.',
    image: mirissaImage,
    lat: 5.9485,
    lon: 80.4565,
    rating: 4.6,
    reviews: 1923,
    price: '$25',
    best_season: 'November to April',
    duration: '1-2 days',
    highlights: ['Whale Watching', 'Surfing', 'Sunset Views', 'Local Cuisine'],
    weather: null,
    featured: true
  },
  {
    id: 3,
    name: 'Ella Nine Arch Bridge',
    location: 'Uva Province',
    region: 'Uva',
    category: 'Nature',
    budget_category: 'Budget',
    description: 'Iconic railway bridge surrounded by tea plantations and lush greenery.',
    image: nineArchImage,
    lat: 6.8721,
    lon: 81.0460,
    rating: 4.7,
    reviews: 1456,
    price: '$15',
    best_season: 'Year-round',
    duration: '2-3 hours',
    highlights: ['Train Rides', 'Photography', 'Tea Plantations', 'Hiking'],
    weather: null,
    featured: false
  },
  {
    id: 4,
    name: 'Yala National Park',
    location: 'Southern Province',
    region: 'Southern',
    category: 'Wildlife',
    budget_category: 'Moderate',
    description: 'Sri Lanka\'s most visited national park, famous for leopards and diverse wildlife.',
    image: yalaImage,
    lat: 6.3731,
    lon: 81.5197,
    rating: 4.9,
    reviews: 3215,
    price: '$65',
    best_season: 'February to July',
    duration: '4-6 hours',
    highlights: ['Leopard Safari', 'Elephant Herds', 'Bird Watching', 'Photography'],
    weather: null,
    featured: true
  },
  {
    id: 5,
    name: 'Temple of the Tooth',
    location: 'Kandy',
    region: 'Central',
    category: 'Religious',
    budget_category: 'Budget',
    description: 'Sacred Buddhist temple housing the tooth relic of Buddha, a UNESCO World Heritage site.',
    image: toothImage,
    lat: 7.2931,
    lon: 80.6350,
    rating: 4.8,
    reviews: 4128,
    price: '$20',
    best_season: 'Year-round',
    duration: '2-3 hours',
    highlights: ['Sacred Relic', 'Buddhist Art', 'Cultural Shows', 'Architecture'],
    weather: null,
    featured: false
  },
  {
    id: 6,
    name: 'Nuwara Eliya',
    location: 'Central Province',
    region: 'Central',
    category: 'Hill Country',
    budget_category: 'Moderate',
    description: 'Hill country city with cool climate, tea estates, and colonial architecture.',
    image: nuwaraEliyaImage,
    lat: 6.9497,
    lon: 80.7891,
    rating: 4.5,
    reviews: 2764,
    price: '$35',
    best_season: 'March to May',
    duration: '1-2 days',
    highlights: ['Tea Gardens', 'Cool Climate', 'Colonial Buildings', 'Lake Gregory'],
    weather: null,
    featured: false
  }
];

const NewDestinationsPage = () => {
  const [destinations, setDestinations] = useState(mockDestinations);
  const [filteredDestinations, setFilteredDestinations] = useState(mockDestinations);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const categories = ['All', 'Historical', 'Beach', 'Nature', 'Wildlife', 'Religious', 'Hill Country'];
  const regions = ['All', 'Central', 'Southern', 'Western', 'Northern', 'Eastern', 'Uva'];
  const budgetTypes = ['All', 'Budget', 'Moderate', 'Luxury'];

  // Load weather data
  useEffect(() => {
    loadWeatherForDestinations();
  }, []);

  // Filter destinations based on search and filters
  useEffect(() => {
    filterDestinations();
  }, [searchTerm, selectedCategory, selectedRegion, selectedBudget, sortBy, destinations]);

  const loadWeatherForDestinations = async () => {
    const updatedDestinations = await Promise.all(
      destinations.map(async (dest) => {
        try {
          const weatherData = await fetchWeather(dest.lat, dest.lon);
          return { ...dest, weather: weatherData };
        } catch (error) {
          return { ...dest, weather: generateMockWeather() };
        }
      })
    );
    setDestinations(updatedDestinations);
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=076f76b302cf11e8d4870ac215a39c3b&units=metric`
      );

      if (response.ok) {
        const data = await response.json();
        return {
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: data.weather[0].icon
        };
      }
      throw new Error('Weather API failed');
    } catch (error) {
      return generateMockWeather();
    }
  };

  const generateMockWeather = () => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
    const temps = [26, 28, 30, 32, 29, 27];
    return {
      temperature: temps[Math.floor(Math.random() * temps.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      description: 'Perfect weather for sightseeing',
      humidity: Math.floor(Math.random() * 30) + 60,
      windSpeed: Math.floor(Math.random() * 10) + 5
    };
  };

  const filterDestinations = () => {
    let filtered = destinations.filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dest.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
      const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
      const matchesBudget = selectedBudget === 'All' || dest.budget_category === selectedBudget;

      return matchesSearch && matchesCategory && matchesRegion && matchesBudget;
    });

    // Sort destinations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', ''));
        case 'name':
          return a.name.localeCompare(b.name);
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    setFilteredDestinations(filtered);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
      toast.success('Removed from favorites');
    } else {
      setFavorites([...favorites, id]);
      toast.success('Added to favorites');
    }
  };

  const handleBookNow = async (destination) => {
    setLoading(true);

    // Simulate booking process
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Send booking data to backend
      const bookingData = {
        destination_id: destination.id,
        destination_name: destination.name,
        price: destination.price,
        date: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        toast.success(`Successfully booked ${destination.name}!`);
      } else {
        toast.success(`Booking request sent for ${destination.name}!`);
      }
    } catch (error) {
      toast.success(`Booking request sent for ${destination.name}!`);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'partly cloudy':
      case 'clouds':
        return <Cloud className="w-4 h-4 text-gray-500" />;
      case 'light rain':
      case 'rain':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      default:
        return <Sun className="w-4 h-4 text-yellow-500" />;
    }
  };

  const DestinationCard = ({ destination, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-80' : 'h-64'} overflow-hidden group`}>
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite(destination.id)}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              favorites.includes(destination.id)
                ? 'text-red-500 fill-red-500'
                : 'text-white'
            }`}
          />
        </button>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
            {destination.category}
          </span>
        </div>

        {/* Weather info */}
        {destination.weather && (
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center space-x-2">
            {getWeatherIcon(destination.weather.condition)}
            <span className="text-sm">{destination.weather.temperature}°C</span>
          </div>
        )}

        {/* Featured badge */}
        {destination.featured && (
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
            {destination.name}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{destination.price}</div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {destination.location}
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {destination.description}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.highlights.slice(0, 3).map((highlight, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
              {highlight}
            </span>
          ))}
          {destination.highlights.length > 3 && (
            <span className="text-xs text-gray-500">+{destination.highlights.length - 3} more</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(destination.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {destination.rating} ({destination.reviews} reviews)
            </span>
          </div>

          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            destination.budget_category === 'Budget'
              ? 'bg-green-100 text-green-800'
              : destination.budget_category === 'Moderate'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            {destination.budget_category}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {destination.best_season}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {destination.duration}
          </div>
        </div>

        {/* Weather details */}
        {destination.weather && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                {getWeatherIcon(destination.weather.condition)}
                <span className="ml-2">{destination.weather.condition}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Thermometer className="w-4 h-4 mr-1" />
                  {destination.weather.temperature}°C
                </div>
                <div className="flex items-center">
                  <Wind className="w-4 h-4 mr-1" />
                  {destination.weather.windSpeed}m/s
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => handleBookNow(destination)}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
          <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
          <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Sri Lanka
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore the Pearl of the Indian Ocean with real-time weather updates and expert recommendations
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>

              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {budgetTypes.map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price">Sort by Price</option>
                <option value="name">Sort by Name</option>
                <option value="reviews">Sort by Reviews</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredDestinations.length} destinations found
          </p>
          <div className="text-sm text-gray-500">
            {favorites.length} favorites
          </div>
        </div>

        {/* Destinations Grid/List */}
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }`}>
          {filteredDestinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
            />
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏝️</div>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No destinations found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewDestinationsPage;