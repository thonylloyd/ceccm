
CREATE TABLE public.salvation_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.salvation_leads TO authenticated;
GRANT INSERT ON public.salvation_leads TO anon;
GRANT ALL ON public.salvation_leads TO service_role;
ALTER TABLE public.salvation_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit lead" ON public.salvation_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read leads" ON public.salvation_leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leads" ON public.salvation_leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (key, value)
VALUES ('salvation', '{"video_url":"","enabled":true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
