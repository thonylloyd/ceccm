import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PASTOR_ROLES = ["zonal_pastor", "group_pastor", "church_pastor", "external_pastor"] as const;

export const getPortalSession = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: rolesData } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const roles = (rolesData ?? []).map((r: any) => r.role as string);

    const isSiteMaintenance = roles.includes("site_maintenance");
    const isAdmin = roles.includes("admin") || roles.includes("super_admin") || isSiteMaintenance;
    const isZonalPastor = roles.includes("zonal_pastor");
    const isGroupPastor = roles.includes("group_pastor");
    const isChurchPastor = roles.includes("church_pastor");
    const isExternalPastor = roles.includes("external_pastor");
    const isPastor = isZonalPastor || isGroupPastor || isChurchPastor || isExternalPastor;
    const isMember = roles.includes("member") || roles.length === 0;

    return {
      userId,
      roles,
      isSiteMaintenance,
      isAdmin,
      isPastor,
      isExternalPastor,
      isZonalPastor,
      isGroupPastor,
      isChurchPastor,
      isMember,
      hasPortalAccess: isSiteMaintenance || isAdmin || isPastor,
    };
  });

export const getPortalOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const [zones, groups, churches] = await Promise.all([
      supabase.from("zones").select("id", { count: "exact", head: true }),
      supabase.from("group_churches").select("id", { count: "exact", head: true }),
      supabase.from("churches").select("id", { count: "exact", head: true }),
    ]);
    return {
      zoneCount: zones.count ?? 0,
      groupCount: groups.count ?? 0,
      churchCount: churches.count ?? 0,
    };
  });

export { PASTOR_ROLES };
