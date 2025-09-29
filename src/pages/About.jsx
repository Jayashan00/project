import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Leaf, Mountain, Waves, Calendar, Heart, MapPin } from "lucide-react";
import backgroundImg from "../assets/background.jpg";
import wildlifeImg from "../assets/Wildlife Sanctuaries.jpg";
import beachImg from "../assets/Pristine Beaches.jpg";
import heritageImg from "../assets/Ancient Heritage.jpg";

const About = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.jotformEmbedHandler && iframeRef.current) {
        window.jotformEmbedHandler(
          "iframe[id='JotFormIFrame-0198e653ed0e7445af7d974bb31ff2d790fd']",
          "https://www.jotform.com"
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="min-h-screen section-padding bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: `url(${backgroundImg})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-teal-900/60 to-amber-900/70"></div>

      <div className="relative container-custom mx-auto px-4 text-white">
        {/* Animated Heading */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 pt-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="inline-flex items-center justify-center p-3 bg-amber-100/20 rounded-full mb-6 shadow-md"
          >
            <Leaf className="text-amber-300" size={32} />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-xl font-serif">
            Discover Sri Lanka
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl max-w-3xl mx-auto mb-12 text-amber-100 italic"
          >
            The Pearl of the Indian Ocean awaits your exploration
          </motion.p>
        </motion.div>

        {/* Sri Lanka Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              title: "Ancient Heritage",
              desc: "Explore 2,000+ years of history at UNESCO World Heritage sites.",
              icon: <Mountain className="text-amber-400" size={24} />,
              image: heritageImg,
            },
            {
              title: "Pristine Beaches",
              desc: "Discover golden shores and turquoise waters along our coastline.",
              icon: <Waves className="text-amber-400" size={24} />,
              image: beachImg,
            },
            {
              title: "Wildlife Sanctuaries",
              desc: "Encounter elephants, leopards, and exotic birds in their natural habitat.",
              icon: <Heart className="text-amber-400" size={24} />,
              image: wildlifeImg,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300 group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="mr-3 bg-amber-900/30 p-2 rounded-full">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                </div>
                <p className="text-gray-200">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Introduction Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-amber-900/30 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-amber-700/30"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6 text-amber-200">Why Visit Sri Lanka?</h2>
            <p className="text-lg text-amber-100 mb-6">
              Sri Lanka is a land of mesmerizing beauty, rich cultural heritage, and warm hospitality.
              From the ancient kingdoms of Anuradhapura and Polonnaruwa to the misty hills of Nuwara Eliya
              and the pristine beaches of the south coast, our island offers diverse experiences for every traveler.
            </p>
            <p className="text-lg text-amber-100">
              Fill out the form below to consult with our travel expert, Gideon, who will help you craft
              the perfect Sri Lankan adventure tailored to your interests.
            </p>
          </div>
        </motion.div>

        {/* Cultural Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { title: "8+", desc: "UNESCO World Heritage Sites" },
            { title: "1,300km", desc: "Of Pristine Coastline" },
            { title: "22+", desc: "National Parks & Sanctuaries" },
            { title: "2,500+", desc: "Years of Recorded History" },
          ].map((item, index) => (
            <div key={index} className="bg-amber-800/40 backdrop-blur-sm rounded-lg p-4 text-center border border-amber-700/20">
              <div className="text-2xl font-bold text-amber-200">{item.title}</div>
              <div className="text-amber-100 text-sm">{item.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Form Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-serif font-bold mb-4 text-amber-200">Plan Your Journey</h2>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Connect with our travel expert Gideon to create your personalized Sri Lankan experience
          </p>
        </motion.div>

        {/* Embedded Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full overflow-hidden rounded-2xl shadow-2xl mb-16 border-2 border-amber-500/30"
        >
          <iframe
            ref={iframeRef}
            id="JotFormIFrame-0198e653ed0e7445af7d974bb31ff2d790fd"
            title="Gideon: Travel Consultant"
            src="https://agent.jotform.com/0198e653ed0e7445af7d974bb31ff2d790fd?embedMode=iframe&background=1&shadow=1"
            frameBorder="0"
            allow="geolocation; microphone; camera; fullscreen"
            style={{
              width: "100%",
              height: "700px",
              border: "none",
              transition: "all 0.3s ease-in-out",
            }}
            scrolling="no"
          ></iframe>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-900/40 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <MapPin className="text-amber-300" size={20} />
            <span className="text-amber-100">Ready to explore Sri Lanka?</span>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-white">Begin Your Adventure Today</h3>
          <p className="text-amber-100 max-w-2xl mx-auto">
            Submit the form above and our travel expert Gideon will contact you within 24 hours
            to start planning your unforgettable Sri Lankan journey.
          </p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 opacity-20">
        <svg width="100" height="100" viewBox="0 0 100 100" className="text-amber-400">
          <path d="M50 10 L70 50 L50 90 L30 50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <div className="absolute top-20 right-10 opacity-20">
        <svg width="80" height="80" viewBox="0 0 100 100" className="text-amber-400">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );
};

export default About;