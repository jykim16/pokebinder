/*
  # Add Price Update Logging Table

  1. New Tables
    - `price_update_logs` - Track automated price updates

  2. Security
    - Enable RLS on price_update_logs table
    - Add policies for service role access
*/

-- Create price update logs table
CREATE TABLE IF NOT EXISTS price_update_logs (
  id SERIAL PRIMARY KEY,
  updated_cards INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  update_timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'partial_success', 'failed')),
  error_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE price_update_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage logs
CREATE POLICY "Service role can manage price update logs"
  ON price_update_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read logs (for admin dashboard)
CREATE POLICY "Authenticated users can read price update logs"
  ON price_update_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_price_update_logs_timestamp ON price_update_logs(update_timestamp);
CREATE INDEX IF NOT EXISTS idx_price_update_logs_status ON price_update_logs(status);

-- Add updated_at column to card_varieties if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'card_varieties' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE card_varieties ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    
    -- Add trigger to update updated_at
    CREATE TRIGGER update_card_varieties_updated_at
      BEFORE UPDATE ON card_varieties
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;