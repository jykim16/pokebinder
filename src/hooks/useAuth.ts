import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [authTrigger, setAuthTrigger] = useState(0);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Check if we're in demo mode from localStorage first
        const demoMode = localStorage.getItem('demo_mode') === 'true';
        console.log('Demo mode check:', demoMode);
        
        if (demoMode) {
          console.log('Initializing demo mode...');
          if (mounted) {
            setIsDemoMode(true);
            setDemoUser();
            setLoading(false);
          }
          return;
        }

        // Reset demo mode if not in localStorage
        if (mounted) {
          setIsDemoMode(false);
        }

        // Only try Supabase if we have the environment variables
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          console.log('No Supabase config, setting loading to false');
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        // Get initial session with timeout
        console.log('Getting initial session...');
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session fetch timeout')), 10000); // 10 second timeout
        });

        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('Initial session:', session ? 'found' : 'not found');

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User found, fetching profile...');
            await fetchProfile(session.user.id);
          } else {
            console.log('No user, setting loading to false');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes only if Supabase is available and not in demo mode
    let subscription: any = null;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const demoMode = localStorage.getItem('demo_mode') === 'true';
    
    if (supabaseUrl && supabaseKey && !demoMode) {
      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('Auth state change: User found, fetching profile...');
          await fetchProfile(session.user.id);
        } else {
          console.log('Auth state change: No user, clearing profile and setting loading to false');
          setProfile(null);
          setLoading(false);
        }
      });
      
      subscription = authSubscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [authTrigger]);

  const setDemoUser = () => {
    console.log('Setting demo user...');
    const demoUser = {
      id: 'demo-user-id',
      email: 'demo@example.com',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { name: 'Demo User' }
    } as User;

    const demoProfile = {
      id: 'demo-user-id',
      email: 'demo@example.com',
      name: 'Demo User',
      avatar_url: undefined,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    } as Profile;

    setUser(demoUser);
    setProfile(demoProfile);
    console.log('Demo user set successfully');
  };

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Reduced timeout to 5 seconds and added better error handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000); // 5 second timeout
      });

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const result = await Promise.race([fetchPromise, timeoutPromise]);
      const { data, error } = result as any;

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...');
          await createProfile(userId);
        } else {
          console.error('Profile fetch failed with error:', error.message);
          // For other errors, set profile to null and continue
          setProfile(null);
        }
      } else if (data) {
        console.log('Profile fetched successfully');
        setProfile(data);
      } else {
        console.log('No profile data returned');
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // If it's a timeout or connection error, try to create a basic profile
      if (error instanceof Error && error.message.includes('timeout')) {
        console.log('Profile fetch timed out, attempting to create profile...');
        await createProfile(userId);
      } else {
        setProfile(null);
      }
    } finally {
      console.log('Setting loading to false after profile fetch');
      setLoading(false);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      console.log('Creating profile for user:', userId);
      
      // Get user data with timeout that resolves gracefully instead of rejecting
      const userPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve({ data: { user: null } }), 10000); // Resolve with null user data instead of rejecting
      });

      const { data: userData } = await Promise.race([userPromise, timeoutPromise]) as any;
      
      if (userData?.user) {
        const newProfile = {
          id: userData.user.id,
          email: userData.user.email || '',
          name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'User',
          avatar_url: userData.user.user_metadata?.avatar_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Create profile with timeout
        const createPromise = supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
          
        const createTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Profile creation timeout')), 5000); // 5 second timeout
        });
        
        const { data: createdProfile, error: createError } = await Promise.race([createPromise, createTimeoutPromise]) as any;
        
        if (!createError && createdProfile) {
          console.log('Profile created successfully');
          setProfile(createdProfile);
        } else {
          console.error('Error creating profile:', createError);
          // Create a minimal local profile if database creation fails
          setProfile({
            id: userId,
            email: userData.user.email || '',
            name: userData.user.user_metadata?.name || 'User',
            avatar_url: userData.user.user_metadata?.avatar_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } else {
        console.log('No user data available for profile creation (timeout or no user)');
        // Create a minimal profile with just the user ID
        setProfile({
          id: userId,
          email: '',
          name: 'User',
          avatar_url: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error in profile creation process:', error);
      // Create a minimal fallback profile
      setProfile({
        id: userId,
        email: '',
        name: 'User',
        avatar_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return { data: null, error: { message: 'Authentication service not configured' } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: { message: 'Sign up failed' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return { data: null, error: { message: 'Authentication service not configured' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: { message: 'Sign in failed' } };
    }
  };

  const signInDemo = async () => {
    console.log('Signing in demo user...');
    
    // Set demo mode in localStorage
    localStorage.setItem('demo_mode', 'true');
    
    // Trigger re-initialization of auth hook
    setAuthTrigger(prev => prev + 1);
    
    console.log('Demo login completed successfully');
    return { data: null, error: null };
  };

  const signOut = async () => {
    if (isDemoMode) {
      console.log('Signing out demo user...');
      // Clear demo mode
      localStorage.removeItem('demo_mode');
      setIsDemoMode(false);
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      // Trigger re-initialization to ensure clean state
      setAuthTrigger(prev => prev + 1);
      return { error: null };
    }

    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setProfile(null);
        setSession(null);
      }
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      // Force local logout even if remote logout fails
      setUser(null);
      setProfile(null);
      setSession(null);
      return { error: null };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    if (isDemoMode) {
      // Update demo profile locally
      if (profile) {
        const updatedProfile = { ...profile, ...updates };
        setProfile(updatedProfile);
      }
      return { data: profile, error: null };
    }

    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return { data: null, error: { message: 'Authentication service not configured' } };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (!error && data) {
        setProfile(data);
      }

      return { data, error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error: { message: 'Profile update failed' } };
    }
  };

  return {
    user,
    profile,
    session,
    loading,
    isDemoMode,
    signUp,
    signIn,
    signInDemo,
    signOut,
    updateProfile,
  };
}