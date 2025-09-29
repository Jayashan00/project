import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// A simple, reusable spinner component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
);

// Lazy load pages for better initial load performance
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Blog = lazy(() => import('./pages/Blog'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Planning = lazy(() => import('./pages/Planning'));
const SubscriptionPlans = lazy(() => import('./pages/SubscriptionPlans'));
const Payment = lazy(() => import('./pages/Payment'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// --- Private Route Component ---
const PrivateRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// --- Main App Component ---
// NO LONGER CONTAINS A ROUTER. This is now just the layout.
function App() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Toaster position="top-right" />
            <Header />
            <main className="flex-grow">
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        {/* --- Public Routes --- */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/subscription" element={<SubscriptionPlans />} />
                        <Route path="/destinations" element={<Destinations />} />
                        <Route path="/destinations/:id" element={<DestinationDetail />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* --- Private User Routes --- */}
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/planning" element={<PrivateRoute><Planning /></PrivateRoute>} />
                        <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
                        <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />

                        {/* --- Admin Route --- */}
                        <Route path="/admin" element={<PrivateRoute adminOnly={true}><Admin /></PrivateRoute>} />

                        {/* Fallback Route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

export default App;

