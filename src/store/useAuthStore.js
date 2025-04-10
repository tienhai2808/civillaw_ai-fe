import { createClient } from '@supabase/supabase-js';
import { create } from 'zustand';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const extractUserInfo = (session) => {
  if (!session || !session.user) return null;
  return {
    id: session.user.id,
    full_name: session.user.user_metadata?.full_name || 'Unknown',
    email: session.user.email || '',
    avatar_url: session.user.user_metadata.avatar_url || '',
  };
};

const saveUserInfoToLocalStorage = (userInfo) => {
  if (userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  } else {
    localStorage.removeItem('userInfo');
  }
};

const getUserInfoFromLocalStorage = () => {
  const storedUserInfo = localStorage.getItem('userInfo');
  return storedUserInfo ? JSON.parse(storedUserInfo) : null;
};

export const useAuthStore = create((set) => ({
  session: null,
  userInfo: null, 
  loading: true,
  error: null,

  initializeAuth: async () => {
    try {
      set({ loading: true });

      const cachedUserInfo = getUserInfoFromLocalStorage();
      if (cachedUserInfo) {
        set({ userInfo: cachedUserInfo }); 
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      const userInfo = extractUserInfo(session);
      set({ session, userInfo, loading: false });
      saveUserInfoToLocalStorage(userInfo);
    } catch (error) {
      console.error('Error initializing auth:', error.message);
      set({ loading: false, error: error.message });
      saveUserInfoToLocalStorage(null);
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      const userInfo = extractUserInfo(session);
      set({ session, userInfo });
      saveUserInfoToLocalStorage(userInfo);
    });
  },

  signInWithOAuth: async (provider, redirectTo) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || 'http://localhost:3000/my-profile',
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error(`${provider} sign-in error:`, error.message);
      set({ loading: false, error: error.message });
    }
  },

  signInWithGoogle: (redirectTo) => useAuthStore.getState().signInWithOAuth('google', redirectTo),
  signInWithGitHub: (redirectTo) => useAuthStore.getState().signInWithOAuth('github', redirectTo),

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, userInfo: null, loading: false });
      saveUserInfoToLocalStorage(null); 
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error.message);
      set({ loading: false, error: error.message });
    }
  },

  supabase,
}));

useAuthStore.getState().initializeAuth();