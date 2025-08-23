import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if environment variables are available
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    supabase = null;
  }
}

if (!supabase) {
  // Create a mock client for demo mode
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          })
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
          ascending: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } })
          })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } })
        })
      })
    }),
    channel: () => ({
      on: () => ({
        subscribe: () => {}
      })
    })
  };
}

export { supabase };

// Database types
export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PokemonCardDB {
  id: number;
  name: string;
  type: string;
  hp: string;
  set_name: string;
  card_number: string;
  image_url: string;
  tcg_player_id?: string;
  created_at: string;
}

export interface CardVarietyDB {
  id: number;
  card_id: number;
  name: string;
  rarity: string;
  image_url: string;
  market_value: number;
  tcg_player_variety_id?: string;
  created_at: string;
}

export interface UserCardDB {
  id: number;
  user_id: string;
  card_id: number;
  variety_id: number;
  quantity: number;
  condition: string;
  date_acquired: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CardPhotoDB {
  id: number;
  user_card_id: number;
  photo_url: string;
  uploaded_at: string;
}

// Combined types for frontend use
export interface CardWithVarieties extends PokemonCardDB {
  varieties: CardVarietyDB[];
}

export interface UserCardWithDetails extends UserCardDB {
  pokemon_card: PokemonCardDB;
  card_variety: CardVarietyDB;
  card_photos: CardPhotoDB[];
}