import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const AGG_FIELDS = [
  "new_converts","water_baptized","filled_with_spirit","first_timers",
  "church_attendance","cell_attendance","tithers","partners",
  "foundation_school_added","discipleship_added",
  "cell_leaders_added","cell_members_added","workers_added",
] as const;

/**
 * Analytics summary — respects RLS on weekly_reports (users only see rows they can view).
 * Returns aggregated totals + monthly trend for the requested year.
 */
export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { year?: number } | undefined) =>
    z.object({ year: z.number().int().min(2020).max(2100).optional() }).parse(d ?? {}),
  )
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const year = data.year ?? new Date().getUTCFullYear();

    const { data: rows, error } = await supabase
      .from("weekly_reports")
      .select("year, month, week_number, status, church_id, group_church_id, zone_id, " + AGG_FIELDS.join(", "))
      .eq("year", year);
    if (error) throw new Error(error.message);
    const reports = rows ?? [];

    const totals: Record<string, number> = {};
    for (const f of AGG_FIELDS) totals[f] = 0;
    const monthly: Record<number, Record<string, number>> = {};
    const churchTotals: Record<string, number> = {};

    for (const r of reports as any[]) {
      for (const f of AGG_FIELDS) totals[f] += Number(r[f] ?? 0);
      const m = r.month as number;
      monthly[m] ??= Object.fromEntries(AGG_FIELDS.map((f) => [f, 0]));
      for (const f of AGG_FIELDS) monthly[m][f] += Number(r[f] ?? 0);
      if (r.church_id) {
        churchTotals[r.church_id] = (churchTotals[r.church_id] ?? 0) + Number(r.new_converts ?? 0);
      }
    }

    const monthlyArr = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const row = monthly[m] ?? Object.fromEntries(AGG_FIELDS.map((f) => [f, 0]));
      return { month: m, ...row };
    });

    // Top churches by new converts (respects RLS)
    const churchIds = Object.keys(churchTotals);
    let churchNames: Record<string, string> = {};
    if (churchIds.length) {
      const { data: ch } = await supabase.from("churches").select("id, name").in("id", churchIds);
      churchNames = Object.fromEntries((ch ?? []).map((c: any) => [c.id, c.name]));
    }
    const topChurches = Object.entries(churchTotals)
      .map(([id, converts]) => ({ id, name: churchNames[id] ?? "Unknown", converts }))
      .sort((a, b) => b.converts - a.converts)
      .slice(0, 10);

    const submitted = reports.filter((r: any) => r.status === "submitted" || r.status === "approved").length;
    const drafts = reports.filter((r: any) => r.status === "draft").length;

    return {
      year,
      totals,
      monthly: monthlyArr,
      topChurches,
      reportCount: reports.length,
      submitted,
      drafts,
    };
  });

/**
 * My Team — hierarchy view of churches/pastors under the current user's scope.
 */
export const getMyTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Determine scope from my pastor_assignments
    const { data: myAssigns } = await supabase
      .from("pastor_assignments")
      .select("role, zone_id, group_church_id, church_id")
      .eq("user_id", userId);

    const zoneIds = new Set<string>();
    const groupIds = new Set<string>();
    const churchIds = new Set<string>();
    for (const a of myAssigns ?? []) {
      if (a.role === "zonal_pastor" && a.zone_id) zoneIds.add(a.zone_id);
      if (a.role === "group_pastor" && a.group_church_id) groupIds.add(a.group_church_id);
      if ((a.role === "church_pastor" || a.role === "external_pastor") && a.church_id) churchIds.add(a.church_id);
    }

    // Expand zones -> group churches -> churches
    let groups: any[] = [];
    if (zoneIds.size) {
      const { data } = await supabase.from("group_churches").select("id, name, zone_id").in("zone_id", [...zoneIds]);
      groups = data ?? [];
      groups.forEach((g) => groupIds.add(g.id));
    }
    let churches: any[] = [];
    if (groupIds.size) {
      const { data } = await supabase.from("churches").select("id, name, group_church_id").in("group_church_id", [...groupIds]);
      (data ?? []).forEach((c: any) => churchIds.add(c.id));
      churches = data ?? [];
    }
    if (churchIds.size) {
      const { data } = await supabase.from("churches").select("id, name, group_church_id").in("id", [...churchIds]);
      churches = [...churches, ...(data ?? [])];
    }
    // Dedupe churches
    const churchMap = new Map(churches.map((c: any) => [c.id, c]));
    churches = [...churchMap.values()];

    // Pastors assigned within scope
    const scopeChurchIds = [...churchIds];
    const scopeGroupIds = [...groupIds];
    const scopeZoneIds = [...zoneIds];

    let pastors: any[] = [];
    if (scopeChurchIds.length || scopeGroupIds.length || scopeZoneIds.length) {
      const filters: string[] = [];
      if (scopeChurchIds.length) filters.push(`church_id.in.(${scopeChurchIds.join(",")})`);
      if (scopeGroupIds.length) filters.push(`group_church_id.in.(${scopeGroupIds.join(",")})`);
      if (scopeZoneIds.length) filters.push(`zone_id.in.(${scopeZoneIds.join(",")})`);
      const { data: pa } = await supabase
        .from("pastor_assignments")
        .select("id, role, user_id, zone_id, group_church_id, church_id")
        .or(filters.join(","));
      pastors = pa ?? [];
    }

    const userIds = [...new Set(pastors.map((p: any) => p.user_id))];
    let profiles: Record<string, any> = {};
    if (userIds.length) {
      const { data: pr } = await supabase
        .from("profiles")
        .select("id, display_name, email, designation, avatar_url")
        .in("id", userIds);
      profiles = Object.fromEntries((pr ?? []).map((p: any) => [p.id, p]));
    }

    return {
      churches,
      groups,
      pastors: pastors.map((p) => ({ ...p, profile: profiles[p.user_id] ?? null })),
      scope: {
        zones: scopeZoneIds.length,
        groups: scopeGroupIds.length,
        churches: churchIds.size,
      },
    };
  });
