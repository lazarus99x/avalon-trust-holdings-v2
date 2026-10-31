import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Mail, Lock, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';

// TEMPORARY. This route exists only so a new admin account can be created, then it is removed again.
//
// The public.users row is created by the on_auth_user_created DB trigger as role = 'customer'
// (the service-role API is not available in the browser, and RLS forbids a client writing
// role = 'admin'). Promote after signup with:
//     node scripts/create-admin.mjs "<this email>" "<password>"
// or by running supabase/fix-admin.sql with the new email.
export const AdminSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;

      setSuccess(
        'Account created. If the project requires email confirmation, use the Supabase dashboard to confirm it. ' +
        "Then promote it to admin with: node scripts/create-admin.mjs \"" + email + "\" \"<password>\""
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 bg-ups-brown text-ups-yellow text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-ups-yellow/20">
            <UserPlus className="text-ups-yellow w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create Admin Account</h1>
          <p className="text-ups-yellow/70 text-sm mt-2 font-medium">Temporary route. Removed again once the account exists.</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2 border border-red-100">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200 break-words">
              {success}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-ups-brown focus:border-transparent transition-all outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-ups-brown focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-ups-brown text-ups-yellow py-4 rounded-xl font-semibold hover:bg-ups-brown/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 border border-ups-yellow/10"
            >
              {loading ? 'Creating...' : 'Create Account'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account? <a href="/login" className="text-ups-brown underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};
