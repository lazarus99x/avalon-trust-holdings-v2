import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { supabase } from './lib/supabase';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';

import { Admin } from './pages/Admin';
import { ShipmentDetail } from './pages/ShipmentDetail';
import { Solutions } from './pages/Solutions';
import { Support } from './pages/Support';
import { Tracking } from './pages/Tracking';
import { WorldMap } from './pages/WorldMap';
import { AdminSignup } from './pages/AdminSignup';

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ups-brown"></div>
  </div>
);

// Shown instead of silently bouncing the user back to "/" - the old redirect
// loop was indistinguishable from "login broken". This says exactly what the
// account is and what the DB returned.
const AccessDenied: React.FC = () => {
  const { user, profile, profileError } = useAuth();
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900">Admin access required</h1>
        <p className="text-sm text-gray-500 mt-2">
          You are signed in, but this account is not an admin.
        </p>

        <dl className="mt-6 text-left text-sm bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Signed in as</dt>
            <dd className="font-medium text-gray-900 break-all text-right">{user?.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Role</dt>
            <dd className="font-medium text-gray-900">{profile?.role ?? 'unknown'}</dd>
          </div>
          {profileError && (
            <div className="pt-2 border-t border-gray-200 text-red-600 break-words">
              {profileError}
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={signOut}
            disabled={busy}
            className="w-full bg-ups-brown text-ups-yellow py-3 rounded-xl font-semibold hover:bg-ups-brown/90 transition-all disabled:opacity-50"
          >
            {busy ? 'Signing out...' : 'Sign out'}
          </button>
          <a
            href="/"
            className="w-full text-ups-brown py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Back to site
          </a>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  // Wait for the session AND the profile row before deciding anything.
  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only. Role comes from the public.users row (never client metadata).
  if (!isAdmin) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/tracking/:id" element={<ShipmentDetail />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/support" element={<Support />} />
                <Route path="/worldmap" element={<WorldMap />} />
                {/* TEMPORARY: remove this route once the new admin account exists. */}
                <Route path="/admin-signup" element={<AdminSignup />} />

                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
