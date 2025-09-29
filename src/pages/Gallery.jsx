import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Heart,
  Download,
  Share2,
  Eye,
  Filter,
  Grid3X3,
  List,
  Search,
  MapPin,
  Calendar,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize
} from 'lucide-react';
import seegiriya from "../assets/seegiriya.jpg";
import sigiriya from "../assets/sigiriya.jpg";
import ninearch from "../assets/ninearch.jpg";
import background from "../assets/background.jpg";
import tooth from "../assets/tooth.jpg";
import templeoftooth from "../assets/templeoftooth.jpg";
import meerissa from "../assets/meerissa.jpg";
import mirissa from "../assets/mirissa.jpg";


const mockGalleryData = [
  {
    id: 1,
    title: 'Sigiriya Rock Fortress',
    category: 'landscapes',
    location: 'Central Province',
    photographer: 'John Doe',
    date: '2024-12-15',
    images: [
      {
        id: 1,
        url: seegiriya,
        thumbnail: seegiriya,
        caption: 'Ancient rock fortress at sunrise',
        likes: 245,
        views: 1520,
        downloads: 89
      },
      {
        id: 2,
        url: sigiriya,
        thumbnail: sigiriya,
        caption: 'View from the top of Sigiriya',
        likes: 189,
        views: 1203,
        downloads: 67
      }
    ],
    description: 'Stunning views of the ancient Sigiriya Rock Fortress',
    tags: ['heritage', 'ancient', 'unesco', 'sunrise'],
    featured: true
  },
  {
    id: 2,
    title: 'Ella Nine Arch Bridge',
    category: 'nature',
    location: 'Uva Province',
    photographer: 'Jane Smith',
    date: '2024-12-10',
    images: [
      {
        id: 3,
        url: ninearch,
        thumbnail: ninearch,
        caption: 'Train crossing the Nine Arch Bridge',
        likes: 312,
        views: 2150,
        downloads: 145
      },
      {
        id: 4,
        url: background,
        thumbnail: background,
        caption: 'Tea plantations surrounding the bridge',
        likes: 278,
        views: 1890,
        downloads: 123
      }
    ],
    description: 'The iconic Nine Arch Bridge surrounded by lush tea plantations',
    tags: ['bridge', 'train', 'tea', 'nature'],
    featured: false
  },
  {
    id: 3,
    title: 'Temple of the Tooth',
    category: 'temples',
    location: 'Kandy',
    photographer: 'Mike Johnson',
    date: '2024-12-08',
    images: [
      {
        id: 5,
        url: tooth,
        thumbnail: tooth,
        caption: 'Sacred Temple of the Tooth at dusk',
        likes: 198,
        views: 1456,
        downloads: 78
      },
      {
        id: 6,
        url: templeoftooth,
        thumbnail: templeoftooth,
        caption: 'Another view of Temple of the Tooth',
        likes: 145,
        views: 1102,
        downloads: 56
      }
    ],
    description: 'Sacred Buddhist temple housing the tooth relic of Buddha',
    tags: ['temple', 'buddhist', 'sacred', 'kandy'],
    featured: true
  },
  {
    id: 4,
    title: 'Mirissa Beach Sunset',
    category: 'beaches',
    location: 'Southern Province',
    photographer: 'Sarah Wilson',
    date: '2024-12-05',
    images: [
      {
        id: 7,
        url: meerissa,
        thumbnail: meerissa,
        caption: 'Golden sunset at Mirissa Beach',
        likes: 456,
        views: 3200,
        downloads: 234
      },
      {
        id: 8,
        url: mirissa,
        thumbnail: mirissa,
        caption: 'Fishing boats at Mirissa harbor',
        likes: 234,
        views: 1876,
        downloads: 156
      }
    ],
    description: 'Beautiful sunset views and pristine beaches of Mirissa',
    tags: ['beach', 'sunset', 'ocean', 'fishing'],
    featured: false
  }
];


