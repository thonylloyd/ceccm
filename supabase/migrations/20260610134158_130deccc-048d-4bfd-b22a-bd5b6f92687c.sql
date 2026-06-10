
-- Fix storage upload: has_role used by storage policies must be EXECUTE-able
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

-- Programs location
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS location text;

-- Video categories
CREATE TABLE IF NOT EXISTS public.video_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.video_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_categories TO authenticated;
GRANT ALL ON public.video_categories TO service_role;
ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.video_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.video_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_video_categories_updated BEFORE UPDATE ON public.video_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Videos
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  thumbnail_url text,
  video_url text,
  youtube_url text,
  vimeo_url text,
  speaker text,
  duration text,
  category_id uuid REFERENCES public.video_categories(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  publish_date date,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  view_count int NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Videos public read" ON public.videos FOR SELECT USING (is_published);
CREATE POLICY "Admins manage videos" ON public.videos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_videos_updated BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON public.videos(is_featured) WHERE is_featured;

-- Video CTA strip
CREATE TABLE IF NOT EXISTS public.video_cta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_visible boolean NOT NULL DEFAULT true,
  title text,
  description text,
  button_text text,
  button_url text,
  background_color text DEFAULT '#041E4A',
  text_color text DEFAULT '#FFFFFF',
  icon text,
  open_new_tab boolean NOT NULL DEFAULT false,
  start_date timestamptz,
  end_date timestamptz,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.video_cta TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_cta TO authenticated;
GRANT ALL ON public.video_cta TO service_role;
ALTER TABLE public.video_cta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CTA public read" ON public.video_cta FOR SELECT USING (is_visible);
CREATE POLICY "Admins manage cta" ON public.video_cta FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_video_cta_updated BEFORE UPDATE ON public.video_cta
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
