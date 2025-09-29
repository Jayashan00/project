import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

const DestinationFilter = ({ filters, onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ['Beach', 'Cultural', 'Adventure', 'Nature', 'Historical', 'Wildlife'];
  const regions = ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Central', 'Uva', 'Sabaragamuwa'];
  const budgetOptions = ['Budget', 'Moderate', 'Luxury'];
  const seasonOptions = ['Year-round', 'December-April', 'May-September', 'October-January'];
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name DESC', label: 'Name (Z-A)' },
    { value: 'avg_rating DESC', label: 'Highest Rated' },
    { value: 'review_count DESC', label: 'Most Reviews' },
    { value: 'created_at DESC', label: 'Newest First' }
  ];

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      region: '',
      budget: '',
      minRating: '',
      best_season: '',
      search: '',
      sortBy: 'name',
      order: 'ASC',
      page: 1
    });
  };

  const hasActiveFilters = filters.category || filters.region || filters.budget ||
                          filters.minRating || filters.best_season || filters.search;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search destinations..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
            hasActiveFilters
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Filter size={18} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {/* Sort Dropdown */}
        <select
          value={`${filters.sortBy} ${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split(' ');
            handleChange('sortBy', sortBy);
            handleChange('order', order || 'ASC');
          }}
          className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="block w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Region
              </label>
              <select
                value={filters.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className="block w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Budget Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget
              </label>
              <select
                value={filters.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                className="block w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Budget</option>
                {budgetOptions.map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </div>

            {/* Season Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Best Season
              </label>
              <select
                value={filters.best_season}
                onChange={(e) => handleChange('best_season', e.target.value)}
                className="block w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Season</option>
                {seasonOptions.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => handleChange('minRating', e.target.value)}
                className="block w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <X size={16} className="mr-1" />
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationFilter;