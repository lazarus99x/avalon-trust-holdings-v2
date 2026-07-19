import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  MapPin,
  ArrowRight,
  Truck,
  Shield,
  Clock,
  Globe,
  Building2,
  CreditCard,
  Zap,
  BarChart3,
  Globe2,
  ChevronRight,
  Play,
  Ship,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { USAHomeMap } from "../components/USAHomeMap";

export const Home: React.FC = () => {
  const [trackingId, setTrackingId] = useState("");
  const [liveStat, setLiveStat] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStat((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/tracking/${trackingId}`);
    }
  };

  const services = [
    {
      title: "Shipping",
      description: "Create a new shipment and print labels.",
      icon: <Package className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Tracking",
      description: "Monitor your packages in real-time.",
      icon: <MapPin className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Billing",
      description: "Manage invoices and payment methods.",
      icon: <CreditCard className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "International",
      description: "Global shipping and customs solutions.",
      icon: <Globe className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      {/* Live Status Bar */}
      <div className="bg-ups-brown text-ups-yellow py-2 px-4 overflow-hidden whitespace-nowrap border-b border-ups-yellow/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Network Status: Optimal
            </span>
            <span className="hidden sm:inline opacity-50">|</span>
            <span className="hidden sm:inline">
              Live Deliveries Today:{" "}
              <span className="text-white">
                {(1245832 + liveStat).toLocaleString()}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
            <Zap className="w-3 h-3" />
            Priority Processing Active
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <span className="inline-block px-4 py-1.5 bg-ups-yellow/10 text-ups-brown text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-ups-yellow/20">
                GSS Global Shipping
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-ups-brown tracking-tighter leading-[0.9] mb-8">
                Moving the <br />
                <span className="text-ups-yellow-dark">world forward.</span>
              </h1>
              <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed max-w-lg mx-auto lg:mx-0">
                GSS provides real-time visibility and precision control over
                your logistics. Enter your tracking number below to see your
                package's journey.
              </p>

              <div className="relative max-w-xl mx-auto lg:mx-0">
                <form onSubmit={handleSearch} className="relative">
                  <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Tracking (e.g. ATH-123456)"
                    className="w-full pl-12 sm:pl-16 pr-28 sm:pr-40 py-5 sm:py-7 bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl text-sm sm:text-lg focus:ring-4 focus:ring-ups-yellow/20 focus:border-ups-brown transition-all outline-none shadow-2xl shadow-ups-brown/5"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-ups-brown text-ups-yellow px-4 sm:px-8 rounded-xl sm:rounded-2xl font-bold hover:bg-ups-brown/90 transition-all flex items-center gap-2 group text-xs sm:text-base"
                  >
                    Track
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=1200"
                  alt="GSS Logistics"
                  className="w-full h-[600px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ups-brown/60 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-ups-yellow rounded-2xl flex items-center justify-center">
                        <Truck className="text-ups-brown w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">In Transit</h4>
                        <p className="text-white/60 text-xs">
                          Package ATH-882910 is moving
                        </p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "30%" }}
                        animate={{ width: "75%" }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="h-full bg-ups-yellow"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-ups-yellow rounded-full blur-3xl opacity-30 -z-10" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-ups-brown rounded-full blur-3xl opacity-10 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Air Freight Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ups-yellow rounded-full blur-[150px] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=1200"
                  alt="Air Freight"
                  className="w-full h-[500px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ups-brown/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-ups-yellow rounded-xl flex items-center justify-center">
                        <Globe className="text-ups-brown w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">Air Freight</h4>
                        <p className="text-white/60 text-xs">Global reach within hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 bg-ups-yellow/10 text-ups-brown text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-ups-yellow/20">
                By Air
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-ups-brown tracking-tight leading-[1.1] mb-6">
                Fly your cargo <br />
                <span className="text-ups-yellow-dark">anywhere in the world.</span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
                From urgent documents to heavy machinery, our air freight network spans 220+ countries with guaranteed next-day delivery for priority shipments.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-2xl font-black text-ups-brown">4,200+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Daily Flights</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-2xl font-black text-ups-brown">12 hrs</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg Delivery</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold text-ups-brown tracking-tight">
                Our Services
              </h2>
              <p className="text-gray-500 mt-2">
                Comprehensive solutions for every shipping need.
              </p>
            </div>
            <button className="flex items-center gap-2 text-ups-brown font-bold hover:gap-3 transition-all">
              View All Services <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                onClick={() => navigate('/tracking')}
                className="bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
              >
                <div className="h-40 sm:h-48 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-ups-brown">{service.icon}</span>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-ups-brown mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-ups-brown font-bold text-xs sm:text-sm group-hover:gap-3 transition-all">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ground Transport Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-ups-brown rounded-full blur-[120px] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 bg-ups-yellow/10 text-ups-brown text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-ups-yellow/20">
                By Land
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-ups-brown tracking-tight leading-[1.1] mb-6">
                Ground fleet <br />
                <span className="text-ups-yellow-dark">that never stops.</span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
                Our fleet of over 100,000 vehicles moves your packages across continents &#8212; from city centers to remote rural roads, with real-time GPS tracking on every mile.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <p className="text-2xl font-black text-ups-brown">100K+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Vehicles</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <p className="text-2xl font-black text-ups-brown">99.7%</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">On-Time Rate</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200"
                  alt="Ground Transport"
                  className="w-full h-[500px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ups-brown/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-ups-yellow rounded-xl flex items-center justify-center">
                        <Truck className="text-ups-brown w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">Ground Transport</h4>
                        <p className="text-white/60 text-xs">Reliable land delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-ups-brown rounded-[4rem] overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
              <span className="text-ups-yellow text-[10px] font-bold uppercase tracking-[0.3em] mb-4 sm:mb-6">
                Business Solutions
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6 sm:mb-8">
                Scale your business <br />
                <span className="text-ups-yellow">with GSS technology.</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed">
                From small startups to global enterprises, our integrated
                technology solutions help you manage shipping, tracking, and
                billing all in one place.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="text-ups-yellow w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      Advanced Analytics
                    </h4>
                    <p className="text-white/40 text-[10px] sm:text-xs mt-1">
                      Real-time data insights
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="text-ups-yellow w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      API Integration
                    </h4>
                    <p className="text-white/40 text-[10px] sm:text-xs mt-1">
                      Seamless workflow sync
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/solutions')}
                className="bg-ups-yellow text-ups-brown px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-white transition-all w-full sm:w-fit"
              >
                Explore Solutions
              </button>
            </div>
            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full bg-ups-brown-dark/20 flex items-center justify-center p-8 lg:p-0">
              <div className="relative w-full max-w-md aspect-video lg:aspect-square lg:w-full lg:h-full lg:max-w-none">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=1200"
                  alt="Business Solutions"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ups-brown via-ups-brown/40 to-transparent lg:block hidden" />

                {/* Floating Metrics Cards - Enrichment */}
                <div className="absolute inset-0 flex items-center justify-center p-6 lg:p-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative w-full h-full border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden group shadow-2xl"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-ups-yellow text-[10px] font-black uppercase tracking-widest mb-1">
                          Global Status
                        </p>
                        <h4 className="text-white font-bold text-xl">
                          Active Network
                        </h4>
                      </div>
                      <div className="w-10 h-10 bg-ups-yellow/20 rounded-xl flex items-center justify-center text-ups-yellow animate-pulse">
                        <Globe2 className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-end justify-between">
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none">
                          Efficiency
                        </span>
                        <span className="text-ups-yellow font-black text-2xl leading-none">
                          99.2%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "99.2%" }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-ups-yellow shadow-[0_0_15px_rgba(255,181,0,0.5)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-white/40 text-[8px] font-bold uppercase mb-1">
                          Total Assets
                        </p>
                        <p className="text-white font-bold">1.2M+</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-white/40 text-[8px] font-bold uppercase mb-1">
                          Active Hubs
                        </p>
                        <p className="text-white font-bold">542</p>
                      </div>
                    </div>

                    {/* Decorative scanning line */}
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-ups-yellow/10 to-transparent -translate-y-full group-hover:translate-y-[400%] transition-transform duration-[3s] ease-linear" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Network Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-ups-brown tracking-tight mb-4">
              Global Network
            </h2>
            <p className="text-gray-500">
              Connecting every corner of the globe with unparalleled precision.
            </p>
          </div>

          <div className="relative h-[500px] rounded-[3rem] overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600"
              alt="Global Network"
              className="w-full h-full object-cover opacity-50 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 md:gap-24">
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-black text-ups-brown mb-2 tracking-tighter">
                    220+
                  </div>
                  <div className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Countries
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-black text-ups-brown mb-2 tracking-tighter">
                    500k
                  </div>
                  <div className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Employees
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-black text-ups-brown mb-2 tracking-tighter">
                    12M
                  </div>
                  <div className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Packages
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-black text-ups-brown mb-2 tracking-tighter">
                    24/7
                  </div>
                  <div className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Operations
                  </div>
                </div>
              </div>
            </div>

            {/* Pulsing dots for "live" feel */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-ups-yellow rounded-full animate-ping" />
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-ups-yellow rounded-full animate-ping delay-700" />
            <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-ups-yellow rounded-full animate-ping delay-1000" />
          </div>
        </div>
      </section>

      {/* Find Locations Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-12 sm:p-20 shadow-xl border border-gray-100 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-ups-brown tracking-tight mb-6">
                Find an GSS Location
              </h2>
              <p className="text-gray-600 mb-10 leading-relaxed">
                Drop off your packages, pick up supplies, or get expert shipping
                advice at one of our thousands of locations worldwide.
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="City, State, or Zip"
                  className="w-full pl-6 pr-28 sm:pr-40 py-4 sm:py-5 bg-gray-50 border-2 border-transparent rounded-xl sm:rounded-2xl focus:border-ups-brown focus:bg-white transition-all outline-none text-sm sm:text-base"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-ups-brown text-ups-yellow px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold hover:bg-ups-brown/90 transition-all text-sm sm:text-base">
                  Find
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-bold text-ups-brown">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  8,400+ Access Points
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-ups-brown">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  5,000+ GSS Locations
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden relative border-4 border-gray-50 shadow-inner">
              <USAHomeMap />
              <div className="absolute inset-0 pointer-events-none bg-ups-brown/5" />
            </div>
          </div>
        </div>
      </section>

      {/* Ocean Freight Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-ups-yellow rounded-full blur-[150px] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=1200"
                  alt="Ocean Freight"
                  className="w-full h-[500px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ups-brown/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-ups-yellow rounded-xl flex items-center justify-center">
                        <Ship className="text-ups-brown w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">Ocean Freight</h4>
                        <p className="text-white/60 text-xs">Global sea routes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 bg-ups-yellow/10 text-ups-brown text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-ups-yellow/20">
                By Sea
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-ups-brown tracking-tight leading-[1.1] mb-6">
                Shipping across <br />
                <span className="text-ups-yellow-dark">every ocean.</span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
                Full-container loads, LCL, and specialized cargo &#8212; our ocean freight network connects every major port with end-to-end visibility and customs clearance included.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-2xl font-black text-ups-brown">600+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ports Served</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-2xl font-black text-ups-brown">2M+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Containers/yr</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800"
                  alt="GSS Mobile App"
                  className="w-full h-[600px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-ups-yellow rounded-full blur-3xl opacity-20 -z-10" />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-ups-brown text-xs font-bold uppercase tracking-[0.3em] mb-6 block">
                Unbeatable Experience
              </span>
              <h2 className="text-4xl sm:text-6xl font-bold text-ups-brown tracking-tight leading-[1.1] mb-8">
                Track on the go <br />
              </h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                Get real-time notifications, find nearby locations, and manage
                your shipments anytime, anywhere.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-ups-brown text-white px-8 py-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-ups-brown/90 transition-all">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-ups-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-ups-brown tracking-tight mb-8">
            Only the best Service in the world
          </h2>
        </div>
      </section>
    </div>
  );
};
