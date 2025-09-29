import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckBadgeIcon,
  ArrowRightIcon,
  StarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  TicketIcon,
  XMarkIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import backImage from '../assets/back.jpg';
import cultureImage from '../assets/culture.jpg';
import heritageImage from '../assets/Cultural Heritage Tours.jpg';
import api from '../api/client';

// Sample subscription plans data
const initialPlans = [
  {
    id: 1,
    name: "Island Wanderer",
    price: 12.99,
    duration: "monthly",
    features: [
      "Weekly destination highlights",
      "Basic travel tips & seasonal weather updates",
      "Limited access to exclusive content",
      "Monthly curated photo collection",
      "Basic travel checklist templates",
      "Email support with 48-hour response time",
      "Access to basic travel community forum"
    ],
    popular: false,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    bestFor: "Casual travelers planning their first visit",
    color: "blue"
  },
  {
    id: 2,
    name: "Cultural Explorer",
    price: 34.99,
    duration: "quarterly",
    features: [
      "All Wanderer benefits",
      "Detailed destination guides with hidden gems",
      "Exclusive travel deals (15-20% off)",
      "Early access to new content & personalized recommendations",
      "Quarterly digital magazine with cultural insights",
      "Interactive maps with local recommendations",
      "Priority booking for popular events",
      "WhatsApp support with 24-hour response",
      "Personalized itinerary suggestions",
      "Access to premium travel community"
    ],
    popular: true,
    image: cultureImage,
    bestFor: "Frequent travelers seeking authentic experiences",
    color: "amber"
  },
  {
    id: 3,
    name: "Premium Adventurer",
    price: 119.99,
    duration: "yearly",
    features: [
      "All Explorer benefits",
      "Premium travel deals (25-35% off accommodations & tours)",
      "24/7 travel concierge service with local experts",
      "Custom itinerary planning with real-time adjustments",
      "Priority customer support & emergency assistance",
      "Comprehensive e-books and detailed guides",
      "VIP access to cultural events and festivals",
      "Annual printed luxury magazine",
      "Complimentary airport transfer on first visit",
      "Personalized souvenir delivery quarterly",
      "Dedicated travel consultant",
      "Complimentary SIM card with data upon arrival",
      "Exclusive cooking class experiences"
    ],
    popular: false,
    image: backImage,
    bestFor: "Luxury travelers wanting the ultimate Sri Lankan experience",
    color: "purple"
  }
];

// Testimonials data
const testimonialsData = [
  {
    id: 1,
    name: "Sarah J.",
    location: "From UK",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    plan: "Cultural Explorer"
  },
  {
    id: 2,
    name: "Michael T.",
    location: "From Australia",
    text: "The premium concierge service saved us when our flights got canceled. They rearranged our entire itinerary within hours! Worth every penny for the peace of mind alone.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    plan: "Premium Adventurer"
  },
  {
    id: 3,
    name: "Priya & Raj",
    location: "From India",
    text: "The personalized itineraries helped us experience both popular sites and hidden local treasures. We particularly loved the exclusive access to traditional ceremonies.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    plan: "Cultural Explorer"
  },
  {
    id: 4,
    name: "David L.",
    location: "From Canada",
    text: "As a solo traveler, the Island Wanderer plan gave me the perfect balance of structure and freedom. The weekly updates were spot-on and the community forum was incredibly helpful.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    plan: "Island Wanderer"
  }
];

