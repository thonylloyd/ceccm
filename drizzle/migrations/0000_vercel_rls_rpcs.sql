CREATE OR REPLACE FUNCTION public.verify_video_password(_slug text, _hash text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.videos
    WHERE slug = _slug AND access_password_hash IS NOT NULL AND access_password_hash = _hash
      AND access_mode IN ('password','password_paid'));
$$;

CREATE OR REPLACE FUNCTION public.verify_broadcast_password(_id uuid, _hash text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.broadcasts
    WHERE id = _id AND access_password_hash IS NOT NULL AND access_password_hash = _hash
      AND access_mode IN ('password','password_paid'));
$$;

CREATE OR REPLACE FUNCTION public.record_video_espees_unlock(_video_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.videos WHERE id = _video_id AND access_mode IN ('paid','password_paid')) THEN
    RAISE EXCEPTION 'Not for sale';
  END IF;
  INSERT INTO public.video_unlocks (user_id, video_id, method) VALUES (auth.uid(), _video_id, 'espees')
  ON CONFLICT (user_id, video_id, method) DO NOTHING;
END $$;

CREATE OR REPLACE FUNCTION public.record_broadcast_espees_unlock(_broadcast_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.broadcasts WHERE id = _broadcast_id AND access_mode IN ('paid','password_paid')) THEN
    RAISE EXCEPTION 'Not for sale';
  END IF;
  INSERT INTO public.broadcast_unlocks (user_id, broadcast_id, method) VALUES (auth.uid(), _broadcast_id, 'espees')
  ON CONFLICT (user_id, broadcast_id, method) DO NOTHING;
END $$;

CREATE OR REPLACE FUNCTION public.admin_get_video_password(_id uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE p text;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  SELECT access_password_plain INTO p FROM public.videos WHERE id = _id;
  RETURN p;
END $$;

CREATE OR REPLACE FUNCTION public.admin_set_content_password(_kind text, _id uuid, _hash text, _plain text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF _kind = 'video' THEN
    UPDATE public.videos SET access_password_hash = _hash, access_password_plain = _plain WHERE id = _id;
  ELSIF _kind = 'broadcast' THEN
    UPDATE public.broadcasts SET access_password_hash = _hash WHERE id = _id;
  ELSE RAISE EXCEPTION 'Invalid kind'; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.notify_admins_report_submitted()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  INSERT INTO public.portal_notifications (user_id, type, title, body, link)
  SELECT DISTINCT user_id, 'report_submitted', 'New weekly report submitted',
         'A pastor submitted a weekly report for review.', '/portal/reports'
  FROM public.user_roles WHERE role IN ('admin','site_maintenance','super_admin');
END $$;

CREATE OR REPLACE FUNCTION public.notify_report_approved(_report_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  INSERT INTO public.portal_notifications (user_id, type, title, body, link)
  SELECT reporter_id, 'report_approved', 'Your weekly report was approved',
         'Report for week starting ' || week_start || ' has been approved.', '/portal/reports'
  FROM public.weekly_reports WHERE id = _report_id AND reporter_id IS NOT NULL;
END $$;

REVOKE ALL ON FUNCTION public.verify_video_password(text,text), public.verify_broadcast_password(uuid,text),
  public.record_video_espees_unlock(uuid), public.record_broadcast_espees_unlock(uuid),
  public.admin_get_video_password(uuid), public.admin_set_content_password(text,uuid,text,text),
  public.notify_admins_report_submitted(), public.notify_report_approved(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_video_password(text,text), public.verify_broadcast_password(uuid,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_video_espees_unlock(uuid), public.record_broadcast_espees_unlock(uuid),
  public.admin_get_video_password(uuid), public.admin_set_content_password(text,uuid,text,text),
  public.notify_admins_report_submitted(), public.notify_report_approved(uuid) TO authenticated;

DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Super admins update profiles" ON public.profiles;
CREATE POLICY "Super admins update profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins upload media" ON storage.objects;
CREATE POLICY "Admins upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin(auth.uid()));