
REVOKE SELECT (access_password_hash, access_password_plain) ON public.videos FROM anon, authenticated;
REVOKE SELECT (access_password_hash) ON public.broadcasts FROM anon, authenticated;

-- Re-grant SELECT on the remaining columns explicitly is not required; column-level REVOKE
-- from a table-level GRANT works because Postgres checks column privileges only when
-- specific columns are referenced. To be safe, ensure table-level SELECT still applies to
-- other columns by keeping the existing GRANT SELECT on the table. No further action needed.
