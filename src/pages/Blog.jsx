import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  User,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Search,
  Filter,
  Tag,
  TrendingUp,
  Eye,
  BookOpen,
  ArrowRight,
  Star,
  MapPin
} from 'lucide-react';
import seegiriyaImg from '../assets/seegiriya.jpg';
import adventureImg from '../assets/adventure.jpg';
import cultureImg from '../assets/culture.jpg';
import backImg from '../assets/back.jpg';



const mockBlogPosts = [
  {
    id: 1,
    title: 'The Ultimate Guide to Exploring Sigiriya Rock Fortress',
    slug: 'ultimate-guide-sigiriya-rock-fortress',
    excerpt: 'Discover the ancient wonders of Sigiriya...',
    content: 'Full blog content here...',
    author: {
      name: 'Sarah Johnson',
      avatar: seegiriyaImg,  // 👈 local image for author avatar
      bio: 'Travel writer and Sri Lanka enthusiast'
    },
    category: 'destinations',
    tags: ['sigiriya', 'unesco', 'history', 'travel-tips'],
    featuredImage: seegiriyaImg,  // 👈 local featured image
    publishDate: '2024-12-15',
    readingTime: 8,
    views: 2450,
    likes: 189,
    comments: 23,
    featured: true,
    status: 'published'
  },
  {
    id: 2,
    title: 'Best Time to Visit Sri Lanka: A Seasonal Guide',
    slug: 'best-time-visit-sri-lanka-seasonal-guide',
    excerpt: 'Plan your perfect Sri Lankan adventure...',
    content: 'Full blog content here...',
    author: {
      name: 'Michael Chen',
      avatar: adventureImg,
      bio: 'Weather expert and travel consultant'
    },
    category: 'travel-tips',
    tags: ['weather', 'planning', 'seasons', 'festivals'],
    featuredImage: adventureImg,
    publishDate: '2024-12-12',
    readingTime: 6,
    views: 1890,
    likes: 156,
    comments: 18,
    featured: false,
    status: 'published'
  },
  {
    id: 3,
    title: 'Sri Lankan Cuisine: A Food Lover\'s Paradise',
    slug: 'sri-lankan-cuisine-food-lovers-paradise',
    excerpt: 'Embark on a culinary journey through Sri Lanka...',
    content: 'Full blog content here...',
    author: {
      name: 'Priya Patel',
      avatar: cultureImg,
      bio: 'Food blogger and culinary expert'
    },
    category: 'food',
    tags: ['cuisine', 'food', 'curry', 'local-dishes'],
    featuredImage: cultureImg,
    publishDate: '2024-12-10',
    readingTime: 10,
    views: 3200,
    likes: 245,
    comments: 34,
    featured: true,
    status: 'published'
  },
  {
    id: 5,
    title: 'Cultural Etiquette: Respecting Sri Lankan Traditions',
    slug: 'cultural-etiquette-sri-lankan-traditions',
    excerpt: 'Learn about Sri Lankan customs and traditions...',
    content: 'Full blog content here...',
    author: {
      name: 'Anjali Fernando',
      avatar: backImg,
      bio: 'Cultural anthropologist and local guide'
    },
    category: 'culture',
    tags: ['culture', 'etiquette', 'traditions', 'respect'],
    featuredImage: backImg,
    publishDate: '2024-12-05',
    readingTime: 5,
    views: 1420,
    likes: 98,
    comments: 15,
    featured: false,
    status: 'published'
  }
];


const categories = [
  { id: 'all', name: 'All Posts', count: 45 },
  { id: 'destinations', name: 'Destinations', count: 12 },
  { id: 'travel-tips', name: 'Travel Tips', count: 15 },
  { id: 'culture', name: 'Culture', count: 8 },
  { id: 'food', name: 'Food', count: 6 },
  { id: 'adventure', name: 'Adventure', count: 4 }
];

const popularTags = [
  'travel-tips', 'sigiriya', 'food', 'culture', 'wildlife', 'beaches', 
  'temples', 'photography', 'budget-travel', 'luxury', 'festivals', 'history'
];

const Blog = () => {
  const [posts, setPosts] = useState(mockBlogPosts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'liked':
          return b.likes - a.likes;
        case 'commented':
          return b.comments - a.comments;
        default:
          return new Date(b.publishDate) - new Date(a.publishDate);
      }
    });

  const featuredPosts = posts.filter(post => post.featured);

  const toggleLike = (postId) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    
    // Update post likes count
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, likes: likedPosts.includes(postId) ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `/blog/${post.slug}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Travel Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover insider tips, hidden gems, and inspiring stories from Sri Lanka's most beautiful destinations
          </p>
        </motion.div>

        {/* Featured Posts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Star className="mr-2 text-yellow-500" size={24} />
            Featured Stories
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-full">
                      Featured
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full capitalize">
                      {post.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle size={14} className="mr-1" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`p-2 rounded-full transition-colors ${
                          likedPosts.includes(post.id)
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                      >
                        <Heart size={16} className={likedPosts.includes(post.id) ? 'fill-current' : ''} />
                      </button>
                      <button
                        onClick={() => handleShare(post)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest Posts</option>
              <option value="popular">Most Popular</option>
              <option value="liked">Most Liked</option>
              <option value="commented">Most Commented</option>
            </select>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="relative h-48 md:h-full overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full capitalize">
                            {post.category.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span>{post.author.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{post.readingTime} min</span>
                          </div>
                        </div>
                        
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm flex items-center"
                        >
                          Read More
                          <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Eye size={14} className="mr-1" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle size={14} className="mr-1" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                              likedPosts.includes(post.id)
                                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                            }`}
                          >
                            <Heart size={14} className={likedPosts.includes(post.id) ? 'fill-current' : ''} />
                            <span>{post.likes}</span>
                          </button>
                          <button
                            onClick={() => handleShare(post)}
                            className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                          >
                            <Share2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button
                onClick={() => setLoading(true)}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Articles'}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Tag className="mr-2" size={20} />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Trending Posts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="mr-2" size={20} />
                Trending This Week
              </h3>
              <div className="space-y-4">
                {posts.slice(0, 5).map((post, index) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Eye size={12} className="mr-1" />
                        <span>{post.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get the latest travel tips and destination guides delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;