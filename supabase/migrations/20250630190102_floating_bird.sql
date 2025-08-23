/*
  # Pokemon Card Collection Database Schema

  1. New Tables
    - `profiles` - User profile information (extends Supabase auth.users)
    - `pokemon_cards` - Master database of all Pokemon cards
    - `card_varieties` - Different versions/rarities of each card
    - `user_cards` - User's card collection with personal details
    - `card_photos` - Personal photos uploaded by users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access to pokemon_cards and card_varieties for browsing

  3. Functions
    - Trigger to create profile on user signup
    - Function to get user's collection with card details
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Pokemon cards master database
CREATE TABLE IF NOT EXISTS pokemon_cards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  hp TEXT,
  set_name TEXT,
  card_number TEXT,
  image_url TEXT,
  tcg_player_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pokemon_cards ENABLE ROW LEVEL SECURITY;

-- Card varieties (different rarities, special editions, etc.)
CREATE TABLE IF NOT EXISTS card_varieties (
  id SERIAL PRIMARY KEY,
  card_id INTEGER REFERENCES pokemon_cards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  image_url TEXT,
  market_value DECIMAL(10,2) DEFAULT 0,
  tcg_player_variety_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE card_varieties ENABLE ROW LEVEL SECURITY;

-- User's card collection
CREATE TABLE IF NOT EXISTS user_cards (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  card_id INTEGER REFERENCES pokemon_cards(id) ON DELETE CASCADE,
  variety_id INTEGER REFERENCES card_varieties(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  condition TEXT DEFAULT 'Near Mint' CHECK (condition IN ('Mint', 'Near Mint', 'Excellent', 'Good', 'Light Play', 'Moderate Play', 'Heavy Play', 'Damaged')),
  date_acquired DATE DEFAULT CURRENT_DATE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;

-- Personal photos of cards
CREATE TABLE IF NOT EXISTS card_photos (
  id SERIAL PRIMARY KEY,
  user_card_id INTEGER REFERENCES user_cards(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE card_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Pokemon cards: Public read access
CREATE POLICY "Anyone can read pokemon cards"
  ON pokemon_cards
  FOR SELECT
  TO authenticated
  USING (true);

-- Card varieties: Public read access
CREATE POLICY "Anyone can read card varieties"
  ON card_varieties
  FOR SELECT
  TO authenticated
  USING (true);

-- User cards: Users can manage their own cards
CREATE POLICY "Users can read own cards"
  ON user_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards"
  ON user_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards"
  ON user_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards"
  ON user_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Card photos: Users can manage photos of their own cards
CREATE POLICY "Users can read own card photos"
  ON card_photos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_cards 
      WHERE user_cards.id = card_photos.user_card_id 
      AND user_cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own card photos"
  ON card_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_cards 
      WHERE user_cards.id = card_photos.user_card_id 
      AND user_cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own card photos"
  ON card_photos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_cards 
      WHERE user_cards.id = card_photos.user_card_id 
      AND user_cards.user_id = auth.uid()
    )
  );

-- Function to handle user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_cards_updated_at
  BEFORE UPDATE ON user_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();