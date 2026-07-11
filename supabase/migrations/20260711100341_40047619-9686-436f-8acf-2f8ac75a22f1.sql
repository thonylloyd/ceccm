
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'site_maintenance') $$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('site_maintenance','admin','super_admin')) $$;

CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _key text)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.is_super_admin(_user_id)
    OR EXISTS (SELECT 1 FROM public.role_permissions rp JOIN public.user_roles ur ON ur.role = rp.role
      WHERE ur.user_id = _user_id AND rp.permission_key = _key)
$$;

CREATE OR REPLACE FUNCTION public.has_portal_access(_user_id uuid)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id
    AND role IN ('site_maintenance','super_admin','admin','zonal_pastor','group_pastor','church_pastor','external_pastor'))
$$;
REVOKE EXECUTE ON FUNCTION public.has_portal_access(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_portal_access(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.zones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.zones TO authenticated;
GRANT ALL ON public.zones TO service_role;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "zones public read" ON public.zones FOR SELECT USING (true);
CREATE POLICY "zones admin insert" ON public.zones FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "zones admin update" ON public.zones FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "zones admin delete" ON public.zones FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE TRIGGER zones_set_updated_at BEFORE UPDATE ON public.zones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.group_churches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  zone_id uuid REFERENCES public.zones(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (name, zone_id)
);
GRANT SELECT ON public.group_churches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_churches TO authenticated;
GRANT ALL ON public.group_churches TO service_role;
ALTER TABLE public.group_churches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gc public read" ON public.group_churches FOR SELECT USING (true);
CREATE POLICY "gc admin insert" ON public.group_churches FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "gc admin update" ON public.group_churches FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "gc admin delete" ON public.group_churches FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE TRIGGER gc_set_updated_at BEFORE UPDATE ON public.group_churches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.churches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  group_church_id uuid REFERENCES public.group_churches(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (name, group_church_id)
);
GRANT SELECT ON public.churches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.churches TO authenticated;
GRANT ALL ON public.churches TO service_role;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ch public read" ON public.churches FOR SELECT USING (true);
CREATE POLICY "ch admin insert" ON public.churches FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "ch admin update" ON public.churches FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "ch admin delete" ON public.churches FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE TRIGGER ch_set_updated_at BEFORE UPDATE ON public.churches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.pastor_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  zone_id uuid REFERENCES public.zones(id) ON DELETE CASCADE,
  group_church_id uuid REFERENCES public.group_churches(id) ON DELETE CASCADE,
  church_id uuid REFERENCES public.churches(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (role = 'zonal_pastor' AND zone_id IS NOT NULL)
    OR (role = 'group_pastor' AND group_church_id IS NOT NULL)
    OR (role = 'church_pastor' AND church_id IS NOT NULL)
    OR (role = 'external_pastor')
  )
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pastor_assignments TO authenticated;
GRANT ALL ON public.pastor_assignments TO service_role;
ALTER TABLE public.pastor_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pa authenticated read" ON public.pastor_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "pa admin insert" ON public.pastor_assignments FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "pa admin update" ON public.pastor_assignments FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "pa admin delete" ON public.pastor_assignments FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE TRIGGER pa_set_updated_at BEFORE UPDATE ON public.pastor_assignments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX pa_user_idx ON public.pastor_assignments(user_id);

INSERT INTO public.permissions (key, label, sort_order)
VALUES ('portal_access', 'Access Portal', 100),
       ('hierarchy', 'Church Hierarchy', 90)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.role_permissions (role, permission_key) VALUES
  ('super_admin', 'portal_access'),
  ('admin', 'portal_access'),
  ('zonal_pastor', 'portal_access'),
  ('group_pastor', 'portal_access'),
  ('church_pastor', 'portal_access'),
  ('external_pastor', 'portal_access')
ON CONFLICT DO NOTHING;
