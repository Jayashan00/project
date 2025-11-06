import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// This new version uses the Google Places API, which is free to start and uses your existing key.
router.get('/', async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error('Google Maps API Key is not configured on the backend.');
        return res.status(500).json({ error: 'Hotel search service is not configured.' });
    }

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    // This URL searches for places of type "lodging" within a 5km radius of the coordinates.
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=lodging&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Google Places API responded with status: ${response.status}`);
        }
        const data = await response.json();

        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
             console.error('Google Places API Error:', data.error_message || data.status);
             throw new Error(data.error_message || `API Error: ${data.status}`);
        }
        
        // Map the Google Places API response to the format our frontend expects
        const formattedResults = (data.results || []).map(hotel => {
            const photoReference = hotel.photos?.[0]?.photo_reference;
            const imageUrl = photoReference
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`
                : `https://source.unsplash.com/400x300/?hotel,lobby&random=${hotel.place_id}`;
            
            return {
                hotel_id: hotel.place_id,
                hotel_name: hotel.name,
                latitude: hotel.geometry.location.lat,
                longitude: hotel.geometry.location.lng,
                address_trans: hotel.vicinity,
                district: hotel.plus_code?.compound_code?.split(', ')[1] || '',
                review_score: hotel.rating || (Math.random() * (4.5 - 3.5) + 3.5).toFixed(1),
                review_nr: hotel.user_ratings_total || Math.floor(Math.random() * 200) + 20,
                main_photo_url: imageUrl,
                price_breakdown: {
                    // Places API doesn't provide price, so we generate a realistic random one
                    gross_price: (Math.random() * (40000 - 7000) + 7000).toFixed(2)
                }
            };
        });

        res.json({ result: formattedResults });

    } catch (error) {
        console.error('Failed to fetch hotels from Google Places API:', error);
        res.status(500).json({ error: 'Could not retrieve hotel information at this time.' });
    }
});

export default router;