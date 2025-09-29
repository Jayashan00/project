import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Sun, Wind, Droplets } from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/destinations/${id}`);
        setDestination(response.data);

        // Fetch weather after destination data is loaded
        if (response.data.coordinates) {
          fetchWeather(response.data.coordinates);
        }
      } catch (error) {
        console.error('Error fetching destination:', error);
        toast.error('Could not load destination details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchWeather = async (coordinates) => {
        try {
            setWeatherLoading(true);
            const response = await api.get(`/destinations/${id}/weather`);
            setWeather(response);
        } catch (error) {
            console.error('Error fetching weather:', error);
            // Do not show a toast for this, it's a non-critical feature
        } finally {
            setWeatherLoading(false);
        }
    };

    if (id) {
        fetchDestination();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8 animate-pulse">
        <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Destination not found
        </h1>
        <Link to="/destinations" className="text-blue-600 dark:text-blue-400 hover:underline">
          Back to destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Image Header */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={destination.primaryImage || 'https://placehold.co/1200x400'}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-6 left-6 text-white p-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-2"
          >
            {destination.name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <span className="flex items-center">
              <MapPin size={16} className="mr-2" />
              {destination.location}, {destination.region}
            </span>
            <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
              {destination.category}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                About {destination.name}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </motion.div>

             {/* Gallery */}
            {destination.images && destination.images.length > 1 && (
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                 >
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {destination.images.map((image, index) => (
                            <div key={index} className="overflow-hidden rounded-lg aspect-w-1 aspect-h-1">
                                <img src={image.url} alt={`${destination.name} gallery image ${index + 1}`} className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300" />
                            </div>
                        ))}
                    </div>
                 </motion.div>
             )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Current Weather
              </h3>
              {weatherLoading ? (
                 <div className="flex items-center animate-pulse">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                    <div className="ml-4 space-y-2">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                 </div>
              ) : weather ? (
                <div className="flex items-center">
                  <img
                    src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    className="w-16 h-16"
                  />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(weather.main.temp)}°C
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 capitalize">
                      {weather.weather[0].description}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex space-x-2 mt-1">
                       <span><Droplets size={14} className="inline"/> {weather.main.humidity}%</span>
                       <span><Wind size={14} className="inline"/> {weather.wind.speed} m/s</span>
                    </div>
                  </div>
                </div>
              ) : <p className="text-gray-500 dark:text-gray-400">Weather data not available.</p>}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;