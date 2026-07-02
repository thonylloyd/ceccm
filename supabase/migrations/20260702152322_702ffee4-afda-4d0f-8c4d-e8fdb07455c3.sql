
-- 1. Rename enum values: old admin -> super_admin, old editor -> admin
ALTER TYPE public.app_role RENAME VALUE 'admin' TO 'super_admin';
ALTER TYPE public.app_role RENAME VALUE 'editor' TO 'admin';

-- 2. Helpers
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'super_admin')
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','super_admin'))
$$;

-- 3. Permissions catalog
CREATE TABLE public.permissions (
  key text PRIMARY KEY,
  label text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.permissions TO authenticated;
GRANT ALL ON public.permissions TO service_role;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "permissions authed read" ON public.permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "permissions super admin manage" ON public.permissions FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

INSERT INTO public.permissions (key, label, sort_order) VALUES
  ('dashboard','Dashboard',10),
  ('homepage','Homepage',20),
  ('about','About',30),
  ('programs','Programs',40),
  ('livestream','Livestream',50),
  ('contact','Contact',60),
  ('navigation','Navigation',70),
  ('media','Media Library',80),
  ('videos','Videos',90),
  ('users','Users',100),
  ('salvation_leads','Salvation Leads',110),
  ('settings','Settings',120),
  ('permissions','Permissions',130);

-- 4. Role → Permission mapping
CREATE TABLE public.role_permissions (
  role app_role NOT NULL,
  permission_key text NOT NULL REFERENCES public.permissions(key) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role, permission_key)
);
GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "role_permissions authed read" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "role_permissions super admin manage" ON public.role_permissions FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- Seed: admin role gets everything except permissions management
INSERT INTO public.role_permissions (role, permission_key)
SELECT 'admin'::app_role, key FROM public.permissions WHERE key <> 'permissions';

-- 5. has_permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _key text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    public.is_super_admin(_user_id)
    OR EXISTS (
      SELECT 1 FROM public.role_permissions rp
      JOIN public.user_roles ur ON ur.role = rp.role
      WHERE ur.user_id = _user_id AND rp.permission_key = _key
    )
$$;

-- 6. Update existing "admin" policies to accept both admin and super_admin.
-- user_roles: only super_admin can manage; both can read.
DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "user_roles admin read" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "user_roles super admin manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- Rewrite every other policy that used has_role(..., 'admin') to use is_admin()
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND qual LIKE '%has_role(auth.uid(), ''super_admin''::app_role)%'
      AND tablename NOT IN ('user_roles','permissions','role_permissions')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()))',
      r.policyname, r.tablename
    );
  END LOOP;
END $$;
