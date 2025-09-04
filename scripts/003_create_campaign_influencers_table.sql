-- Create junction table for campaign-influencer relationships
CREATE TABLE IF NOT EXISTS public.campaign_influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL REFERENCES public.influencers(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, influencer_id)
);

-- Enable RLS
ALTER TABLE public.campaign_influencers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - users can only manage assignments for their own campaigns
CREATE POLICY "campaign_influencers_select_own"
  ON public.campaign_influencers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE campaigns.id = campaign_influencers.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "campaign_influencers_insert_own"
  ON public.campaign_influencers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE campaigns.id = campaign_influencers.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "campaign_influencers_delete_own"
  ON public.campaign_influencers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE campaigns.id = campaign_influencers.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );
