import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export type AccessMode = "free" | "password" | "paid" | "password_paid";

async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function isUnlocked(mode: AccessMode, methods: string[]) {
  if (mode === "free") return true;
  if (mode === "password") return methods.includes("password");
  if (mode === "paid") return methods.includes("espees");
  if (mode === "password_paid") return methods.includes("password") && methods.includes("espees");
  return false;
}

// ============ Public meta (no auth) ============

export const getVideoAccessMeta = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string }) => ({ slug: z.string().min(1).parse(d.slug) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: v } = await supabaseAdmin
      .from("videos").select("id, access_mode, price_espees").eq("slug", data.slug).maybeSingle();
    if (!v) return { id: null as string | null, accessMode: "free" as AccessMode, price: null as number | null };
    return {
      id: (v as any).id as string,
      accessMode: ((v as any).access_mode ?? "free") as AccessMode,
      price: ((v as any).price_espees ?? null) as number | null,
    };
  });

export const getBroadcastAccessMeta = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => ({ id: z.string().uuid().parse(d.id) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: b } = await supabaseAdmin
      .from("broadcasts").select("id, access_mode, price_espees").eq("id", data.id).maybeSingle();
    if (!b) return { id: null as string | null, accessMode: "free" as AccessMode, price: null as number | null };
    return {
      id: (b as any).id as string,
      accessMode: ((b as any).access_mode ?? "free") as AccessMode,
      price: ((b as any).price_espees ?? null) as number | null,
    };
  });

// ============ Authed: unlock check ============

export const checkVideoUnlocked = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slug: string }) => ({ slug: z.string().min(1).parse(d.slug) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: v } = await supabaseAdmin
      .from("videos").select("id, access_mode").eq("slug", data.slug).maybeSingle();
    if (!v) return { unlocked: false, methods: [] as string[] };
    const mode = ((v as any).access_mode ?? "free") as AccessMode;
    if (mode === "free") return { unlocked: true, methods: [] };
    const { data: rows } = await supabaseAdmin
      .from("video_unlocks").select("method")
      .eq("user_id", context.userId).eq("video_id", (v as any).id);
    const methods = (rows ?? []).map((r: any) => r.method).filter(Boolean);
    return { unlocked: isUnlocked(mode, methods), methods };
  });

export const checkBroadcastUnlocked = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => ({ id: z.string().uuid().parse(d.id) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: b } = await supabaseAdmin
      .from("broadcasts").select("id, access_mode").eq("id", data.id).maybeSingle();
    if (!b) return { unlocked: false, methods: [] as string[] };
    const mode = ((b as any).access_mode ?? "free") as AccessMode;
    if (mode === "free") return { unlocked: true, methods: [] };
    const { data: rows } = await supabaseAdmin
      .from("broadcast_unlocks").select("method")
      .eq("user_id", context.userId).eq("broadcast_id", (b as any).id);
    const methods = (rows ?? []).map((r: any) => r.method).filter(Boolean);
    return { unlocked: isUnlocked(mode, methods), methods };
  });

// ============ Unlock actions ============

export const unlockVideoWithPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slug: string; password: string }) => ({
    slug: z.string().min(1).parse(d.slug),
    password: z.string().min(1).max(200).parse(d.password),
  }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: v } = await supabaseAdmin
      .from("videos").select("id, access_password_hash, access_mode").eq("slug", data.slug).maybeSingle();
    if (!v) throw new Error("Video not found");
    const mode = ((v as any).access_mode ?? "free") as AccessMode;
    if (mode !== "password" && mode !== "password_paid") throw new Error("Password not required");
    const hash = await sha256(data.password);
    const stored = (v as any).access_password_hash ?? "";
    if (!stored || !safeEqual(hash, stored)) throw new Error("Incorrect password");
    // Session-scoped: do not persist. Client tracks in sessionStorage.
    return { ok: true };
  });

