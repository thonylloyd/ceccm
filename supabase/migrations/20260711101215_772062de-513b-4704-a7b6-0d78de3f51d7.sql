
-- ============ Helpers for hierarchy visibility ============
CREATE OR REPLACE FUNCTION public.can_view_report(_user_id uuid, _church_id uuid, _group_church_id uuid, _zone_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    public.is_admin(_user_id)
    OR EXISTS (
      SELECT 1 FROM public.pastor_assignments pa
      WHERE pa.user_id = _user_id
        AND (
          (pa.role = 'church_pastor' AND pa.church_id = _church_id)
          OR (pa.role = 'group_pastor' AND pa.group_church_id = _group_church_id)
          OR (pa.role = 'zonal_pastor' AND pa.zone_id = _zone_id)
          OR (pa.role = 'external_pastor' AND pa.church_id = _church_id)
        )
    )
$$;

CREATE OR REPLACE FUNCTION public.can_submit_report_for(_user_id uuid, _church_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    public.is_admin(_user_id)
    OR EXISTS (
      SELECT 1 FROM public.pastor_assignments pa
      WHERE pa.user_id = _user_id
        AND pa.church_id = _church_id
        AND pa.role IN ('church_pastor','external_pastor','group_pastor','zonal_pastor')
    )
$$;

-- ============ Weekly reports ============
CREATE TABLE public.weekly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_uuid uuid,
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  church_id uuid REFERENCES public.churches(id) ON DELETE SET NULL,
  group_church_id uuid REFERENCES public.group_churches(id) ON DELETE SET NULL,
  zone_id uuid REFERENCES public.zones(id) ON DELETE SET NULL,
  week_start date NOT NULL,
  week_number int NOT NULL,
  month int NOT NULL,
  year int NOT NULL,
  status text NOT NULL DEFAULT 'draft', -- draft | submitted | approved
  -- Numerical growth
  new_converts int NOT NULL DEFAULT 0,
  water_baptized int NOT NULL DEFAULT 0,
  filled_with_spirit int NOT NULL DEFAULT 0,
  first_timers int NOT NULL DEFAULT 0,
  church_attendance int NOT NULL DEFAULT 0,
  cell_attendance int NOT NULL DEFAULT 0,
  tithers int NOT NULL DEFAULT 0,
  partners int NOT NULL DEFAULT 0,
  -- Membership effectiveness (added_this_week / current_total pairs)
  foundation_school_added int NOT NULL DEFAULT 0,
  foundation_school_total int NOT NULL DEFAULT 0,
  discipleship_added int NOT NULL DEFAULT 0,
  discipleship_total int NOT NULL DEFAULT 0,
  cell_leaders_added int NOT NULL DEFAULT 0,
  cell_leaders_total int NOT NULL DEFAULT 0,
  cell_members_added int NOT NULL DEFAULT 0,
  cell_members_total int NOT NULL DEFAULT 0,
  workers_added int NOT NULL DEFAULT 0,
  workers_total int NOT NULL DEFAULT 0,
  notes text,
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reporter_id, church_id, week_start)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_reports TO authenticated;
GRANT ALL ON public.weekly_reports TO service_role;

ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

-- View: own + hierarchy + admin
CREATE POLICY "reports view" ON public.weekly_reports FOR SELECT TO authenticated
USING (
  reporter_id = auth.uid()
  OR public.can_view_report(auth.uid(), church_id, group_church_id, zone_id)
);

-- Insert: own only, and must have submit rights for the church
CREATE POLICY "reports insert" ON public.weekly_reports FOR INSERT TO authenticated
WITH CHECK (
  reporter_id = auth.uid()
  AND public.can_submit_report_for(auth.uid(), church_id)
);

-- Update: reporter can edit while not approved; admins can always update
CREATE POLICY "reports update" ON public.weekly_reports FOR UPDATE TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (reporter_id = auth.uid() AND status <> 'approved')
)
WITH CHECK (
  public.is_admin(auth.uid())
  OR (reporter_id = auth.uid() AND status <> 'approved')
);

-- Delete: reporter own drafts, or admin
CREATE POLICY "reports delete" ON public.weekly_reports FOR DELETE TO authenticated
USING (
  public.is_admin(auth.uid())
  OR (reporter_id = auth.uid() AND status = 'draft')
);

CREATE TRIGGER weekly_reports_set_updated_at
BEFORE UPDATE ON public.weekly_reports
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX weekly_reports_reporter_idx ON public.weekly_reports(reporter_id);
CREATE INDEX weekly_reports_church_idx ON public.weekly_reports(church_id);
CREATE INDEX weekly_reports_group_idx ON public.weekly_reports(group_church_id);
CREATE INDEX weekly_reports_zone_idx ON public.weekly_reports(zone_id);
CREATE INDEX weekly_reports_week_idx ON public.weekly_reports(year, week_number);

-- ============ Seed permission keys ============
INSERT INTO public.permissions (key, label, description) VALUES
  ('reports:submit', 'Submit Weekly Reports', 'Create and submit weekly church reports'),
  ('reports:edit', 'Edit Weekly Reports', 'Edit own reports until approved'),
  ('reports:view', 'View Weekly Reports', 'View reports within hierarchy'),
  ('reports:approve', 'Approve Weekly Reports', 'Approve submitted reports'),
  ('reports:export', 'Export Weekly Reports', 'Export reports to CSV/Excel'),
  ('reports:delete', 'Delete Weekly Reports', 'Delete reports')
ON CONFLICT (key) DO NOTHING;
