-- Insert sample influencers for testing
INSERT INTO public.influencers (name, follower_count, engagement_rate) VALUES
  ('Sarah Johnson', 150000, 4.2),
  ('Mike Chen', 89000, 6.8),
  ('Emma Rodriguez', 320000, 3.1),
  ('Alex Thompson', 45000, 8.5),
  ('Jessica Kim', 210000, 5.3),
  ('David Wilson', 78000, 7.2),
  ('Maria Garcia', 180000, 4.9),
  ('Ryan O''Connor', 95000, 6.1),
  ('Lisa Zhang', 260000, 3.8),
  ('James Miller', 120000, 5.7)
ON CONFLICT DO NOTHING;
