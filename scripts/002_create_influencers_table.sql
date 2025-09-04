-- Create influencers table (shared across all users for now)
CREATE TABLE IF NOT EXISTS public.influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  follower_count INTEGER NOT NULL DEFAULT 0,
  engagement_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (allow all authenticated users to read influencers)
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - all authenticated users can read influencers
CREATE POLICY "influencers_select_authenticated"
  ON public.influencers FOR SELECT
  TO authenticated
  USING (true);

-- Only allow inserts/updates/deletes by authenticated users (for future admin features)
CREATE POLICY "influencers_insert_authenticated"
  ON public.influencers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "influencers_update_authenticated"
  ON public.influencers FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "influencers_delete_authenticated"
  ON public.influencers FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_influencers_updated_at
    BEFORE UPDATE ON public.influencers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
