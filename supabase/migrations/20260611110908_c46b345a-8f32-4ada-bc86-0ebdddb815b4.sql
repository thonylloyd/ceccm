
-- Broadcasts table (live, upcoming, replay)
CREATE TABLE public.broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'upcoming', -- 'live' | 'upcoming' | 'replay'
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  speaker TEXT,
  category TEXT,
  stream_type TEXT, -- 'youtube' | 'vimeo' | 'facebook' | 'hls' | 'embed'
  stream_url TEXT,
  thumbnail_url TEXT,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  duration_seconds INT,
  viewer_count INT DEFAULT 0,
  registration_url TEXT,
  reminder_url TEXT,
  chat_enabled BOOLEAN DEFAULT FALSE,
  chat_url TEXT,
  tags TEXT[],
  is_live BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.broadcasts TO anon, authenticated;
GRANT ALL ON public.broadcasts TO service_role;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published broadcasts" ON public.broadcasts
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage broadcasts" ON public.broadcasts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_broadcasts_updated BEFORE UPDATE ON public.broadcasts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Channels
CREATE TABLE public.broadcast_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  watch_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.broadcast_channels TO anon, authenticated;
GRANT ALL ON public.broadcast_channels TO service_role;
ALTER TABLE public.broadcast_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read channels" ON public.broadcast_channels
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage channels" ON public.broadcast_channels
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_channels_updated BEFORE UPDATE ON public.broadcast_channels
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Stats
CREATE TABLE public.broadcast_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  suffix TEXT,
  icon TEXT,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.broadcast_stats TO anon, authenticated;
GRANT ALL ON public.broadcast_stats TO service_role;
ALTER TABLE public.broadcast_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stats" ON public.broadcast_stats
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage stats" ON public.broadcast_stats
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_stats_updated BEFORE UPDATE ON public.broadcast_stats
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Subscribers
CREATE TABLE public.broadcast_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  country TEXT,
  preferences TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.broadcast_subscribers TO anon, authenticated;
GRANT ALL ON public.broadcast_subscribers TO service_role;
ALTER TABLE public.broadcast_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.broadcast_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read subscribers" ON public.broadcast_subscribers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
