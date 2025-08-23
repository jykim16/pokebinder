/*
  # Fix Authentication Database Setup

  1. Fix the handle_new_user function to properly create profiles
  2. Update RLS policies for better authentication flow
  3. Ensure triggers work correctly for user signup

  This migration fixes the authentication issues without creating fake users.
*/

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies to ensure they work correctly
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

-- Create comprehensive RLS policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow service role to insert profiles (needed for the trigger)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Ensure the profiles table has proper constraints
ALTER TABLE public.profiles 
  ALTER COLUMN name SET NOT NULL;

-- Make sure email is properly handled
ALTER TABLE public.profiles 
  ALTER COLUMN email SET DEFAULT '';