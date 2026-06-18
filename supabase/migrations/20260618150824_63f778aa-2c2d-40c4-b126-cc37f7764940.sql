
REVOKE SELECT (access_password_hash) ON public.videos FROM anon, authenticated, PUBLIC;
REVOKE SELECT (access_password_hash) ON public.broadcasts FROM anon, authenticated, PUBLIC;

GRANT SELECT (id, title, slug, description, thumbnail_url, video_url, youtube_url, vimeo_url, speaker, duration, category_id, tags, publish_date, is_featured, is_published, display_order, view_count, seo_title, seo_description, created_at, updated_at, access_mode, price_espees) ON public.videos TO anon, authenticated;
GRANT SELECT (id, kind, title, slug, description, speaker, category, stream_type, stream_url, thumbnail_url, scheduled_start, scheduled_end, duration_seconds, viewer_count, registration_url, reminder_url, chat_enabled, chat_url, tags, is_live, is_featured, is_published, display_order, created_at, updated_at, access_mode, price_espees) ON public.broadcasts TO anon, authenticated;

DROP POLICY IF EXISTS "Profiles are viewable by anyone" ON public.profiles;
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Media public read" ON public.media_assets;
CREATE POLICY "Admins read media"
  ON public.media_assets FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "No client inserts on video_unlocks"
  ON public.video_unlocks FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY "No client updates on video_unlocks"
  ON public.video_unlocks FOR UPDATE TO authenticated, anon USING (false) WITH CHECK (false);
CREATE POLICY "No client deletes on video_unlocks"
  ON public.video_unlocks FOR DELETE TO authenticated, anon USING (false);

CREATE POLICY "No client inserts on broadcast_unlocks"
  ON public.broadcast_unlocks FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY "No client updates on broadcast_unlocks"
  ON public.broadcast_unlocks FOR UPDATE TO authenticated, anon USING (false) WITH CHECK (false);
CREATE POLICY "No client deletes on broadcast_unlocks"
  ON public.broadcast_unlocks FOR DELETE TO authenticated, anon USING (false);

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