export const purchaseVideoWithEspees = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slug: string }) => ({ slug: z.string().min(1).parse(d.slug) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: v } = await supabaseAdmin
      .from("videos").select("id, access_mode").eq("slug", data.slug).maybeSingle();
    if (!v) throw new Error("Video not found");
    const mode = ((v as any).access_mode ?? "free") as AccessMode;
    if (mode !== "paid" && mode !== "password_paid") throw new Error("Not for sale");
    await supabaseAdmin.from("video_unlocks").upsert({
      user_id: context.userId, video_id: (v as any).id, method: "espees",
    });
    return { ok: true };
  });

export const unlockBroadcastWithPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; password: string }) => ({
    id: z.string().uuid().parse(d.id),
    password: z.string().min(1).max(200).parse(d.password),
  }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: b } = await supabaseAdmin
      .from("broadcasts").select("id, access_password_hash, access_mode").eq("id", data.id).maybeSingle();
    if (!b) throw new Error("Broadcast not found");
    const mode = ((b as any).access_mode ?? "free") as AccessMode;
    if (mode !== "password" && mode !== "password_paid") throw new Error("Password not required");
    const hash = await sha256(data.password);
    const stored = (b as any).access_password_hash ?? "";
    if (!stored || !safeEqual(hash, stored)) throw new Error("Incorrect password");
    // Session-scoped: do not persist. Client tracks in sessionStorage.
    return { ok: true };
  });

export const purchaseBroadcastWithEspees = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => ({ id: z.string().uuid().parse(d.id) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: b } = await supabaseAdmin
      .from("broadcasts").select("id, access_mode").eq("id", data.id).maybeSingle();
    if (!b) throw new Error("Broadcast not found");
    const mode = ((b as any).access_mode ?? "free") as AccessMode;
    if (mode !== "paid" && mode !== "password_paid") throw new Error("Not for sale");
    await supabaseAdmin.from("broadcast_unlocks").upsert({
      user_id: context.userId, broadcast_id: (b as any).id, method: "espees",
    });
    return { ok: true };
  });

// ============ Admin: set access ============

export const adminSetVideoAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id: string; access_mode: AccessMode;
    password?: string | null; price_espees?: number | null;
  }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: isAdmin } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin) throw new Error("Forbidden");
    const patch: any = { access_mode: data.access_mode, price_espees: data.price_espees ?? null };
    if (data.password !== undefined && data.password !== null && data.password !== "") {
      patch.access_password_hash = await sha256(data.password);
    } else if (data.password === null) {
      patch.access_password_hash = null;
    }
    const { error } = await supabaseAdmin.from("videos").update(patch).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminSetBroadcastAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id: string; access_mode: AccessMode;
    password?: string | null; price_espees?: number | null;
  }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: isAdmin } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin) throw new Error("Forbidden");
    const patch: any = { access_mode: data.access_mode, price_espees: data.price_espees ?? null };
    if (data.password !== undefined && data.password !== null && data.password !== "") {
      patch.access_password_hash = await sha256(data.password);
    } else if (data.password === null) {
      patch.access_password_hash = null;
    }
    const { error } = await supabaseAdmin.from("broadcasts").update(patch).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ============ Query options ============

export const videoAccessMetaQuery = (slug: string) =>
  queryOptions({
    queryKey: ["video-access-meta", slug],
    queryFn: () => getVideoAccessMeta({ data: { slug } }),
    staleTime: 30_000,
  });

export const videoUnlockedQuery = (slug: string, enabled: boolean) =>
  queryOptions({
    queryKey: ["video-unlocked", slug],
    queryFn: async () => {
      try { return await checkVideoUnlocked({ data: { slug } }); }
      catch { return { unlocked: false, methods: [] as string[], unauthed: true } as any; }
    },
    enabled,
    staleTime: 10_000,
  });

export const broadcastUnlockedQuery = (id: string, enabled: boolean) =>
  queryOptions({
    queryKey: ["broadcast-unlocked", id],
    queryFn: async () => {
      try { return await checkBroadcastUnlocked({ data: { id } }); }
      catch { return { unlocked: false, methods: [] as string[], unauthed: true } as any; }
    },
    enabled,
    staleTime: 10_000,
  });
