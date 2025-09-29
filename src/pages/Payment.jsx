import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CheckBadgeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Redirect to success page after 3 seconds
      setTimeout(() => {
        navigate('/payment-success', {
          state: { plan: plan }
        });
      }, 3000);
    }, 2000);
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Plan Selected</h2>
          <Link to="/subscription" className="text-amber-400 hover:text-amber-300">
            Return to Subscription Plans
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800 p-8 rounded-2xl text-center max-w-md"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckBadgeIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-blue-200 mb-4">Your {plan.name} subscription is now active.</p>
          <p className="text-sm text-gray-400">Redirecting to confirmation page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/subscription"
          className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Plans
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Complete Your Subscription</h1>
          <p className="text-blue-200 mb-8">You're subscribing to: <span className="text-amber-400 font-semibold">{plan.name}</span></p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-gray-800/50 p-6 rounded-2xl border border-amber-500/20"
            >
              <h2 className="text-xl font-semibold mb-4 text-amber-400">Order Summary</h2>

              <div className="mb-6 p-4 bg-gray-700/30 rounded-xl">
                <div className="flex items-center mb-4">
                  <div
                    className="w-16 h-16 bg-cover bg-center rounded-lg mr-4"
                    style={{ backgroundImage: `url(${plan.image})` }}
                  ></div>
                  <div>
                    <h3 className="font-bold">{plan.name}</h3>
                    <p className="text-sm text-blue-200">{plan.bestFor}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subscription Fee</span>
                    <span>${plan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700 font-bold">
                    <span>Total</span>
                    <span className="text-amber-400">${plan.price}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                <h3 className="font-semibold mb-2 text-amber-400">What's Included</h3>
                <ul className="text-sm space-y-1">
                  {plan.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckBadgeIcon className="w-4 h-4 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  <li className="text-amber-400 font-semibold">
                    + {plan.features.length - 3} more benefits
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 p-6 rounded-2xl border border-amber-500/20"
            >
              <h2 className="text-xl font-semibold mb-4 text-amber-400">Payment Details</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-gray-600 hover:border-gray-500'
                    } transition-colors`}
                  >
                    Credit Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 rounded-xl border ${
                      paymentMethod === 'paypal'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-gray-600 hover:border-gray-500'
                    } transition-colors`}
                  >
                    PayPal
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <input
                        type="text"
                        name="number"
                        value={cardDetails.number}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        name="name"
                        value={cardDetails.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-600/50 text-gray-900 font-bold py-4 px-6 rounded-xl transition-colors duration-200 mt-6 flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <LockClosedIcon className="w-5 h-5 mr-2" />
                        Pay ${plan.price}
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Your payment is secure and encrypted. We do not store your card details.
                  </p>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-blue-200 mb-4">You will be redirected to PayPal to complete your payment.</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl">
                    Continue to PayPal
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;