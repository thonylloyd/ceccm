
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

ALTER TABLE public.group_churches ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.group_churches ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.group_churches ADD COLUMN IF NOT EXISTS description text;

ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.churches ADD COLUMN IF NOT EXISTS location text;

ALTER TABLE public.pastor_assignments ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.pastor_assignments ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
