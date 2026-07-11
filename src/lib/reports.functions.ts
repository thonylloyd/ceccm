import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const numericFields = [
  "new_converts","water_baptized","filled_with_spirit","first_timers",
  "church_attendance","cell_attendance","tithers","partners",
  "foundation_school_added","foundation_school_total",
  "discipleship_added","discipleship_total",
  "cell_leaders_added","cell_leaders_total",
  "cell_members_added","cell_members_total",
  "workers_added","workers_total",
] as const;

const reportSchema = z.object({
  id: z.string().uuid().optional(),
  church_id: z.string().uuid().nullable().optional(),
  group_church_id: z.string().uuid().nullable().optional(),
  zone_id: z.string().uuid().nullable().optional(),
  week_start: z.string(), // yyyy-mm-dd
  status: z.enum(["draft","submitted"]).default("draft"),
  notes: z.string().max(4000).optional().nullable(),
  ...Object.fromEntries(numericFields.map((k) => [k, z.coerce.number().int().min(0).default(0)])),
} as any);

function weekBits(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00Z");
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  // ISO week number
  const target = new Date(Date.UTC(y, d.getUTCMonth(), d.getUTCDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const diff = (target.getTime() - firstThursday.getTime()) / 86400000;
  const week = 1 + Math.round((diff - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return { year: y, month: m, week_number: week };
}

export const getMyAssignments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("pastor_assignments")
      .select("id, role, zone_id, group_church_id, church_id, zones(name), group_churches(name), churches(name)")
      .eq("user_id", userId);
    return data ?? [];
  });

export const listReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { status?: string; year?: number; limit?: number } | undefined) => d ?? {})
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    let q = supabase
      .from("weekly_reports")
      .select("*, churches(name), group_churches(name), zones(name)")
      .order("week_start", { ascending: false })
      .limit(data.limit ?? 100);
    if (data.status) q = q.eq("status", data.status);
    if (data.year) q = q.eq("year", data.year);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { data: row, error } = await supabase
      .from("weekly_reports")
      .select("*, churches(name), group_churches(name), zones(name)")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const saveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => reportSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { year, month, week_number } = weekBits(data.week_start);

    // If church_id provided, look up group/zone from churches → group_churches
    let group_church_id = data.group_church_id ?? null;
    let zone_id = data.zone_id ?? null;
    if (data.church_id) {
      const { data: ch } = await supabase
        .from("churches")
        .select("group_church_id, group_churches(zone_id)")
        .eq("id", data.church_id)
        .single();
      if (ch) {
        group_church_id = ch.group_church_id ?? group_church_id;
        zone_id = (ch as any).group_churches?.zone_id ?? zone_id;
      }
    }

    const payload: any = {
      ...data,
      reporter_id: userId,
      year,
      month,
      week_number,
      group_church_id,
      zone_id,
      submitted_at: data.status === "submitted" ? new Date().toISOString() : null,
    };
    if (data.id) {
      const { data: row, error } = await supabase
        .from("weekly_reports")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return row;
    }
    delete payload.id;
    const { data: row, error } = await supabase
      .from("weekly_reports")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);

    if (data.status === "submitted") {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: admins } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .in("role", ["admin", "site_maintenance", "super_admin"]);
      const notifs = (admins ?? []).map((a: any) => ({
        user_id: a.user_id,
        type: "report_submitted",
        title: "New weekly report submitted",
        body: "A pastor submitted a weekly report for review.",
        link: "/portal/reports",
      }));
      if (notifs.length) await supabaseAdmin.from("portal_notifications").insert(notifs);
    }
    return row;
  });

export const approveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: userId });
    if (!isAdmin) throw new Error("Forbidden");
    const { data: row, error } = await supabase
      .from("weekly_reports")
      .update({ status: "approved", approved_at: new Date().toISOString(), approved_by: userId })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);

    if (row?.reporter_id) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("portal_notifications").insert({
        user_id: row.reporter_id,
        type: "report_approved",
        title: "Your weekly report was approved",
        body: `Report for week starting ${row.week_start} has been approved.`,
        link: "/portal/reports",
      });
    }
    return row;
  });

export const deleteReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { error } = await supabase.from("weekly_reports").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const REPORT_NUMERIC_FIELDS = numericFields;
