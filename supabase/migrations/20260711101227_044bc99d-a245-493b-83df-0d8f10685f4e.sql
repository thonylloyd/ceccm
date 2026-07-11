
REVOKE EXECUTE ON FUNCTION public.can_view_report(uuid, uuid, uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.can_submit_report_for(uuid, uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.can_view_report(uuid, uuid, uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_submit_report_for(uuid, uuid) TO authenticated, service_role;
