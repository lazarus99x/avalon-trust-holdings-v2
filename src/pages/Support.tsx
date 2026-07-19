import React, { useState } from 'react';
import { 
  Search, Phone, Mail, MessageSquare, ChevronRight, 
  HelpCircle, Package, CreditCard, Shield, Globe, 
  MapPin, Clock, ArrowRight, BookOpen, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Support: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    { title: "Shipping & Tracking", icon: <Package className="w-5 h-5 text-blue-500" /> },
    { title: "Billing & Invoices", icon: <CreditCard className="w-5 h-5 text-emerald-500" /> },
    { title: "Privacy & Security", icon: <Shield className="w-5 h-5 text-red-500" /> },
    { title: "Claims & Returns", icon: <ArrowRight className="w-5 h-5 text-amber-500" /> },
    { title: "IPS & International", icon: <Globe className="w-5 h-5 text-indigo-500" /> },
    { title: "Account & Profile", icon: <UserCheck className="w-5 h-5 text-orange-500" /> }
  ];

  const faqs = [
    { q: "How do I redirect my package?", a: "You can use GSS My Choice® to change the delivery address or provide specific instructions for your driver." },
    { q: "What should I do if my package is late?", a: "Check the latest status on the Tracking page. If the estimated delivery has passed by more than 24 hours, you can initiate a claim." },
    { q: "How do I find a nearby GSS Access Point?", a: "Visit our Locations page and enter your zip code to see all nearby drop-off and pickup locations." },
    { q: "Can I schedule a pickup online?", a: "Yes, you can schedule a one-time pickup or set up recurring pickups through your GSS business profile." }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Search Hero */}
      <section className="pt-24 pb-32 bg-gray-50 border-b border-gray-100 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <span className="text-ups-yellow-dark text-[10px] font-black uppercase tracking-[0.3em] bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">Help Center</span>
            <h1 className="text-4xl sm:text-7xl font-black text-ups-brown leading-none tracking-tighter">How can we <br /> <span className="text-ups-yellow-dark">help you today?</span></h1>
            
            <div className="relative max-w-2xl mx-auto pt-8">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Search help articles, topics, or FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-white border-2 border-transparent rounded-[2rem] text-sm sm:text-lg focus:ring-4 focus:ring-ups-yellow/10 focus:border-ups-brown transition-all outline-none shadow-2xl shadow-ups-brown/5"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
            {categories.map((cat, i) => (
              <button key={i} className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-ups-yellow/40 hover:shadow-xl transition-all group">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-ups-brown group-hover:text-ups-yellow transition-all">
                  {cat.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-ups-brown text-center leading-tight">{cat.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-ups-yellow rounded-full blur-[100px] opacity-10" />
      </section>

      {/* Main Content Sections */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            
            {/* FAQs Accordion */}
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-ups-brown tracking-tight flex items-center gap-3">
                   <HelpCircle className="w-8 h-8 text-ups-yellow-dark" /> Frequently Asked Questions
                </h2>
                <div className="w-12 h-1.5 bg-ups-yellow rounded-full" />
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full flex items-center justify-between py-6 text-left hover:text-ups-yellow-dark transition-colors"
                    >
                      <span className="font-bold text-lg text-ups-brown">{faq.q}</span>
                      <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activeFaq === i ? 'rotate-90 text-ups-yellow-dark' : 'text-gray-300'}`} />
                    </button>
                    <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-8 text-gray-500 font-medium leading-relaxed leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Browse more link */}
              <button className="flex items-center gap-2 text-ups-brown font-black uppercase tracking-widest text-xs hover:gap-3 transition-all pt-4">
                View All FAQs <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Contact Info */}
            <div className="space-y-8">
              <div className="bg-ups-brown rounded-[3rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black tracking-tight mb-4 leading-none">Still need <br /> guidance?</h3>
                  <p className="text-white/60 text-sm font-medium mb-10 leading-relaxed leading-relaxed">Our logistics experts are available 24/7 to resolve your concerns. Direct live support is just a click away.</p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: <Phone className="w-5 h-5" />, label: "Call Us", data: "" },
                      { icon: <Mail className="w-5 h-5" />, label: "Email Support", data: "help@ath-holdings.com" },
                      { icon: <MessageSquare className="w-5 h-5" />, label: "Live Chat", data: "Start a session" }
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-ups-yellow hover:text-ups-brown group/item transition-all text-left">
                        <div className="p-3 bg-white/10 rounded-xl group-hover/item:bg-ups-brown/10">{item.icon}</div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest leading-none mb-1 opacity-50 group-hover/item:opacity-80">{item.label}</p>
                          <p className="text-sm font-bold">{item.data}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-ups-yellow rounded-full blur-3xl opacity-10 -mr-16 -mt-16 group-hover:opacity-30 transition-opacity" />
              </div>

              {/* Resource Cards */}
              <div className="space-y-4">
                {[
                  { icon: <BookOpen className="w-5 h-5" />, title: "GSS User Guides", desc: "Digital manuals for all GSS platforms." },
                  { icon: <MapPin className="w-5 h-5" />, title: "Location Search", desc: "Find GSS locations and access points." },
                  { icon: <Clock className="w-5 h-5" />, title: "Live Delays", desc: "View regional weather & tech status." }
                ].map((res, i) => (
                  <div key={i} className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex items-center gap-4 hover:border-ups-yellow/20 transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-ups-brown shadow-sm group-hover:bg-ups-brown group-hover:text-ups-yellow transition-all">
                      {res.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-ups-brown text-sm">{res.title}</h4>
                      <p className="text-gray-400 text-[10px] font-medium leading-tight mt-0.5">{res.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Support Banner */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-black text-ups-brown tracking-tight">Your trust is our greatest asset.</h2>
          <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">We are committed to providing the highest level of support and reliability in the global logistics industry. Whether you're tracking a gift or managing a global enterprise, we're here to help.</p>
          <div className="flex justify-center gap-12 pt-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-ups-brown tracking-tighter">99.9%</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Uptime</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-ups-brown tracking-tighter">24/7/365</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Availability</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-3xl font-black text-ups-brown tracking-tighter">220+</span>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Support Regions</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
