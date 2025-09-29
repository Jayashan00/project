import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, MapPin, X, Star, Heart, Navigation, Plus, Trash2, Filter, Hotel, Bed, Bath, Wifi, Car, Utensils } from "lucide-react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

// Import all your images
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import img4 from "../assets/4.png";
import img5 from "../assets/5.png";
import img6 from "../assets/6.png";
import img7 from "../assets/7.png";
import img8 from "../assets/8.png";
import img9 from "../assets/9.png";
import img10 from "../assets/10.png";
import img11 from "../assets/11.png";
import img12 from "../assets/12.png";
import img13 from "../assets/13.png";
import img14 from "../assets/14.png";
import img15 from "../assets/15.png";
import img16 from "../assets/16.png";
import img17 from "../assets/17.png";
import img18 from "../assets/18.png";
import img19 from "../assets/19.png";
import img20 from "../assets/20.png";
import img21 from "../assets/21.png";
import img22 from "../assets/22.png";
import img23 from "../assets/23.png";
import img24 from "../assets/24.png";
import img25 from "../assets/25.png";

// Rotating background images
const images = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25
];

// Stock images for hotels
const stockImages = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25
];

// Placeholder descriptions
const placeholderDescriptions = [
  "Enjoy luxury and comfort with world-class amenities including spa, gym, and fine dining.",
  "A cozy stay with beautiful views and friendly service. Perfect for couples and solo travelers.",
  "Perfect location for relaxation and sightseeing. Close to major attractions and shopping districts.",
  "Experience elegance, fine dining, and modern comfort in our newly renovated rooms.",
  "Relax by the poolside with panoramic city views. Our infinity pool is a guest favorite.",
  "Stay close to nature with eco-friendly surroundings. Sustainable tourism at its best.",
  "A perfect escape for family and friends. Kids stay free and enjoy our dedicated play area.",
  "Experience a blend of tradition and modern hospitality with authentic local experiences.",
  "Wake up to breathtaking sunrises every morning from your private balcony.",
  "Designed for ultimate comfort and peaceful nights with premium bedding and soundproofing.",
  "Affordable luxury in the heart of the city. Business center and meeting rooms available.",
  "A retreat where serenity meets sophistication. Yoga sessions and meditation classes offered daily.",
  "Spacious rooms with premium facilities. Perfect for extended stays with kitchenette options.",
  "An elegant hideaway for couples and solo travelers. Romantic packages available.",
  "Award-winning service and an unforgettable experience. Concierge service to plan your itinerary.",
];

