import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const RESOURCE_TYPES = ["document", "video", "link", "course"] as const;
export const RESOURCE_AUDIENCES = [
  "all",
  "pastors",
  "admins",
  "church_pastor",
  "group_pastor",
  "zonal_pastor",
] as const;

const resourceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional().nullable(),
  category: z.string().min(1).max(80).default("general"),
  resource_type: z.enum(RESOURCE_TYPES).default("document"),
  file_url: z.string().url().nullable().optional().or(z.literal("")),
  external_url: z.string().url().nullable().optional().or(z.literal("")),
  thumbnail_url: z.string().url().nullable().optional().or(z.literal("")),
  audience: z.enum(RESOURCE_AUDIENCES).default("all"),
  tags: z.array(z.string()).default([]),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const listResources = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: { category?: string; audience?: string; publishedOnly?: boolean } | undefined) => d ?? {},
  )
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    let q = supabase
      .from("portal_resources")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (data.category) q = q.eq("category", data.category);
    if (data.audience) q = q.eq("audience", data.audience);
    if (data.publishedOnly) q = q.eq("is_published", true);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const saveResource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => resourceSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const clean = (v: any) => (v === "" ? null : v);
    const payload: any = {
      ...data,
      file_url: clean(data.file_url),
      external_url: clean(data.external_url),
      thumbnail_url: clean(data.thumbnail_url),
    };
    if (data.id) {
      const { data: row, error } = await supabase
        .from("portal_resources")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return row;
    }
    delete payload.id;
    payload.created_by = userId;
    const { data: row, error } = await supabase
      .from("portal_resources")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteResource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("portal_resources")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const logResourceView = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    await supabase
      .from("portal_resource_views")
      .insert({ resource_id: data.id, user_id: userId });
    return { ok: true };
  });

export const getResourceStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("is_admin", { _user_id: userId });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await supabase
      .from("portal_resource_views")
      .select("resource_id");
    if (error) throw new Error(error.message);
    const counts: Record<string, number> = {};
    for (const r of data ?? []) counts[(r as any).resource_id] = (counts[(r as any).resource_id] ?? 0) + 1;
    return counts;
  });
