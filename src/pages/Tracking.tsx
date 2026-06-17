import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Package, Shield, Globe, Clock, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import athLogo from '../upslogo.png';

export const Tracking: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/tracking/${trackingId}`);
    }
  };

  const faqs = [
    {
      q: "Where can I find my tracking number?",
      a: "Tracking numbers are typically found in your shipping confirmation email or on the receipt provided at the ATH Location."
    },
    {
      q: "When will my tracking info be updated?",
      a: "Tracking information is updated each time a barcode is scanned in the ATH delivery system. This can take up to 24 hours after pickup."
    },
    {
      q: "What does 'In Transit' mean?",
      a: "This means your package is moving within the ATH network and is on its way to the final destination."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Search Section */}
      <section className="pt-20 pb-20 sm:pt-32 sm:pb-32 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ups-yellow/10 border border-ups-yellow/20 rounded-full text-ups-brown text-xs font-bold uppercase tracking-widest">
              <Globe className="w-4 h-4" /> Global Tracking System
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-ups-brown tracking-tighter leading-none">
              Track your <br />
              <span className="text-ups-yellow-dark">shipment.</span>
            </h1>
            
            <p className="text-gray-500 text-base sm:text-lg max-w-lg mx-auto font-medium">
              Enter your tracking number below to get real-time updates on your package's journey.
            </p>

            <div className="relative max-w-2xl mx-auto mt-12">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Tracking Number (e.g. ATH-123456)"
                  className="w-full pl-12 sm:pl-16 pr-28 sm:pr-40 py-5 sm:py-7 bg-white border-2 border-transparent rounded-2xl sm:rounded-3xl text-sm sm:text-lg focus:ring-4 focus:ring-ups-yellow/20 focus:border-ups-brown transition-all outline-none shadow-2xl shadow-ups-brown/5"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-ups-brown text-ups-yellow px-4 sm:px-8 rounded-xl sm:rounded-2xl font-bold hover:bg-ups-brown/90 transition-all flex items-center gap-2 group text-xs sm:text-base shadow-lg"
                >
                  Track
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" /> Secure Tracking
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Real-time Updates
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Help Content */}
            <div className="space-y-10">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-ups-brown" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ups-brown mb-4 tracking-tight">Need help finding your number?</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">
                    Your tracking number can be found in several places. Check your email for a shipment confirmation or look at the receipt from your ATH Location representative. If you have a UPS profile, you can also view your full shipment history there.
                  </p>
                </div>
              </div>

              <div className="p-8 bg-ups-brown rounded-[2.5rem] text-white space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-ups-yellow rounded-xl flex items-center justify-center p-1.5">
                    <img src={athLogo} alt="ATH Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold">Shipment Protection</h4>
                    <p className="text-white/60 text-xs font-medium">Global insurance included</p>
                  </div>
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-medium">
                  At ATH, we ensure every shipment is protected. Our real-time monitoring and global security infrastructure keep your goods safe from origin to destination.
                </p>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h3 className="text-xl font-bold text-ups-brown mb-8 tracking-tight flex items-center gap-3">
                <Search className="w-5 h-5 text-ups-yellow-dark" /> Common Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-ups-yellow/30 transition-all group">
                    <h4 className="font-bold text-ups-brown mb-2 group-hover:text-ups-yellow-dark transition-colors">{faq.q}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login CTA */}
      <section className="py-20 bg-ups-yellow/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-10 rounded-[3rem] border-2 border-dashed border-ups-yellow/30 space-y-6">
            <h3 className="text-2xl font-black text-ups-brown tracking-tight">Manage all your shipments in one place</h3>
            <p className="text-gray-500 font-medium">Sign in to your ATH My Choice account to see all your active shipments, set delivery preferences, and get advanced notifications.</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-ups-brown text-ups-yellow px-10 py-4 rounded-2xl font-bold hover:bg-ups-brown/90 transition-all shadow-xl"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
