
CREATE TABLE public.portal_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX portal_notifications_user_created_idx ON public.portal_notifications (user_id, created_at DESC);

GRANT SELECT, UPDATE, DELETE ON public.portal_notifications TO authenticated;
GRANT ALL ON public.portal_notifications TO service_role;

ALTER TABLE public.portal_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own notifications" ON public.portal_notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "update own notifications" ON public.portal_notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own notifications" ON public.portal_notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
