import express from 'express';
import { query } from 'express-validator';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Mock hotel data for Sri Lankan locations
const mockHotelsData = [
  {
    hotel_name: "Galle Face Hotel",
    latitude: 6.9271,
    longitude: 79.8612,
    address_trans: "2 Kollupitiya Rd, Colombo 00300"
  },
  {
    hotel_name: "The Kingsbury Colombo",
    latitude: 6.9344,
    longitude: 79.8428,
    address_trans: "48 Janadhipathi Mawatha, Colombo 00100"
  },
  {
    hotel_name: "Cinnamon Grand Colombo",
    latitude: 6.9147,
    longitude: 79.8501,
    address_trans: "77 Galle Rd, Colombo 00300"
  },
  {
    hotel_name: "Shangrila Hotel Colombo",
    latitude: 6.9271,
    longitude: 79.8612,
    address_trans: "One Galle Face, Colombo 00200"
  },
  {
    hotel_name: "Hotel Nippon",
    latitude: 6.9147,
    longitude: 79.8734,
    address_trans: "123 Kumaran Ratnam Rd, Colombo 00200"
  },
  {
    hotel_name: "Grand Oriental Hotel",
    latitude: 6.9388,
    longitude: 79.8542,
    address_trans: "2 York St, Colombo 00100"
  },
  {
    hotel_name: "Cinnamon Lakeside Colombo",
    latitude: 6.9319,
    longitude: 79.8478,
    address_trans: "115 Sir Chittampalam A Gardiner Mawatha, Colombo 00200"
  },
  {
    hotel_name: "Taj Samudra Colombo",
    latitude: 6.9147,
    longitude: 79.8428,
    address_trans: "25 Galle Face Centre Rd, Colombo 00300"
  }
];

// Get hotels by location
router.get('/', [
  query('lat').isFloat({ min: -90, max: 90 }),
  query('lon').isFloat({ min: -180, max: 180 }),
  query('guests').optional().isInt({ min: 1 }),
  query('checkInDate').optional().isISO8601(),
  query('checkOutDate').optional().isISO8601()
], optionalAuth, async (req, res) => {
  try {
    const { lat, lon, guests, checkInDate, checkOutDate } = req.query;
    
    // For demo purposes, return mock data with some variations based on location
    const baseLatitude = parseFloat(lat);
    const baseLongitude = parseFloat(lon);
    
    // Generate hotels around the requested location
    const hotels = mockHotelsData.map((hotel, index) => ({
      ...hotel,
      latitude: baseLatitude + (Math.random() - 0.5) * 0.1, // Random offset within 0.1 degrees
      longitude: baseLongitude + (Math.random() - 0.5) * 0.1,
      address_trans: `${hotel.address_trans} - Near ${req.query.location || 'requested location'}`
    }));

    // Add some additional random hotels
    for (let i = 0; i < 8; i++) {
      hotels.push({
        hotel_name: `Hotel ${String.fromCharCode(65 + i)}${Math.floor(Math.random() * 100)}`,
        latitude: baseLatitude + (Math.random() - 0.5) * 0.15,
        longitude: baseLongitude + (Math.random() - 0.5) * 0.15,
        address_trans: `${Math.floor(Math.random() * 500) + 1} ${['Main St', 'Beach Rd', 'Hill View', 'Lake Side', 'Garden Ave'][Math.floor(Math.random() * 5)]}`
      });
    }

    res.json({
      success: true,
      result: hotels,
      count: hotels.length,
      searchParams: {
        latitude: baseLatitude,
        longitude: baseLongitude,
        guests: guests || 1,
        checkIn: checkInDate,
        checkOut: checkOutDate
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hotel details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock hotel details
    const hotel = {
      id,
      hotel_name: `Hotel ${id}`,
      latitude: 6.9271 + (Math.random() - 0.5) * 0.1,
      longitude: 79.8612 + (Math.random() - 0.5) * 0.1,
      address_trans: `${Math.floor(Math.random() * 500) + 1} Sample Address, Sri Lanka`,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 rating
      description: "A beautiful hotel with excellent amenities and stunning views. Perfect for your Sri Lankan adventure.",
      amenities: [
        "Free WiFi",
        "Swimming Pool",
        "Air Conditioning",
        "Restaurant",
        "Spa",
        "Parking",
        "Gym",
        "Room Service"
      ],
      images: [
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg"
      ],
      price_range: {
        min: Math.floor(Math.random() * 5000) + 3000,
        max: Math.floor(Math.random() * 10000) + 8000,
        currency: "LKR"
      },
      contact: {
        phone: `+94 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
        email: `info@hotel${id}.lk`,
        website: `https://hotel${id}.lk`
      }
    };

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;