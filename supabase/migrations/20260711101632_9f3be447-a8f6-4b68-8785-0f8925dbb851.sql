
CREATE TABLE IF NOT EXISTS public.portal_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  resource_type text NOT NULL DEFAULT 'document',
  file_url text,
  external_url text,
  thumbnail_url text,
  audience text NOT NULL DEFAULT 'all',
  tags text[] NOT NULL DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.portal_resources TO authenticated;
GRANT ALL ON public.portal_resources TO service_role;

ALTER TABLE public.portal_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portal users can view published resources"
  ON public.portal_resources FOR SELECT
  TO authenticated
  USING (
    (is_published AND public.has_portal_access(auth.uid()))
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can insert resources"
  ON public.portal_resources FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update resources"
  ON public.portal_resources FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete resources"
  ON public.portal_resources FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER portal_resources_updated_at
  BEFORE UPDATE ON public.portal_resources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.portal_resource_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES public.portal_resources(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.portal_resource_views TO authenticated;
GRANT ALL ON public.portal_resource_views TO service_role;

ALTER TABLE public.portal_resource_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can log their own views"
  ON public.portal_resource_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can see own views; admins see all"
  ON public.portal_resource_views FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_portal_resources_category ON public.portal_resources(category);
CREATE INDEX IF NOT EXISTS idx_portal_resources_audience ON public.portal_resources(audience);
CREATE INDEX IF NOT EXISTS idx_portal_resource_views_resource ON public.portal_resource_views(resource_id);

INSERT INTO public.permissions (key, label, description)
VALUES ('admin.resources.manage', 'Manage Portal Resources', 'Create, edit, delete resources in the Portal Resource Center')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.role_permissions (role, permission_key)
VALUES
  ('admin', 'admin.resources.manage'),
  ('site_maintenance', 'admin.resources.manage')
ON CONFLICT DO NOTHING;