// Hotel amenities with icons
const amenityIcons = {
  "Free WiFi": <Wifi size={16} />,
  "Swimming Pool": <Bath size={16} />,
  "Air Conditioning": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1a1 1 0 0 0 1-1 1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1 1 1 0 0 0-1-1V7z" />
      <path d="M9 18V6" />
      <path d="M13 18V6" />
    </svg>
  ),
  "Restaurant": <Utensils size={16} />,
  "Spa": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="2" />
      <path d="M8 10v12" />
      <path d="m18 10 3 5-3 5" />
      <path d="m6 10-3 5 3 5" />
      <path d="M14 5a2 2 0 0 0-2-2" />
      <path d="M18 5a2 2 0 0 1 2-2" />
    </svg>
  ),
  "Parking": <Car size={16} />,
  "Breakfast": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11h18M4 15h16M5 19h14M2 7h20" />
    </svg>
  ),
  "Gym": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 5h12M6 19h12M6 9h12M6 15h12" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Planning = () => {
  const [location, setLocation] = useState("");
  const [hotels, setHotels] = useState([]);
  const [myHotels, setMyHotels] = useState([]);
  const [center, setCenter] = useState({ lat: 7.8731, lng: 80.7718 });
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [activeView, setActiveView] = useState("map");
  const [sortBy, setSortBy] = useState("price");
  const [filterBy, setFilterBy] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [favorites, setFavorites] = useState([]);
  const [mapZoom, setMapZoom] = useState(12);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Default dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setCheckInDate(today.toISOString().split("T")[0]);
    setCheckOutDate(tomorrow.toISOString().split("T")[0]);

    // Load user's hotels from localStorage
    const savedHotels = localStorage.getItem("myHotels");
    if (savedHotels) {
      setMyHotels(JSON.parse(savedHotels));
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Background rotate
  useEffect(() => {
    const interval = setInterval(() => setBgIndex((prev) => (prev + 1) % images.length), 6000);
    return () => clearInterval(interval);
  }, []);

  // Save myHotels to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("myHotels", JSON.stringify(myHotels));
  }, [myHotels]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleGuestChange = (type, change) => {
    if (type === "guests") {
      const newValue = guests + change;
      if (newValue >= 1 && newValue <= 10) setGuests(newValue);
    } else {
      const newValue = rooms + change;
      if (newValue >= 1 && newValue <= 5) setRooms(newValue);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
      .getDate()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSearch = async () => {
    if (!location || !checkInDate || !checkOutDate) {
      setError("Please fill in location and dates!");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const geoData = await geoRes.json();

      if (geoData.status === "OK" && geoData.results.length > 0) {
        const { lat, lng } = geoData.results[0].geometry.location;
        setCenter({ lat, lng });

        const res = await fetch(
          `http://localhost:5000/api/hotels?lat=${lat}&lon=${lng}&guests=${guests}&checkInDate=${formatDate(
            checkInDate
          )}&checkOutDate=${formatDate(checkOutDate)}`
        );

        if (!res.ok) throw new Error("Failed to fetch hotels");

        const data = await res.json();

        // Generate random prices for hotels
        const hotelList =
          data.result?.map((h, index) => {
            // Generate random price between 5000 and 50000 LKR
            const randomPrice = Math.floor(Math.random() * 45000) + 5000;

            return {
              id: Date.now() + index,
              name: h.hotel_name || "Unnamed Hotel",
              lat: h.latitude || center.lat + (Math.random() - 0.5) * 0.1,
              lng: h.longitude || center.lng + (Math.random() - 0.5) * 0.1,
              address: h.address_trans || "Address not available",
              price: randomPrice,
              image: stockImages[index % stockImages.length],
              description: placeholderDescriptions[index % placeholderDescriptions.length],
              rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
              amenities: ["Free WiFi", "Swimming Pool", "Air Conditioning", "Restaurant", "Spa"],
              checkInDate,
              checkOutDate,
              guests,
              rooms,
              quantity: 1,
              roomType: ["Standard", "Deluxe", "Suite", "Family"][Math.floor(Math.random() * 4)]
            };
          }) || [];

        setHotels(hotelList);
        setShowPopup(true);
      } else {
        setError("Location not found. Please try a different location.");
        setHotels([]);
      }
    } catch (err) {
      console.error(err);
      // Fallback to mock data if API fails
      const mockHotels = Array.from({ length: 12 }, (_, index) => {
        // Generate random price between 5000 and 50000 LKR
        const randomPrice = Math.floor(Math.random() * 45000) + 5000;

        return {
          id: Date.now() + index,
          name: `Hotel ${index + 1}`,
          lat: center.lat + (Math.random() - 0.5) * 0.1,
          lng: center.lng + (Math.random() - 0.5) * 0.1,
          address: `Address ${index + 1}, ${location}`,
          price: randomPrice,
          image: stockImages[index % stockImages.length],
          description: placeholderDescriptions[index % placeholderDescriptions.length],
          rating: Math.floor(Math.random() * 2) + 4,
          amenities: ["Free WiFi", "Swimming Pool", "Air Conditioning", "Restaurant", "Spa"],
          checkInDate,
          checkOutDate,
          guests,
          rooms,
          quantity: 1,
          roomType: ["Standard", "Deluxe", "Suite", "Family"][Math.floor(Math.random() * 4)]
        };
      });

      setHotels(mockHotels);
      setShowPopup(true);
    }

    setLoading(false);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(i => i !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const addToMyHotels = (hotel) => {
    // Check if hotel already exists
    const exists = myHotels.some(h => h.name === hotel.name && h.address === hotel.address);

    if (!exists) {
      const newHotelWithId = {
        ...hotel,
        id: Date.now(), // Generate unique ID
      };
      setMyHotels([...myHotels, newHotelWithId]);
      alert(`${hotel.name} added to your hotels!`);
    } else {
      alert(`${hotel.name} is already in your hotels!`);
    }
  };

  const removeFromMyHotels = (id) => {
    setMyHotels(myHotels.filter(hotel => hotel.id !== id));
  };

  const updateQuantity = (id, change) => {
    setMyHotels(myHotels.map(item => {
      if (item.id === id) {
        const newQuantity = (item.quantity || 1) + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const clearMyHotels = () => {
    setMyHotels([]);
  };

  const getTotalPrice = () => {
    return myHotels.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  const filteredAndSortedHotels = [...hotels]
    .filter(hotel => {
      if (filterBy === "favorites") {
        return hotel.id !== undefined && favorites.includes(hotel.id);
      }

      if (filterBy === "price") {
        return hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return a.price - b.price;
      } else if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  const maxPrice = Math.max(...hotels.map(h => h.price), 0);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${images[bgIndex]})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900/70 to-cyan-800/70 backdrop-blur-sm" />

      <div className="relative z-10 container mx-auto px-4 py-8 text-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Discover Your Perfect Stay in Sri Lanka
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Find the ideal accommodation with our intelligent hotel search
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/80 text-white p-3 rounded-lg mb-6 max-w-4xl mx-auto text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto mb-12 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Location Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={20} className="text-cyan-400" />
              </div>
              <input
                type="text"
                placeholder="Destination in Sri Lanka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 p-3 rounded-lg w-full border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Check-in Date */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={20} className="text-cyan-400" />
              </div>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="pl-10 p-3 rounded-lg w-full border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Check-out Date */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={20} className="text-cyan-400" />
              </div>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="pl-10 p-3 rounded-lg w-full border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Guests/Rooms Selector */}
            <div className="relative">
              <div
                onClick={() => setShowGuestPicker(!showGuestPicker)}
                className="pl-10 p-3 rounded-lg w-full border border-white/30 bg-white/10 text-white flex justify-between items-center cursor-pointer"
              >
                <div className="flex items-center">
                  <Users size={20} className="text-cyan-400 mr-2" />
                  <span>{guests} Guest{guests !== 1 ? 's' : ''}, {rooms} Room{rooms !== 1 ? 's' : ''}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Guest/Room Picker Dropdown */}
              {showGuestPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-800 rounded-lg shadow-xl z-10 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Guests</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleGuestChange("guests", -1); }}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                        disabled={guests <= 1}
                      >
                        -
                      </button>
                      <span>{guests}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleGuestChange("guests", 1); }}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                        disabled={guests >= 10}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Rooms</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleGuestChange("rooms", -1); }}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                        disabled={rooms <= 1}
                      >
                        -
                      </button>
                      <span>{rooms}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleGuestChange("rooms", 1); }}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                        disabled={rooms >= 5}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full px-5 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:from-cyan-700 hover:to-teal-700"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                <Navigation size={20} />
                Find My Perfect Stay
              </>
            )}
          </button>
        </motion.div>

        {/* POPUP MODAL */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full h-[90vh] max-w-7xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {filteredAndSortedHotels.length} Hotels Found in {location}
                  </h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowPopup(false)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveView("map")}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeView === "map" ? "bg-cyan-600 text-white" : "bg-white text-gray-700"}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Map View
                    </button>
                    <button
                      onClick={() => setActiveView("list")}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeView === "list" ? "bg-cyan-600 text-white" : "bg-white text-gray-700"}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      List View
                    </button>
                    <button
                      onClick={() => setActiveView("myHotels")}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeView === "myHotels" ? "bg-cyan-600 text-white" : "bg-white text-gray-700"}`}
                    >
                      <Hotel size={16} />
                      My Hotels ({myHotels.length})
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border"
                    >
                      <Filter size={16} />
                      Filters
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                      >
                        <option value="price">Price (Low to High)</option>
                        <option value="rating">Rating (High to Low)</option>
                        <option value="name">Name (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                  <div className="p-4 bg-gray-100 border-b">
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Filter by:</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setFilterBy("all")}
                            className={`px-3 py-1 rounded-full ${filterBy === "all" ? "bg-cyan-600 text-white" : "bg-white"}`}
                          >
                            All Hotels
                          </button>
                          <button
                            onClick={() => setFilterBy("favorites")}
                            className={`px-3 py-1 rounded-full flex items-center gap-1 ${filterBy === "favorites" ? "bg-cyan-600 text-white" : "bg-white"}`}
                          >
                            <Heart size={14} fill={filterBy === "favorites" ? "white" : "none"} />
                            Favorites
                          </button>
                          <button
                            onClick={() => setFilterBy("price")}
                            className={`px-3 py-1 rounded-full ${filterBy === "price" ? "bg-cyan-600 text-white" : "bg-white"}`}
                          >
                            Price Range
                          </button>
                        </div>
                      </div>

                      {filterBy === "price" && (
                        <div>
                          <h4 className="font-medium mb-2">Price Range: LKR {priceRange[0]} - LKR {priceRange[1]}</h4>
                          <div className="w-64">
                            <input
                              type="range"
                              min="0"
                              max={maxPrice}
                              value={priceRange[0]}
                              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                              className="w-full"
                            />
                            <input
                              type="range"
                              min="0"
                              max={maxPrice}
                              value={priceRange[1]}
                              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Area */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Map View */}
                  {activeView === "map" && (
                    <div className="w-full h-full relative">
                      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                          mapContainerStyle={{ width: "100%", height: "100%" }}
                          center={center}
                          zoom={mapZoom}
                          options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                            styles: [
                              {
                                featureType: "poi",
                                elementType: "labels",
                                stylers: [{ visibility: "off" }]
                              }
                            ]
                          }}
                        >
                          {filteredAndSortedHotels.map((hotel, i) => (
                            <Marker
                              key={i}
                              position={{ lat: hotel.lat, lng: hotel.lng }}
                              onClick={() => setSelectedHotel(hotel)}
                              icon={{
                                url: `data:image/svg+xml;base64,${btoa(`
                                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                    <circle cx="20" cy="20" r="18" fill="#0891B2" stroke="white" stroke-width="2"/>
                                    <text x="20" y="26" font-family="Arial" font-size="14" fill="white" text-anchor="middle">${i+1}</text>
                                  </svg>
                                `)}`
                              }}
                            />
                          ))}

                          {selectedHotel && (
                            <InfoWindow
                              position={{ lat: selectedHotel.lat, lng: selectedHotel.lng }}
                              onCloseClick={() => setSelectedHotel(null)}
                            >
                              <div className="max-w-xs p-2">
                                <img
                                  src={selectedHotel.image}
                                  alt={selectedHotel.name}
                                  className="w-full h-32 object-cover rounded-lg mb-2"
                                />
                                <h3 className="font-bold text-sm mb-1">{selectedHotel.name}</h3>
                                <div className="flex items-center mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      fill={i < (selectedHotel.rating || 0) ? "#F59E0B" : "none"}
                                      className="text-yellow-500"
                                    />
                                  ))}
                                  <span className="text-xs ml-1 text-gray-600">{selectedHotel.rating}</span>
                                </div>
                                <p className="text-cyan-600 font-semibold text-sm mb-2">
                                  LKR {selectedHotel.price}/night
                                </p>
                                <button
                                  onClick={() => {
                                    addToMyHotels(selectedHotel);
                                    setSelectedHotel(null);
                                  }}
                                  className="w-full bg-green-600 text-white text-xs py-1 px-2 rounded mb-1 hover:bg-green-700 transition-colors"
                                >
                                  Add to My Hotels
                                </button>
                                <button
                                  className="w-full bg-cyan-600 text-white text-xs py-1 px-2 rounded hover:bg-cyan-700 transition-colors"
                                  onClick={() => {
                                    setSelectedHotel(null);
                                    setActiveView("list");
                                  }}
                                >
                                  View Details
                                </button>
                              </div>
                            </InfoWindow>
                          )}
                        </GoogleMap>
                      </LoadScript>
                    </div>
                  )}

                  {/* List View */}
                  {activeView === "list" && (
                    <div className="w-full h-full overflow-y-auto p-4">
                      {filteredAndSortedHotels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredAndSortedHotels.map((hotel, i) => (
                            <motion.div
                              key={hotel.id || i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                            >
                              {/* Image + Favorite Button */}
                              <div className="relative">
                                <img
                                  src={hotel.image}
                                  alt={hotel.name}
                                  className="w-full h-40 object-cover"
                                />
                                <button
                                  onClick={() => hotel.id && toggleFavorite(hotel.id)}
                                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:scale-110 transition"
                                >
                                  <Heart
                                    size={18}
                                    fill={hotel.id && favorites.includes(hotel.id) ? "red" : "none"}
                                    className={hotel.id && favorites.includes(hotel.id) ? "text-red-500" : "text-gray-500"}
                                  />
                                </button>
                              </div>

                              {/* Details */}
                              <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{hotel.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{hotel.address}</p>

                                {/* Rating */}
                                <div className="flex items-center mb-2">
                                  {[...Array(5)].map((_, idx) => (
                                    <Star
                                      key={idx}
                                      size={14}
                                      fill={idx < (hotel.rating || 0) ? "#F59E0B" : "none"}
                                      className="text-yellow-500"
                                    />
                                  ))}
                                  <span className="text-xs ml-2">{hotel.rating}/5</span>
                                </div>

                                {/* Price */}
                                <p className="text-cyan-600 font-semibold mb-3">
                                  LKR {hotel.price}/night
                                </p>

                                {/* Amenities */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {hotel.amenities?.slice(0, 4).map((amenity, idx) => (
                                    <span
                                      key={idx}
                                      className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full"
                                    >
                                      {amenityIcons[amenity]} {amenity}
                                    </span>
                                  ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => addToMyHotels(hotel)}
                                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
                                  >
                                    Add to My Hotels
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedHotel(hotel);
                                      setActiveView("map");
                                    }}
                                    className="flex-1 bg-cyan-600 text-white px-3 py-2 rounded-lg hover:bg-cyan-700 transition"
                                  >
                                    View on Map
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-center mt-10">No hotels found.</p>
                      )}
                    </div>
                  )}

                  {/* My Hotels View */}
                  {activeView === "myHotels" && (
                    <div className="w-full h-full overflow-y-auto p-4">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">My Selected Hotels ({myHotels.length})</h3>
                        {myHotels.length > 0 && (
                          <button
                            onClick={clearMyHotels}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            Clear All
                          </button>
                        )}
                      </div>

                      {myHotels.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                          <Hotel size={48} className="mx-auto mb-4 text-gray-400" />
                          <p className="text-lg">Your hotel list is empty</p>
                          <p className="text-sm">Add hotels from the search results</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {myHotels.map((item, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className="flex gap-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                    <button
                                      onClick={() => removeFromMyHotels(item.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                  <p className="text-cyan-600 font-bold">
                                    LKR {item.price}/night
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {item.checkInDate} - {item.checkOutDate}
                                  </p>
                                  <p className="text-sm text-gray-600">{item.guests} Guests, {item.rooms} Room(s)</p>
                                  {item.roomType && (
                                    <p className="text-sm text-gray-600">Room Type: {item.roomType}</p>
                                  )}

                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-gray-600">Quantity:</span>
                                    <button
                                      onClick={() => updateQuantity(item.id, -1)}
                                      className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                                    >
                                      -
                                    </button>
                                    <span className="text-sm font-medium">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(item.id, 1)}
                                      className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                                    >
                                      +
                                    </button>
                                    <span className="ml-auto text-sm font-medium">
                                      Total: LKR {item.price * (item.quantity || 1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="border-t pt-4 mt-6">
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-semibold text-lg">Grand Total:</span>
                              <span className="text-cyan-600 font-bold text-lg">LKR {getTotalPrice()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Planning;

