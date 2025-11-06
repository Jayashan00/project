import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// This route uses the Google Maps Geocoding API to find coordinates for any location.
router.get('/', async (req, res) => {
    const locationQuery = req.query.location?.trim();
    // This securely uses the API key set in your docker-compose environment
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error('Google Maps API Key is not configured on the backend.');
        return res.status(500).json({ error: 'Geocoding service is not configured.' });
    }

    if (!locationQuery) {
        return res.status(400).json({ error: 'Location query is required.' });
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationQuery)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            // The frontend expects 'lon', so we send it as 'lon'
            res.json({ lat, lon: lng });
        } else {
            console.warn(`Geocoding failed for "${locationQuery}":`, data.status, data.error_message || '');
            res.status(404).json({ error: 'Location not found. Please try a different location.' });
        }
    } catch (error) {
        console.error('Geocoding API request failed:', error);
        res.status(500).json({ error: 'An error occurred while trying to geocode the location.' });
    }
});

export default router;

