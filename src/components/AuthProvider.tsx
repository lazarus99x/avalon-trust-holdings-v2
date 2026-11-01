import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  /** Set when the users row could not be read (RLS / privileges / network), so the UI can say why instead of bouncing. */
  profileError: string | null;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileError: null,
  isAdmin: false,
  isStaff: false,
});

const PROFILE_ATTEMPTS = 3;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // uid whose profile is already loaded - keeps token-refresh events from
  // re-fetching (and from flashing the loading spinner).
  const loadedUid = useRef<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (uid: string): Promise<boolean> => {
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= PROFILE_ATTEMPTS; attempt++) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', uid)
        .single();

      if (data) {
        setProfile({
          uid: data.uid,
          email: data.email,
          role: data.role as UserRole,
          displayName: data.display_name,
          photoURL: data.photo_url,
        });
        setProfileError(null);
        return true;
      }

      // PGRST116 = no row for this uid. Retrying will not help, so surface it.
      if (error?.code === 'PGRST116') {
        setProfile(null);
        setProfileError('No row in public.users for this account.');
        return false;
      }

      lastError = error?.message || 'Could not read public.users';
      console.error(`Profile fetch attempt ${attempt}/${PROFILE_ATTEMPTS} failed:`, error);
      if (attempt < PROFILE_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
      }
    }

    setProfile(null);
    setProfileError(lastError);
    return false;
  };

  const handleSession = async (session: Session | null) => {
    if (session?.user) {
      setUser(session.user);
      if (loadedUid.current === session.user.id) return;

      setLoading(true);
      const ok = await loadProfile(session.user.id);
      if (ok) loadedUid.current = session.user.id;
      setLoading(false);
    } else {
      loadedUid.current = null;
      setUser(null);
      setProfile(null);
      setProfileError(null);
      setLoading(false);
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isStaff = profile?.role === 'staff' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, profile, loading, profileError, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
