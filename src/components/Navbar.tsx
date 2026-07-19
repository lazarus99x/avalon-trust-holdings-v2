import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, User, LogOut, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import athLogo from '../athlogo.svg';

export const Navbar: React.FC = () => {
  const { user, profile, isStaff } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navLinks = [
    { label: 'Shipping', path: '/' },
    { label: 'Tracking', path: '/tracking' },
    { label: 'World Map', path: '/worldmap' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Support', path: '/support' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-100 text-[10px] py-1.5 px-4 border-b border-gray-200 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 text-gray-500 font-medium">
            <span className="hover:text-ups-brown cursor-pointer">Global</span>
            <span className="hover:text-ups-brown cursor-pointer">English</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500 font-medium">
            <span className="hover:text-ups-brown cursor-pointer">Support</span>
            <span className="hover:text-ups-brown cursor-pointer">Locations</span>
          </div>
        </div>
      </div>

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-12">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img src={athLogo} alt="GSS Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tighter text-ups-brown leading-none">GSS</span>
                  <span className="text-[7px] sm:text-[8px] font-bold text-ups-brown/60 uppercase tracking-widest">Global Span Solutions</span>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link key={link.label} to={link.path} className="text-sm font-bold text-ups-brown hover:text-ups-yellow-dark transition-colors uppercase tracking-wider">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              {user && isStaff && (
                <Link to="/admin" className="hidden md:flex items-center gap-2 text-xs font-bold text-ups-brown bg-ups-yellow/20 px-4 py-2 rounded-xl border border-ups-yellow/30 hover:bg-ups-yellow/30 transition-all">
                  <Shield className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex flex-col items-end hidden md:flex">
                      <span className="text-sm font-bold text-ups-brown">{profile?.displayName || user.email?.split('@')[0]}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{profile?.role}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : null}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-ups-brown bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Slide-over Menu */}
        <div className={cn(
          "fixed inset-0 top-20 bg-white z-[100] lg:hidden transition-all duration-300 transform",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Main Navigation</p>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-ups-brown font-black uppercase tracking-widest text-sm hover:bg-ups-yellow/10 transition-colors"
                >
                  {link.label}
                  <Package className="w-4 h-4 opacity-40" />
                </Link>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              {user && isStaff && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 bg-ups-yellow/10 text-ups-brown rounded-2xl font-black uppercase tracking-widest text-sm border border-ups-yellow/20"
                >
                  <Shield className="w-5 h-5 text-ups-yellow-dark" />
                  Admin Control Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};


