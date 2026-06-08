
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by anyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ UPDATED_AT HELPER ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============ HERO BANNERS ============
CREATE TABLE public.hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow TEXT DEFAULT 'Welcome to',
  heading TEXT NOT NULL,
  subheading TEXT,
  background_image_url TEXT,
  primary_cta_label TEXT,
  primary_cta_url TEXT,
  secondary_cta_label TEXT,
  secondary_cta_url TEXT,
  overlay_opacity NUMERIC DEFAULT 0.55,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_banners TO anon, authenticated;
GRANT ALL ON public.hero_banners TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.hero_banners TO authenticated;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hero banners public read" ON public.hero_banners FOR SELECT USING (true);
CREATE POLICY "Admins manage hero" ON public.hero_banners FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_hero_updated BEFORE UPDATE ON public.hero_banners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ MISSION CARDS ============
CREATE TABLE public.mission_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'globe',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mission_cards TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.mission_cards TO authenticated;
GRANT ALL ON public.mission_cards TO service_role;
ALTER TABLE public.mission_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mission cards public read" ON public.mission_cards FOR SELECT USING (true);
CREATE POLICY "Admins manage mission" ON public.mission_cards FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_mission_updated BEFORE UPDATE ON public.mission_cards FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ STATISTICS ============
CREATE TABLE public.statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.statistics TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.statistics TO authenticated;
GRANT ALL ON public.statistics TO service_role;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Statistics public read" ON public.statistics FOR SELECT USING (true);
CREATE POLICY "Admins manage stats" ON public.statistics FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_stats_updated BEFORE UPDATE ON public.statistics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PROGRAMS ============
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  event_type TEXT,
  image_url TEXT,
  registration_url TEXT,
  cta_label TEXT DEFAULT 'Register Now',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.programs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Programs public read" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Admins manage programs" ON public.programs FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_programs_updated BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ RESOURCE CARDS ============
CREATE TABLE public.resource_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cta_label TEXT DEFAULT 'Click Here',
  cta_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resource_cards TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.resource_cards TO authenticated;
GRANT ALL ON public.resource_cards TO service_role;
ALTER TABLE public.resource_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resource cards public read" ON public.resource_cards FOR SELECT USING (true);
CREATE POLICY "Admins manage resources" ON public.resource_cards FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_resources_updated BEFORE UPDATE ON public.resource_cards FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ NAVIGATION ============
CREATE TABLE public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  is_external BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.navigation_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.navigation_items TO authenticated;
GRANT ALL ON public.navigation_items TO service_role;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Navigation public read" ON public.navigation_items FOR SELECT USING (true);
CREATE POLICY "Admins manage nav" ON public.navigation_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_nav_updated BEFORE UPDATE ON public.navigation_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SITE SETTINGS (key/value) ============
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ MEDIA LIBRARY ============
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  folder TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media public read" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Admins manage media" ON public.media_assets FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
