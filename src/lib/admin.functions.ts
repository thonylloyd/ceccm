import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

const ALL_ROLES: AppRole[] = [
  "site_maintenance",
  "super_admin",
  "admin",
  "zonal_pastor",
  "group_pastor",
  "church_pastor",
  "external_pastor",
  "member",
];

const RoleSchema = z.enum([
  "site_maintenance",
  "super_admin",
  "admin",
  "zonal_pastor",
  "group_pastor",
  "church_pastor",
  "external_pastor",
  "member",
]);

// Roles that appear in the permissions matrix (site_maintenance always has all).
const MATRIX_ROLES: AppRole[] = [
  "super_admin",
  "admin",
  "zonal_pastor",
  "group_pastor",
  "church_pastor",
  "external_pastor",
  "member",
];

// ---------- role helpers ----------
async function loadAdminContext(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roleRows } = await supabaseAdmin
    .from("user_roles").select("role").eq("user_id", userId);
  const roles = (roleRows ?? []).map((r: any) => r.role as AppRole);
  const isSiteMaintenance = roles.includes("site_maintenance");
  const isAdmin = isSiteMaintenance || roles.includes("admin") || roles.includes("super_admin");
  return { supabaseAdmin, roles, isAdmin, isSiteMaintenance };
}

async function requireSiteMaintenance(userId: string) {
  const ctx = await loadAdminContext(userId);
  if (!ctx.isSiteMaintenance) throw new Error("Forbidden");
  return ctx;
}

async function requirePermission(userId: string, key: string) {
  const ctx = await loadAdminContext(userId);
  if (ctx.isSiteMaintenance) return ctx;
  if (!ctx.isAdmin) throw new Error("Forbidden");
  const { data } = await ctx.supabaseAdmin
    .from("role_permissions")
    .select("permission_key")
    .in("role", ctx.roles as any)
    .eq("permission_key", key)
    .limit(1);
  if (!data || data.length === 0) throw new Error("Forbidden");
  return ctx;
}

// ---------- session bootstrap ----------
export const getIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin, roles, isAdmin, isSiteMaintenance } = await loadAdminContext(context.userId);
    let permissions: string[] = [];
    if (isSiteMaintenance) {
      const { data } = await supabaseAdmin.from("permissions").select("key");
      permissions = (data ?? []).map((p: any) => p.key);
    } else if (isAdmin) {
      const { data } = await supabaseAdmin
        .from("role_permissions").select("permission_key").in("role", roles as any);
      permissions = Array.from(new Set((data ?? []).map((p: any) => p.permission_key)));
    }
    return { isAdmin, isSuperAdmin: isSiteMaintenance, isSiteMaintenance, roles, permissions, userId: context.userId };
  });

// Bootstrap: promote the first user to site_maintenance if none exists
export const bootstrapAdminIfNone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "site_maintenance");
    if ((count ?? 0) > 0) return { promoted: false };
    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "site_maintenance" });
    return { promoted: true };
  });

// ---------- generic CMS ----------
const TableSchema = z.enum([
  "hero_banners",
  "mission_cards",
  "statistics",
  "programs",
  "resource_cards",
  "navigation_items",
  "media_assets",
  "videos",
  "video_categories",
  "video_cta",
  "broadcasts",
  "broadcast_channels",
  "broadcast_stats",
  "praise_reports",
  "leadership",
  "zones",
  "group_churches",
  "churches",
]);

const TABLE_PERMISSION: Record<string, string> = {
  hero_banners: "homepage",
  mission_cards: "homepage",
  statistics: "homepage",
  resource_cards: "homepage",
  praise_reports: "homepage",
  leadership: "about",
  programs: "programs",
  navigation_items: "navigation",
  media_assets: "media",
  videos: "videos",
  video_categories: "videos",
  video_cta: "videos",
  broadcasts: "livestream",
  broadcast_channels: "livestream",
  broadcast_stats: "livestream",
  zones: "hierarchy",
  group_churches: "hierarchy",
  churches: "hierarchy",
};

export const adminList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string }) => ({ table: TableSchema.parse(data.table) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await requirePermission(context.userId, TABLE_PERMISSION[data.table] ?? "dashboard");
    const orderCol = data.table === "media_assets" ? "created_at" : "display_order";
    const { data: rows, error } = await supabaseAdmin
      .from(data.table).select("*").order(orderCol, { ascending: data.table !== "media_assets" });
    if (error) throw error;
    return rows ?? [];
  });

