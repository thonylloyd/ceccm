CREATE TABLE public.video_comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.video_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_comments TO authenticated;
GRANT ALL ON public.video_comments TO service_role;
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments" ON public.video_comments FOR SELECT USING (true);
CREATE POLICY "Authed can insert own comment" ON public.video_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comment" ON public.video_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comment" ON public.video_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX video_comments_video_idx ON public.video_comments(video_id, created_at DESC);
CREATE OR REPLACE FUNCTION public.video_comments_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER video_comments_set_updated_at BEFORE UPDATE ON public.video_comments
  FOR EACH ROW EXECUTE FUNCTION public.video_comments_touch_updated_at();