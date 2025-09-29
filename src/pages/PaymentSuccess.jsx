import React from 'react';
import { motion } from 'framer-motion';
import { CheckBadgeIcon, ArrowRightIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const { plan } = location.state || {};

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Plan Information</h2>
          <Link to="/subscription" className="text-amber-400 hover:text-amber-300">
            Return to Subscription Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckBadgeIcon className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-4">Welcome to the Adventure!</h1>
          <p className="text-xl text-blue-200 mb-8">
            Your {plan.name} subscription is now active. Get ready to explore Sri Lanka like never before.
          </p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-800/50 p-6 rounded-2xl border border-amber-500/20 mb-8 text-left"
          >
            <h2 className="text-2xl font-semibold mb-4 text-amber-400">What happens next?</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-amber-500/10 p-2 rounded-lg mr-4">
                  <EnvelopeIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Check your email</h3>
                  <p className="text-blue-200">We've sent a confirmation email with your subscription details and next steps.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-500/10 p-2 rounded-lg mr-4">
                  <ArrowRightIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Access your dashboard</h3>
                  <p className="text-blue-200">Log in to your account to access exclusive content and plan your trip.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-500/10 p-2 rounded-lg mr-4">
                  <CheckBadgeIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Start exploring</h3>
                  <p className="text-blue-200">Begin your Sri Lankan adventure with our curated guides and recommendations.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors duration-200 inline-flex items-center justify-center"
            >
              Go to Dashboard
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>

            <Link
              to="/destinations"
              className="text-amber-400 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400 py-3 px-6 rounded-xl transition-colors inline-flex items-center justify-center"
            >
              Browse Destinations
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Need help? <button className="text-amber-400 hover:text-amber-300">Contact our support team</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;