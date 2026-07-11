
ALTER TYPE public.app_role RENAME VALUE 'super_admin' TO 'site_maintenance';
ALTER TYPE public.app_role RENAME VALUE 'viewer' TO 'super_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'member';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'zonal_pastor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'group_pastor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'church_pastor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'external_pastor';