export const adminUpsert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; row: Record<string, any> }) => ({
    table: TableSchema.parse(data.table), row: data.row,
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await requirePermission(context.userId, TABLE_PERMISSION[data.table] ?? "dashboard");
    const { data: row, error } = await supabaseAdmin
      .from(data.table).upsert(data.row).select().single();
    if (error) throw error;
    return row;
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; id: string }) => ({
    table: TableSchema.parse(data.table), id: z.string().uuid().parse(data.id),
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await requirePermission(context.userId, TABLE_PERMISSION[data.table] ?? "dashboard");
    const { error } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminReorder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { table: string; ids: string[] }) => ({
    table: TableSchema.parse(data.table), ids: z.array(z.string().uuid()).parse(data.ids),
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await requirePermission(context.userId, TABLE_PERMISSION[data.table] ?? "dashboard");
    await Promise.all(
      data.ids.map((id, i) =>
        (supabaseAdmin.from(data.table) as any).update({ display_order: i }).eq("id", id),
      ),
    );
    return { ok: true };
  });

// ---------- settings ----------
export const adminGetSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { key: string }) => ({ key: z.string().max(64).parse(data.key) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await requirePermission(context.userId, "settings");
    const { data: row } = await supabaseAdmin.from("site_settings").select("*").eq("key", data.key).maybeSingle();
    return row;
  });

export const adminSetSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { key: string; value: any }) => ({
    key: z.string().max(64).parse(data.key), value: data.value,
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await requirePermission(context.userId, "settings");
    const { data: row, error } = await supabaseAdmin
      .from("site_settings").upsert({ key: data.key, value: data.value }).select().single();
    if (error) throw error;
    return row;
  });

// ---------- media ----------
export const createMediaSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { path: string }) => ({ path: z.string().min(1).max(512).parse(data.path) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await requirePermission(context.userId, "media");
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
    const { supabaseAdmin } = await requirePermission(context.userId, "media");
    const { data: row, error } = await supabaseAdmin.from("media_assets").insert({
      ...data, uploaded_by: context.userId,
    }).select().single();
    if (error) throw error;
    return row;
  });

// ---------- users ----------
export const listUsersWithRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await requirePermission(context.userId, "users");
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("user_roles").select("*"),
    ]);
    const byUser: Record<string, AppRole[]> = {};
    for (const r of roles ?? []) {
      byUser[r.user_id] ||= [];
      byUser[r.user_id].push(r.role as AppRole);
    }
    return (profiles ?? []).map((p) => ({ ...p, roles: byUser[p.id] ?? [] }));
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { user_id: string; role: AppRole; grant: boolean }) => ({
    user_id: z.string().uuid().parse(data.user_id),
    role: RoleSchema.parse(data.role),
    grant: !!data.grant,
  }))
  .handler(async ({ data, context }) => {
    await requireSiteMaintenance(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!data.grant && data.role === "site_maintenance" && data.user_id === context.userId) {
      throw new Error("You cannot revoke your own Site Maintenance role.");
    }
    if (data.grant) {
      await supabaseAdmin.from("user_roles").upsert({ user_id: data.user_id, role: data.role });
    } else {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
    }
    return { ok: true };
  });

export const createUserAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { email: string; password: string; display_name?: string; role?: AppRole }) => ({
    email: z.string().email().parse(data.email),
    password: z.string().min(8).parse(data.password),
    display_name: data.display_name?.slice(0, 120),
    role: data.role ? RoleSchema.parse(data.role) : undefined,
  }))
  .handler(async ({ data, context }) => {
    await requireSiteMaintenance(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.display_name ?? data.email },
    });
    if (error) throw error;
    const uid = created.user!.id;
    if (data.display_name) {
      await supabaseAdmin.from("profiles").update({ display_name: data.display_name }).eq("id", uid);
    }
    if (data.role && data.role !== "member") {
      await supabaseAdmin.from("user_roles").upsert({ user_id: uid, role: data.role });
    }
    return { ok: true, user_id: uid };
  });

export const deleteUserAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { user_id: string }) => ({ user_id: z.string().uuid().parse(data.user_id) }))
  .handler(async ({ data, context }) => {
    await requireSiteMaintenance(context.userId);
    if (data.user_id === context.userId) throw new Error("You cannot delete your own account.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw error;
    return { ok: true };
  });

// ---------- permissions management ----------
export const listPermissionsMatrix = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireSiteMaintenance(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: perms }, { data: rp }] = await Promise.all([
      supabaseAdmin.from("permissions").select("*").order("sort_order"),
      supabaseAdmin.from("role_permissions").select("*"),
    ]);
    return {
      permissions: perms ?? [],
      role_permissions: rp ?? [],
      roles: MATRIX_ROLES,
      all_roles: ALL_ROLES,
    };
  });

export const setRolePermission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { role: AppRole; permission_key: string; grant: boolean }) => ({
    role: RoleSchema.parse(data.role),
    permission_key: z.string().min(1).max(64).parse(data.permission_key),
    grant: !!data.grant,
  }))
  .handler(async ({ data, context }) => {
    await requireSiteMaintenance(context.userId);
    if (data.role === "site_maintenance") throw new Error("Site Maintenance has all permissions by default.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      await supabaseAdmin.from("role_permissions").upsert({ role: data.role, permission_key: data.permission_key });
    } else {
      await supabaseAdmin.from("role_permissions").delete()
        .eq("role", data.role).eq("permission_key", data.permission_key);
    }
    return { ok: true };
  });
