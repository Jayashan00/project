db = db.getSiblingDB('srilankatravel');

// Create collections
db.createCollection('users');
db.createCollection('destinations');
db.createCollection('bookings');
db.createCollection('contacts');
db.createCollection('analytics');
db.createCollection('blogs');
db.createCollection('galleries');
db.createCollection('subscriptions');


// Create default admin user if one doesn't exist
if (db.users.countDocuments({ email: "admin@gmail.com" }) === 0) {
    db.users.insertOne({
        username: "admin",
        email: "admin@gmail.com",
        password: "$2a$10$6Bnv6HxkxLpopsxnDv.xvOF7RxsOqfLilr5k1QfNEIqBGmdUqQaUi", // hashed version of admin123
        firstName: "Admin",
        lastName: "User",
        role: "admin", // Ensure role is set
        verified: true,
        disabled: false,
        subscription: {
            plan: "premium",
            status: "active",
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)) // 5 years
        },
        createdAt: new Date(),
        updatedAt: new Date()
    });
}


// Note: Indexes are now managed by Mongoose schemas to avoid duplication warnings.

// Insert sample data if collections are empty
if (db.destinations.countDocuments() === 0) {
    db.destinations.insertMany([
        {
            name: "Sigiriya Rock Fortress",
            description: "Ancient rock fortress and palace ruins surrounded by gardens, reservoirs and other structures.",
            location: "Central Province",
            region: "Central",
            category: "Historical",
            coordinates: { latitude: 7.9569, longitude: 80.7597 },
            images: [{ url: "https://images.pexels.com/photos/5945716/pexels-photo-5945716.jpeg", isPrimary: true }],
            budgetCategory: "Moderate",
            bestSeason: "December-April",
            entryFee: { local: 100, foreign: 30, currency: "USD" },
            ratings: { average: 4.8, count: 2847 },
            status: "active",
            featured: true,
            visitCount: 15420,
            bookingCount: 1250,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: "Ella Nine Arch Bridge",
            description: "Iconic railway bridge surrounded by lush tea plantations and stunning mountain views.",
            location: "Ella",
            region: "Uva",
            category: "Nature",
            coordinates: { latitude: 6.8721, longitude: 81.0460 },
            images: [{ url: "https://images.pexels.com/photos/32414369/pexels-photo-32414369.jpeg", isPrimary: true }],
            budgetCategory: "Budget",
            bestSeason: "Year-round",
            entryFee: { local: 0, foreign: 0, currency: "USD" },
            ratings: { average: 4.7, count: 1923 },
            status: "active",
            featured: true,
            visitCount: 12890,
            bookingCount: 890,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: "Yala National Park",
            description: "Sri Lanka's most visited national park, famous for leopards and diverse wildlife.",
            location: "Southern Province",
            region: "Southern",
            category: "Wildlife",
            coordinates: { latitude: 6.3731, longitude: 81.5197 },
            images: [{ url: "https://images.pexels.com/photos/31613784/pexels-photo-31613784.jpeg", isPrimary: true }],
            budgetCategory: "Moderate",
            bestSeason: "February-July",
            entryFee: { local: 1, foreign: 25, currency: "USD" },
            ratings: { average: 4.9, count: 3215 },
            status: "active",
            featured: true,
            visitCount: 18750,
            bookingCount: 1680,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
}


print('Database initialized successfully!');