// FAQ data
const faqData = [
  {
    id: 1,
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. We don't believe in locking our travelers into long-term commitments."
  },
  {
    id: 2,
    question: "Do I get immediate access after subscribing?",
    answer: "Yes! Once your payment is confirmed, you'll get instant access to all benefits of your chosen plan. You'll receive a welcome email with all the details to get started immediately."
  },
  {
    id: 3,
    question: "Are the discounts really exclusive to subscribers?",
    answer: "Absolutely. Our partners provide special rates only available through our subscription plans, often 15-35% better than public prices. These are negotiated specifically for our community."
  },
  {
    id: 4,
    question: "How do I access the concierge service?",
    answer: "Premium subscribers get a dedicated phone number, WhatsApp line, and email address with 24/7 support for any travel needs. You'll receive these contact details immediately after subscription."
  },
  {
    id: 5,
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can change your plan at any time. When upgrading, you'll get immediate access to the new benefits. When downgrading, the changes will take effect at your next billing cycle."
  },
  {
    id: 6,
    question: "Is there a family or group discount?",
    answer: "We offer special group rates for families or travel groups of 4 or more people. Contact our support team for customized pricing options tailored to your group's needs."
  }
];

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTestimonialsModal, setShowTestimonialsModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      try {
        const response = await api.get('/api/users/me');
        setCurrentPlan(response.data.user.subscription.plan);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };

    fetchCurrentSubscription();
  }, []);

  useEffect(() => {
    // Load JotForm script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/agent/embedjs/019904d0bd957e3994f4dc5b0d492655e438/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openPlanDetail = (plan) => {
    setSelectedPlan(plan);
    setShowDetailModal(true);
  };

  const handleSubscribe = async (planName) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/subscriptions/create', {
        plan: planName.toLowerCase()
      });

      if (response.data.paymentRequired) {
        // Redirect to payment page with subscription details
        navigate('/payment', {
          state: {
            type: 'subscription',
            plan: planName,
            amount: response.data.amount,
            subscriptionId: response.data.subscriptionId
          }
        });
      } else {
        // Free plan activated immediately
        toast.success('Subscription updated successfully!');
        setCurrentPlan(planName.toLowerCase());
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartJourney = () => {
    const plansSection = document.getElementById('subscription-plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToWishlist = (planId, e) => {
    e.stopPropagation();
    toast.success('Added to your wishlist!');
  };

  const toggleChatBot = () => {
    setShowChatBot(!showChatBot);
  };

  const PlanCard = ({ plan, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className={`relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 ${
        plan.popular ? 'ring-4 ring-amber-500 scale-105' : 'ring-2 ring-white/10'
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white font-bold px-6 py-2 rounded-full z-10 flex items-center">
          <StarIcon className="w-5 h-5 mr-2" />
          MOST POPULAR
        </div>
      )}

      <div className="relative h-56 overflow-hidden">
        <div
          className="h-full bg-cover bg-center transition-transform duration-700 hover:scale-110"
          style={{ backgroundImage: `url(${plan.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
        <button
          onClick={(e) => handleAddToWishlist(plan.id, e)}
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-amber-500/20 hover:text-amber-400 transition-colors"
          aria-label="Add to wishlist"
        >
          <HeartIcon className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <p className="text-blue-200 text-sm">{plan.bestFor}</p>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="flex items-end mb-6">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="text-lg text-blue-200 ml-2">/{plan.duration}</span>
          {plan.duration === 'yearly' && (
            <span className="ml-auto bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full">
              Save 25%
            </span>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.slice(0, 5).map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckBadgeIcon className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-blue-100 text-sm">{feature}</span>
            </li>
          ))}
          {plan.features.length > 5 && (
            <li className="text-center pt-2">
              <button
                onClick={() => openPlanDetail(plan)}
                className="text-amber-400 hover:text-amber-300 text-sm font-semibold inline-flex items-center"
              >
                + {plan.features.length - 5} more benefits
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>
            </li>
          )}
        </ul>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSubscribe(plan.name)}
            disabled={isLoading || currentPlan === plan.name.toLowerCase()}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              currentPlan === plan.name.toLowerCase()
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : `bg-${plan.color}-500 text-white hover:bg-${plan.color}-600`
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Select Plan
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </>
            )}
          </motion.button>

          <button
            onClick={() => openPlanDetail(plan)}
            className="w-full text-amber-400 hover:text-amber-300 py-2 text-sm text-center"
          >
            View Full Details
          </button>
        </div>
      </div>
    </motion.div>
  );

  const PlanDetailModal = () => (
    <AnimatePresence>
      {showDetailModal && selectedPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDetailModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-72">
              <div
                className="h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedPlan.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-3xl font-bold">{selectedPlan.name}</h3>
                <p className="text-blue-200">{selectedPlan.bestFor}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-end mb-8">
                <div>
                  <span className="text-4xl font-bold">${selectedPlan.price}</span>
                  <span className="text-lg text-blue-200 ml-2">/{selectedPlan.duration}</span>
                </div>
                {selectedPlan.duration === 'yearly' && (
                  <span className="ml-auto bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full">
                    Save 25% compared to monthly
                  </span>
                )}
              </div>

              <div className="mb-8">
                <h4 className="text-2xl font-semibold mb-6 text-amber-400">All Features Included</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPlan.features.map((feature, i) => (
                    <div key={i} className="flex items-start p-3 bg-gray-700/30 rounded-lg">
                      <CheckBadgeIcon className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-100">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500/10 p-6 rounded-xl mb-8 border border-amber-500/20">
                <h4 className="text-xl font-semibold mb-3 text-amber-400">Special Welcome Bonus</h4>
                <p className="text-blue-100">
                  All new subscribers receive our exclusive 50-page Sri Lanka photography guide eBook, perfect for capturing your memories!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectPlan(selectedPlan)}
                  disabled={isLoading}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-600/50 text-gray-900 font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Subscribe Now
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-4 text-amber-400 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400 rounded-xl transition-colors"
                >
                  Compare Plans
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const TestimonialsModal = () => (
    <AnimatePresence>
      {showTestimonialsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowTestimonialsModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-amber-400">Traveler Stories</h2>
                <button
                  onClick={() => setShowTestimonialsModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonialsData.map((testimonial) => (
                  <div key={testimonial.id} className="bg-gray-700/30 p-6 rounded-xl border border-amber-500/20">
                    <div className="flex items-center mb-4">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-3" />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-blue-200 text-sm">{testimonial.location}</p>
                        <p className="text-amber-400 text-xs">{testimonial.plan} Plan</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-blue-100 italic">"{testimonial.text}"</p>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const FaqModal = () => (
    <AnimatePresence>
      {showFaqModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowFaqModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-amber-400">Frequently Asked Questions</h2>
                <button
                  onClick={() => setShowFaqModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {faqData.map((faq) => (
                  <div key={faq.id} className="bg-gray-700/30 p-6 rounded-xl border border-amber-500/20">
                    <h3 className="text-xl font-semibold mb-3 text-amber-400">{faq.question}</h3>
                    <p className="text-blue-100">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <h3 className="text-xl font-semibold mb-3 text-amber-400 flex items-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
                  Still have questions?
                </h3>
                <p className="text-blue-100 mb-4">
                  Our travel experts are here to help you choose the perfect plan for your Sri Lankan adventure.
                </p>
                <button
                  onClick={toggleChatBot}
                  className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-6 rounded-xl transition-colors duration-200"
                >
                  Chat with Us
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ChatBot = () => {
    const [messages, setMessages] = useState([
      { id: 1, text: "Hi there! I'm your travel assistant. How can I help you choose the perfect plan for your Sri Lankan adventure?", sender: "bot" }
    ]);
    const [inputText, setInputText] = useState("");

    const handleSendMessage = () => {
      if (inputText.trim() === "") return;

      // Add user message
      const newUserMessage = { id: Date.now(), text: inputText, sender: "user" };
      setMessages(prev => [...prev, newUserMessage]);
      setInputText("");

      // Simulate bot response after a short delay
      setTimeout(() => {
        let response = "";

        if (inputText.toLowerCase().includes("difference") || inputText.toLowerCase().includes("compare")) {
          response = "Our Island Wanderer is perfect for casual travelers, Cultural Explorer offers authentic experiences, and Premium Adventurer provides luxury services with 24/7 concierge.";
        } else if (inputText.toLowerCase().includes("cancel") || inputText.toLowerCase().includes("refund")) {
          response = "Yes, you can cancel anytime with a 7-day money-back guarantee. Your access continues until the end of the billing period.";
        } else if (inputText.toLowerCase().includes("payment") || inputText.toLowerCase().includes("pay")) {
          response = "We accept all major credit cards, PayPal, and bank transfers. All payments are secure and encrypted.";
        } else if (inputText.toLowerCase().includes("recommend") || inputText.toLowerCase().includes("which")) {
          response = "Most travelers choose our Cultural Explorer plan as it offers the best value with exclusive experiences. Can I tell you more about its benefits?";
        } else {
          const randomResponses = [
            "I'd be happy to help you with that! Our travel experts have curated these plans based on years of experience.",
            "That's a great question! All our plans include exclusive access to hidden gems that regular tourists don't get to experience.",
            "I can connect you with one of our Sri Lanka specialists if you'd like more detailed information about any of the plans.",
            "Many travelers find our Cultural Explorer plan to be the perfect balance of value and exclusive experiences.",
            "We offer a 7-day money-back guarantee if you're not completely satisfied with your subscription."
          ];
          response = randomResponses[Math.floor(Math.random() * randomResponses.length)];
        }

        const newBotMessage = { id: Date.now() + 1, text: response, sender: "bot" };
        setMessages(prev => [...prev, newBotMessage]);
      }, 1000);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    };

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
      const chatContainer = document.getElementById('chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, [messages]);

    return (
      <AnimatePresence>
        {showChatBot && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="bg-amber-500 p-4 text-white font-bold flex justify-between items-center">
              <span className="flex items-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                Travel Assistant
              </span>
              <button onClick={toggleChatBot} className="text-white hover:text-gray-200">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div id="chat-messages" className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block rounded-lg p-3 max-w-xs ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>


            <div className="border-t p-3 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={inputText.trim() === ""}
                  className="ml-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-white p-2 rounded-lg transition-colors"
                >
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Ask about our plans, payment options, or recommendations</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header Section */}
      <div
        className="relative py-32 bg-cover bg-fixed bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heritageImage})`
        }}

      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
          >
            Discover Sri Lanka Like Never Before
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-blue-100"
          >
            Choose your perfect travel companion and unlock the wonders of the Pearl of the Indian Ocean
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartJourney}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-xl transition-colors duration-200 inline-flex items-center"
            >
              Start Your Journey
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </motion.button>

            <Link
              to="/destinations"
              className="text-amber-400 hover:text-amber-300 transition-colors font-semibold inline-flex items-center"
            >
              Explore Destinations First
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8"
          >
            <Link
              to="/"
              className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors font-semibold text-sm"
            >
              <ArrowRightIcon className="w-4 h-4 rotate-180 mr-2" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Subscription?</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              We've crafted the ultimate Sri Lankan travel experience with exclusive benefits you won't find anywhere else
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Exclusive Access",
                description: "Visit hidden gems and restricted areas with special permissions",
                icon: <StarIcon className="w-12 h-12 text-amber-400" />,
                delay: 0.1,
              },
              {
                title: "Local Expertise",
                description: "Connect with verified local guides who know the true heart of Sri Lanka",
                icon: <GlobeAltIcon className="w-12 h-12 text-amber-400" />,
                delay: 0.2,
              },
              {
                title: "Best Value",
                description: "Save up to 40% compared to booking experiences separately",
                icon: <TicketIcon className="w-12 h-12 text-amber-400" />,
                delay: 0.3,
              },
              {
                title: "Peace of Mind",
                description: "24/7 support and comprehensive travel insurance included",
                icon: <ShieldCheckIcon className="w-12 h-12 text-amber-400" />,
                delay: 0.4,
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl text-center border border-amber-500/20 shadow-xl"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div id="subscription-plans" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Choose Your Adventure</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Select the plan that matches your travel style and unlock extraordinary experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-900/70">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Travelers Love Our Plans</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Join thousands of satisfied explorers who've discovered Sri Lanka with our guidance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-amber-500/20"
              >
                <div className="flex items-center mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-blue-200 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-blue-100 mb-4 italic line-clamp-3">"{testimonial.text}"</p>
                <button
                  onClick={() => setShowTestimonialsModal(true)}
                  className="text-amber-400 hover:text-amber-300 text-sm font-semibold inline-flex items-center"
                >
                  Read full story
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Everything you need to know about our subscription plans
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqData.slice(0, 4).map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 p-6 rounded-2xl border border-amber-500/20"
            >
              <h3 className="text-xl font-semibold mb-2 text-amber-400">{faq.question}</h3>
              <p className="text-blue-100 line-clamp-2">{faq.answer}</p>
              <button
                onClick={() => setShowFaqModal(true)}
                className="text-amber-400 hover:text-amber-300 text-sm font-semibold mt-3 inline-flex items-center"
              >
                Read complete answer
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore Sri Lanka?</h2>
            <p className="text-amber-100 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who've transformed their Sri Lankan adventure with our exclusive subscription plans
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartJourney}
                className="bg-gray-900 hover:bg-black text-amber-400 font-bold py-4 px-8 rounded-xl transition-colors duration-200 inline-flex items-center"
              >
                Start Your Journey
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </motion.button>
              <button
                onClick={toggleChatBot}
                className="text-amber-100 hover:text-white font-semibold py-4 px-8 rounded-xl border border-amber-400/30 hover:border-amber-400 transition-colors inline-flex items-center"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                Get Help Choosing
              </button>
            </div>
            <p className="text-amber-200/80 text-sm mt-6">7-day money-back guarantee on all plans • No hidden fees</p>
          </motion.div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChatBot}
        className="fixed bottom-6 right-6 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-2xl z-40 flex items-center justify-center"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </motion.button>

      {/* Modals */}
      <PlanDetailModal />
      <TestimonialsModal />
      <FaqModal />
      <ChatBot />
    </div>
  );
};

export default SubscriptionPlans;