const categories = [
  { id: 'all', name: 'All Photos', count: 156 },
  { id: 'landscapes', name: 'Landscapes', count: 45 },
  { id: 'culture', name: 'Culture', count: 32 },
  { id: 'wildlife', name: 'Wildlife', count: 28 },
  { id: 'beaches', name: 'Beaches', count: 24 },
  { id: 'temples', name: 'Temples', count: 18 },
  { id: 'nature', name: 'Nature', count: 9 }
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGalleryImages, setCurrentGalleryImages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filter galleries based on category and search
  const filteredGalleries = mockGalleryData.filter(gallery => {
    const matchesCategory = selectedCategory === 'all' || gallery.category === selectedCategory;
    const matchesSearch = gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gallery.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gallery.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Get all images for lightbox
  const allImages = filteredGalleries.flatMap(gallery => 
    gallery.images.map(image => ({
      ...image,
      galleryTitle: gallery.title,
      location: gallery.location,
      photographer: gallery.photographer
    }))
  );

  const openLightbox = (image, gallery) => {
    const galleryImages = gallery.images;
    const imageIndex = galleryImages.findIndex(img => img.id === image.id);
    
    setCurrentGalleryImages(galleryImages.map(img => ({
      ...img,
      galleryTitle: gallery.title,
      location: gallery.location,
      photographer: gallery.photographer
    })));
    setCurrentImageIndex(imageIndex);
    setSelectedImage(image);
    setLightboxOpen(true);
    setZoom(1);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    setIsSlideshow(false);
    setZoom(1);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(currentGalleryImages[nextIndex]);
    setZoom(1);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(currentGalleryImages[prevIndex]);
    setZoom(1);
  };

  const toggleFavorite = (imageId) => {
    setFavorites(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleDownload = (imageUrl, imageName) => {
    // In a real app, this would trigger an actual download
    console.log(`Downloading ${imageName} from ${imageUrl}`);
  };

  const handleShare = (image) => {
    if (navigator.share) {
      navigator.share({
        title: image.caption,
        url: image.url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(image.url);
    }
  };

  // Slideshow functionality
  useEffect(() => {
    let interval;
    if (isSlideshow && lightboxOpen) {
      interval = setInterval(() => {
        nextImage();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSlideshow, lightboxOpen, currentImageIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          closeLightbox();
          break;
        case ' ':
          e.preventDefault();
          setIsSlideshow(!isSlideshow);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, isSlideshow]);

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
            Sri Lanka Gallery
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore the breathtaking beauty of Sri Lanka through our curated collection of stunning photographs
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-6">
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

        {/* Gallery Grid */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-6'
        }`}>
          {filteredGalleries.map((gallery, index) => (
            <motion.div
              key={gallery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Gallery Images */}
              <div className={`relative ${viewMode === 'list' ? 'w-80' : 'h-64'} overflow-hidden`}>
                <div className={`${
                  gallery.images.length > 1 
                    ? 'grid grid-cols-2 gap-1 h-full' 
                    : 'h-full'
                }`}>
                  {gallery.images.slice(0, viewMode === 'list' ? 1 : 4).map((image, imgIndex) => (
                    <div
                      key={image.id}
                      className="relative cursor-pointer group overflow-hidden"
                      onClick={() => openLightbox(image, gallery)}
                    >
                      <img
                        src={image.thumbnail}
                        alt={image.caption}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(image.id);
                            }}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                          >
                            <Heart 
                              size={16} 
                              className={favorites.includes(image.id) ? 'text-red-500 fill-current' : 'text-gray-600'} 
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(image);
                            }}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                          >
                            <Share2 size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Image count overlay for multiple images */}
                      {gallery.images.length > 1 && imgIndex === 0 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                          +{gallery.images.length - 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Featured badge */}
                {gallery.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Gallery Info */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {gallery.title}
                </h3>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3 space-x-4">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{gallery.location}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    <span className="text-sm">{gallery.photographer}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {gallery.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {gallery.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      <span>{gallery.images.reduce((sum, img) => sum + img.views, 0)}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart size={14} className="mr-1" />
                      <span>{gallery.images.reduce((sum, img) => sum + img.likes, 0)}</span>
                    </div>
                    <div className="flex items-center">
                      <Download size={14} className="mr-1" />
                      <span>{gallery.images.reduce((sum, img) => sum + img.downloads, 0)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{new Date(gallery.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setLoading(true)}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Photos'}
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Navigation Buttons */}
              {currentGalleryImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSlideshow(!isSlideshow);
                  }}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  {isSlideshow ? <Pause size={20} /> : <Play size={20} />}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom(zoom > 1 ? 1 : 2);
                  }}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  {zoom > 1 ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(selectedImage.id);
                  }}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <Heart 
                    size={20} 
                    className={favorites.includes(selectedImage.id) ? 'text-red-500 fill-current' : ''} 
                  />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(selectedImage.url, selectedImage.caption);
                  }}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <Download size={20} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(selectedImage);
                  }}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Image */}
              <motion.img
                key={selectedImage.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: zoom, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="max-w-full max-h-full object-contain cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                style={{ transform: `scale(${zoom})` }}
              />

              {/* Image Info */}
              <div className="absolute bottom-16 left-4 right-4 z-10 bg-black/50 text-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-1">{selectedImage.caption}</h3>
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div className="flex items-center space-x-4">
                    <span>{selectedImage.galleryTitle}</span>
                    <span>•</span>
                    <span>{selectedImage.location}</span>
                    <span>•</span>
                    <span>by {selectedImage.photographer}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{selectedImage.views} views</span>
                    <span>{selectedImage.likes} likes</span>
                  </div>
                </div>
              </div>

              {/* Image Counter */}
              {currentGalleryImages.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {currentGalleryImages.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;