# Sri Lanka Travel Website - Full Stack Application

A comprehensive travel website for Sri Lanka featuring real-time analytics, user dashboard, admin panel, and complete dockerization.

## 🌟 Features

### Frontend Features
- **10 Complete Pages**: Home, Dashboard, Destinations, Planning, Gallery, Blog, About, Contact, Subscription, Admin
- **Real-time Analytics**: Charts, graphs, and live data visualization
- **User Dashboard**: Personal travel statistics and booking management
- **Admin Panel**: Complete CRUD operations for users, destinations, bookings
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Framer Motion animations, image galleries, maps integration
- **Modern UI/UX**: Clean design with dark mode support

### Backend Features
- **RESTful API**: Complete API with authentication and authorization
- **Real-time Updates**: Socket.io for live notifications and updates
- **File Upload**: Image processing with Sharp
- **Email System**: Nodemailer integration for notifications
- **Analytics Tracking**: Comprehensive user behavior tracking
- **Security**: JWT authentication, rate limiting, input validation
- **Database**: MongoDB with Mongoose ODM

### DevOps & Deployment
- **Full Dockerization**: Multi-container setup with Docker Compose
- **Nginx Reverse Proxy**: Load balancing and SSL termination
- **MongoDB**: Persistent data storage with initialization scripts
- **Redis**: Caching layer for improved performance
- **Health Checks**: Container health monitoring
- **Environment Configuration**: Separate configs for development and production

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd srilanka-travel-website
```

### 2. Environment Setup
Create environment files:

```bash
# Backend environment
cp server/.env.example server/.env

# Frontend environment  
cp .env.example .env
```

### 3. Docker Deployment (Recommended)

#### Build and Start All Services
```bash
# Build and start all containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

#### Individual Service Management
```bash
# Start specific service
docker-compose up backend -d

# Rebuild specific service
docker-compose up --build frontend -d

# View service logs
docker-compose logs -f backend
```

### 4. Local Development Setup

#### Backend Setup
```bash
cd server
npm install
npm run dev
```

#### Frontend Setup
```bash
npm install
npm run dev
```

#### Database Setup
```bash
# Start MongoDB with Docker
docker run -d -p 27017:27017 --name mongo mongo:7.0

# Or use Docker Compose for just the database
docker-compose up mongo -d
```

## 📁 Project Structure

```
srilanka-travel-website/
├── src/                          # Frontend React application
│   ├── components/              # Reusable components
│   ├── pages/                   # Page components
│   └── assets/                  # Static assets
├── server/                      # Backend Node.js application
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   ├── middleware/              # Custom middleware
│   └── uploads/                 # File uploads directory
├── docker-compose.yml           # Docker services configuration
├── Dockerfile                   # Frontend Docker configuration
├── server/Dockerfile           # Backend Docker configuration
├── nginx.conf                   # Nginx configuration
└── README.md                    # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongo:27017/srilankatravel?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:5000
OPENWEATHER_API_KEY=your-openweather-api-key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React application |
| Backend | 5000 | Node.js API server |
| MongoDB | 27017 | Database |
| Redis | 6379 | Caching layer |
| Nginx | 80/443 | Reverse proxy |

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
```

#### Docker
```bash
npm run docker:build    # Build Docker images
npm run docker:up       # Start all services
npm run docker:down     # Stop all services
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

#### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `POST /api/destinations` - Create destination (Admin)
- `PUT /api/destinations/:id` - Update destination (Admin)

#### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

#### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Manage users
- `GET /api/admin/analytics` - System analytics

## 📊 Features Overview

### User Dashboard
- Personal travel statistics
- Booking history and management
- Favorite destinations
- Real-time notifications
- Interactive charts and graphs

### Admin Panel
- User management with CRUD operations
- Destination management
- Booking oversight
- System analytics and reporting
- Real-time monitoring

### Analytics System
- User behavior tracking
- Page view analytics
- Booking conversion rates
- Revenue tracking
- Real-time dashboard updates

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- File upload restrictions

## 🚀 Deployment

### Production Deployment

1. **Update Environment Variables**
   ```bash
   # Update production values in .env files
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.yml up --build -d
   ```

3. **SSL Configuration**
   - Add SSL certificates to `./ssl/` directory
   - Update nginx.conf for HTTPS

### Cloud Deployment Options

- **AWS**: Use ECS or EKS for container orchestration
- **Google Cloud**: Deploy on GKE or Cloud Run
- **Azure**: Use Container Instances or AKS
- **DigitalOcean**: App Platform or Droplets with Docker

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server && npm test

# Run integration tests
npm run test:integration
```

## 📝 API Documentation

API documentation is available at `/api/docs` when the server is running.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port
   lsof -ti:3000 | xargs kill -9
   ```

2. **Docker Build Issues**
   ```bash
   # Clean Docker cache
   docker system prune -a
   ```

3. **Database Connection Issues**
   ```bash
   # Check MongoDB container
   docker-compose logs mongo
   ```

### Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced booking system
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social media integration
- [ ] PWA features
- [ ] Offline functionality

---

**Built with ❤️ for Sri Lanka Tourism**