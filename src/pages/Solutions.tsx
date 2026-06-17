import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, BarChart3, Globe2, Building2, Package, Truck, 
  Shield, CreditCard, ChevronRight, Globe, Smartphone, 
  Database, LineChart, Code2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Solutions: React.FC = () => {
  const navigate = useNavigate();

  const businessTypes = [
    {
      title: "E-commerce",
      description: "Scale your online storefront with integrated ATH shipping APIs and automated fulfillment.",
      icon: <Smartphone className="w-6 h-6" />,
      features: ["Custom Checkout Integration", "Real-time Rate Lookups", "Returns Management"]
    },
    {
      title: "Small Business",
      description: "Get enterprise-level tools designed for growing businesses. Save on shipping costs.",
      icon: <Building2 className="w-6 h-6" />,
      features: ["ATH My Choice for Business", "Volume Discounts", "Administrative Control"]
    },
    {
      title: "Enterprise",
      description: "Optimize complex global supply chains with advanced analytics and logistics expertise.",
      icon: <Database className="w-6 h-6" />,
      features: ["Advanced Data Warehousing", "Dedicated Logistics Team", "Custom Global Solutions"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-32 bg-ups-brown relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ups-brown via-ups-brown to-ups-brown-dark opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <span className="inline-block px-4 py-1.5 bg-ups-yellow/20 text-ups-yellow text-xs font-bold uppercase tracking-widest rounded-full border border-ups-yellow/20">
              Technology & Innovation
            </span>
            <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tighter leading-none">
              Intelligence in <br />
              <span className="text-ups-yellow">every shipment.</span>
            </h1>
            <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              ATH provides more than just delivery. We provide the technical infrastructure and data-driven insights to help your business compete globally.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button 
                onClick={() => navigate('/support')}
                className="bg-ups-yellow text-ups-brown px-10 py-5 rounded-2xl font-bold hover:bg-white transition-all w-full sm:w-auto shadow-xl"
              >
                Request a Consultation
              </button>
              <button 
                onClick={() => navigate('/tracking')}
                className="bg-white/10 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/20 transition-all w-full sm:w-auto border border-white/20 backdrop-blur-md"
              >
                Track Now
              </button>
            </div>
          </motion.div>
        </div>
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-ups-yellow rounded-full blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-ups-yellow rounded-full blur-[120px] opacity-10" />
      </section>

      {/* Solutions Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-ups-brown tracking-tight">Tailored for Every Industry</h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">Explore our range of solutions designed to meet the unique challenges of your business sector.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {businessTypes.map((type, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-[2.5rem] p-10 border border-transparent hover:border-ups-yellow/30 hover:bg-white hover:shadow-2xl transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-8 group-hover:bg-ups-brown group-hover:text-ups-yellow transition-all">
                  {type.icon}
                </div>
                <h3 className="text-2xl font-black text-ups-brown mb-4 tracking-tight">{type.title}</h3>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed">{type.description}</p>
                <ul className="space-y-4 mb-8">
                  {type.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-bold text-ups-brown/80">
                      <Zap className="w-4 h-4 text-ups-yellow-dark" /> {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate('/support')}
                  className="w-full py-4 bg-ups-brown/5 text-ups-brown rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-ups-brown group-hover:text-ups-yellow transition-all"
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Mockup Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[4rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 p-12 sm:p-20 space-y-8">
              <span className="text-ups-yellow-dark text-[10px] font-black uppercase tracking-[0.3em]">Data Mastery</span>
              <h2 className="text-3xl sm:text-5xl font-black text-ups-brown leading-none tracking-tight">Your logistics, <br /> rendered visible.</h2>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">Our advanced analytics platform provides 100% visibility into your shipping profile, allowing you to optimize routes, reduce costs, and delight your customers.</p>
              
              <div className="space-y-6 pt-4">
                {[
                  { icon: <LineChart className="w-5 h-5" />, title: "Precision Forecasting", desc: "Predict future shipping needs based on historical data." },
                  { icon: <Code2 className="w-5 h-5" />, title: "Powerful APIs", desc: "Integrate ATH features directly into your existing software." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-ups-yellow/20 transition-all">
                    <div className="p-3 bg-white rounded-xl text-ups-brown shadow-md">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-ups-brown text-sm">{item.title}</h4>
                      <p className="text-gray-400 text-xs mt-1 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 p-12 lg:p-20 bg-ups-brown flex items-center justify-center">
               <motion.div
                initial={{ rotateY: -30, rotateX: 10, scale: 0.9 }}
                whileInView={{ rotateY: 0, rotateX: 0, scale: 1 }}
                className="w-full max-w-md aspect-[4/3] bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-ups-yellow text-[10px] font-black uppercase tracking-widest mb-1">Global Efficiency</p>
                    <h4 className="text-white font-bold text-2xl">Network Flow</h4>
                  </div>
                  <div className="w-12 h-12 bg-ups-yellow rounded-2xl flex items-center justify-center text-ups-brown">
                    <Globe2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  {[75, 45, 90, 60].map((h, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-white/40 text-[8px] font-black uppercase tracking-widest leading-none">
                        <span>NODE-0{i+1} ACTIVE</span>
                        <span>{h}% LOAD</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${h}%` }}
                          transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                          className="h-full bg-ups-yellow shadow-[0_0_15px_rgba(255,181,0,0.5)]" 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-white/40 text-[8px] font-black uppercase tracking-[0.2em]">All Systems Nominal</span>
                  </div>
                  <div className="text-ups-yellow font-black text-sm">v2.4.8</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-1 bg-ups-yellow mx-auto mb-12 rounded-full" />
          <h2 className="text-3xl sm:text-5xl font-black text-ups-brown leading-[1.1] tracking-tight mb-8">
            "ATH transformed our global <br /> supply chain in under six months."
          </h2>
          <p className="text-gray-500 font-medium text-lg uppercase tracking-widest">
            — GLOBAL LOGISTICS DIRECTOR, FORTUNE 500
          </p>
        </div>
      </section>

      {/* Global Services CTA */}
      <section className="py-24 bg-ups-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-ups-brown leading-none tracking-tighter mb-4">Ready to optimize?</h2>
            <p className="text-ups-brown/60 font-bold max-w-sm">Connect with a ATH expert today to build your custom business profile.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => navigate('/support')}
              className="bg-ups-brown text-ups-yellow px-10 py-5 rounded-2xl font-bold hover:bg-ups-brown/90 transition-all flex-1 md:flex-none shadow-2xl"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
