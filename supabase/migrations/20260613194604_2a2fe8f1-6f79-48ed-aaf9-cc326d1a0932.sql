
-- Praise reports (homepage testimonials)
CREATE TABLE public.praise_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text,
  role text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.praise_reports TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.praise_reports TO authenticated;
GRANT ALL ON public.praise_reports TO service_role;
ALTER TABLE public.praise_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "praise_reports public read" ON public.praise_reports FOR SELECT USING (is_active = true);
CREATE POLICY "praise_reports admin manage" ON public.praise_reports FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_praise_reports_updated_at BEFORE UPDATE ON public.praise_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Leadership team
CREATE TABLE public.leadership (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text,
  message text,
  photo_url text,
  is_featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.leadership TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leadership TO authenticated;
GRANT ALL ON public.leadership TO service_role;
ALTER TABLE public.leadership ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leadership public read" ON public.leadership FOR SELECT USING (is_active = true);
CREATE POLICY "leadership admin manage" ON public.leadership FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_leadership_updated_at BEFORE UPDATE ON public.leadership
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Access controls on videos
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS access_mode text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS access_password_hash text,
  ADD COLUMN IF NOT EXISTS price_espees numeric;

-- Access controls on broadcasts
ALTER TABLE public.broadcasts
  ADD COLUMN IF NOT EXISTS access_mode text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS access_password_hash text,
  ADD COLUMN IF NOT EXISTS price_espees numeric;

-- Per-user unlocks for videos
CREATE TABLE public.video_unlocks (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  method text NOT NULL DEFAULT 'password',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);
GRANT SELECT ON public.video_unlocks TO authenticated;
GRANT ALL ON public.video_unlocks TO service_role;
ALTER TABLE public.video_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "video_unlocks owner read" ON public.video_unlocks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Per-user unlocks for broadcasts
CREATE TABLE public.broadcast_unlocks (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  broadcast_id uuid NOT NULL REFERENCES public.broadcasts(id) ON DELETE CASCADE,
  method text NOT NULL DEFAULT 'password',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, broadcast_id)
);
GRANT SELECT ON public.broadcast_unlocks TO authenticated;
GRANT ALL ON public.broadcast_unlocks TO service_role;
ALTER TABLE public.broadcast_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "broadcast_unlocks owner read" ON public.broadcast_unlocks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Seed praise reports
INSERT INTO public.praise_reports (quote, author, role, display_order) VALUES
('Before The Church Consolidation Mission came to our zone, only 20% of us were involved in soul winning and other activities in the Church. After the Church Consolidation Mission Conference, our church built its new children''s Church in 6 weeks — all with member-volunteers. We''re not the same.', 'Pst. Emeka', 'CE Lagos Zone 4', 0),
('I used to just drop my offerings. During the Church Consolidation Conference, I was taught the ''why'' of giving. I''m now a monthly partner and my business has trippled. God honors partnership.', 'Dcns. Grace A.', 'Partner', 1),
('I was about to leave the Church quietly. The Members Recovery Team noticed, visited, and listened. That one visit saved my family''s faith.', 'Bro. James', 'Member', 2);

-- Seed leadership
INSERT INTO public.leadership (name, position, message, is_featured, display_order) VALUES
('Pastor Chris Oyakhilome D.Sc D.Sc D.D', 'President, Loveworld Nation', 'The Church is the body of Christ — every member matters, every member is significant.', true, 1),
('CCM Director', 'Director, Church Consolidation Mission', 'We are committed to strengthening every church and equipping every member for impactful service.', false, 0),
('CCM Coordinator', 'Global Coordinator', 'Together we are consolidating the Body of Christ in this final hour.', false, 2);
