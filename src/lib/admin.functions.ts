import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Check if the calling user is an admin
export const getIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role);
    return { isAdmin: roles.includes("admin"), roles, userId: context.userId };
  });

// Bootstrap: if there are zero admins yet, promote the calling user to admin.
// This is intentional for first-run setup.
export const bootstrapAdminIfNone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) return { promoted: false };
    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    return { promoted: true };
  });

const TableSchema = z.enum([
  "hero_banners",
  "mission_cards",
  "statistics",
  "programs",
  "resource_cards",
  "navigation_items",
  "media_assets",
]);

// Generic admin list — returns all rows including inactive
export const adminList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string }) => ({ table: TableSchema.parse(data.table) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isAdmin = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!isAdmin.data) throw new Error("Forbidden");
    const orderCol = data.table === "media_assets" ? "created_at" : "display_order";
    const { data: rows, error } = await supabaseAdmin
      .from(data.table)
      .select("*")
      .order(orderCol, { ascending: data.table !== "media_assets" });
    if (error) throw error;
    return rows ?? [];
  });

export const adminUpsert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; row: Record<string, any> }) => ({
    table: TableSchema.parse(data.table),
    row: data.row,
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isAdmin = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin.data) throw new Error("Forbidden");
    const { data: row, error } = await supabaseAdmin
      .from(data.table).upsert(data.row).select().single();
    if (error) throw error;
    return row;
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; id: string }) => ({
    table: TableSchema.parse(data.table),
    id: z.string().uuid().parse(data.id),
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isAdmin = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin.data) throw new Error("Forbidden");
    const { error } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminReorder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; ids: string[] }) => ({
    table: TableSchema.parse(data.table),
    ids: z.array(z.string().uuid()).parse(data.ids),
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isAdmin = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin.data) throw new Error("Forbidden");
    await Promise.all(
      data.ids.map((id, i) =>
        (supabaseAdmin.from(data.table) as any).update({ display_order: i }).eq("id", id),
      ),
    );
    return { ok: true };
  });

// Settings (key/value)
export const adminGetSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { key: string }) => ({ key: z.string().max(64).parse(data.key) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isAdmin = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin.data) throw new Error("Forbidden");
    const { data: row } = await supabaseAdmin.from("site_settings").select("*").eq("key", data.key).maybeSingle();
    return row;
  });

export const adminSetSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { key: string; value: any }) => ({
    key: z.string().max(64).parse(data.key),
    value: data.value,
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isAdmin = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin.data) throw new Error("Forbidden");
    const { data: row, error } = await supabaseAdmin
      .from("site_settings").upsert({ key: data.key, value: data.value }).select().single();
    if (error) throw error;
    return row;
  });

// Media: create a long-lived signed URL when uploading and store as public_url
export const createMediaSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { path: string }) => ({ path: z.string().min(1).max(512).parse(data.path) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isAdmin = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin.data) throw new Error("Forbidden");
    // 10 years
    const { data: signed, error } = await supabaseAdmin.storage
      .from("media").createSignedUrl(data.path, 60 * 60 * 24 * 365 * 10);
    if (error) throw error;
    return { url: signed.signedUrl };
  });

export const recordMediaAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    file_name: string; file_path: string; public_url: string;
    mime_type?: string; size_bytes?: number; folder?: string;
  }) => data)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isAdmin = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin.data) throw new Error("Forbidden");
    const { data: row, error } = await supabaseAdmin.from("media_assets").insert({
      ...data, uploaded_by: context.userId,
    }).select().single();
    if (error) throw error;
    return row;
  });

export const listUsersWithRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isAdmin = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin.data) throw new Error("Forbidden");
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("user_roles").select("*"),
    ]);
    const byUser: Record<string, string[]> = {};
    for (const r of roles ?? []) {
      byUser[r.user_id] ||= [];
      byUser[r.user_id].push(r.role);
    }
    return (profiles ?? []).map((p) => ({ ...p, roles: byUser[p.id] ?? [] }));
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { user_id: string; role: "admin" | "editor" | "viewer"; grant: boolean }) => data)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isAdmin = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin.data) throw new Error("Forbidden");
    if (data.grant) {
      await supabaseAdmin.from("user_roles").upsert({ user_id: data.user_id, role: data.role });
    } else {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
    }
    return { ok: true };
  });
