import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Heart, Calendar } from 'lucide-react';

const DestinationCard = ({ destination }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/destination/${destination.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={destination.image_url || '/placeholder-destination.jpg'}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
              {destination.category}
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <button className="p-1 bg-white rounded-full shadow-md">
              <Heart size={16} className="text-gray-600" />
            </button>
          </div>
          {destination.featured && (
            <div className="absolute top-12 left-3">
              <span className="px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">
                Featured
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/destination/${destination.id}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {destination.name}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <MapPin size={14} className="mr-1" />
          {destination.location}
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {destination.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(destination.avg_rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {destination.avg_rating ? destination.avg_rating.toFixed(1) : 'No ratings'}
            </span>
          </div>

          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            destination.budget_category === 'Budget'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : destination.budget_category === 'Moderate'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}>
            {destination.budget_category}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={14} className="mr-1" />
            Best time: {destination.best_season || 'Year-round'}
          </div>

          <Link
            to={`/destination/${destination.id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600 font-medium text-sm flex items-center"
          >
            Explore
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;