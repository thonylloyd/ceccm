import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

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

// ---- VIDEO ACCESS ----

export const checkVideoAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slug: string }) => ({ slug: z.string().min(1).parse(d.slug) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: video } = await supabaseAdmin
      .from("videos").select("id, access_mode, price_espees").eq("slug", data.slug).maybeSingle();
    if (!video) return { unlocked: false, accessMode: "free" as string, price: null as number | null };
    const mode = (video as any).access_mode ?? "free";
    if (mode === "free") return { unlocked: true, accessMode: mode, price: null };
    const { data: row } = await supabaseAdmin
      .from("video_unlocks").select("user_id")
      .eq("user_id", context.userId).eq("video_id", (video as any).id).maybeSingle();
    return { unlocked: !!row, accessMode: mode, price: (video as any).price_espees ?? null };
  });

export const unlockVideoWithPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slug: string; password: string }) => ({
    slug: z.string().min(1).parse(d.slug),
    password: z.string().min(1).max(200).parse(d.password),
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: v } = await supabaseAdmin
      .from("videos").select("id, access_password_hash, access_mode").eq("slug", data.slug).maybeSingle();
    if (!v) throw new Error("Video not found");
    if ((v as any).access_mode !== "password") throw new Error("This video is not password protected");
    const hash = await sha256(data.password);
    const stored = (v as any).access_password_hash ?? "";
    if (!stored || !safeEqual(hash, stored)) throw new Error("Incorrect password");
    await supabaseAdmin.from("video_unlocks").upsert({
      user_id: context.userId, video_id: (v as any).id, method: "password",
    });
    return { ok: true };
  });

export const purchaseVideoWithEspees = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slug: string }) => ({ slug: z.string().min(1).parse(d.slug) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: v } = await supabaseAdmin
      .from("videos").select("id, access_mode, price_espees").eq("slug", data.slug).maybeSingle();
    if (!v) throw new Error("Video not found");
    if ((v as any).access_mode !== "paid") throw new Error("This video is not for sale");
    // Placeholder ESPEES purchase — records unlock immediately.
    await supabaseAdmin.from("video_unlocks").upsert({
      user_id: context.userId, video_id: (v as any).id, method: "espees",
    });
    return { ok: true };
  });

// ---- BROADCAST ACCESS ----

export const checkBroadcastAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => ({ id: z.string().uuid().parse(d.id) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: b } = await supabaseAdmin
      .from("broadcasts").select("id, access_mode, price_espees").eq("id", data.id).maybeSingle();
    if (!b) return { unlocked: false, accessMode: "free" as string, price: null as number | null };
    const mode = (b as any).access_mode ?? "free";
    if (mode === "free") return { unlocked: true, accessMode: mode, price: null };
    const { data: row } = await supabaseAdmin
      .from("broadcast_unlocks").select("user_id")
      .eq("user_id", context.userId).eq("broadcast_id", (b as any).id).maybeSingle();
    return { unlocked: !!row, accessMode: mode, price: (b as any).price_espees ?? null };
  });

export const unlockBroadcastWithPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; password: string }) => ({
    id: z.string().uuid().parse(d.id),
    password: z.string().min(1).max(200).parse(d.password),
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: b } = await supabaseAdmin
      .from("broadcasts").select("id, access_password_hash, access_mode").eq("id", data.id).maybeSingle();
    if (!b) throw new Error("Broadcast not found");
    if ((b as any).access_mode !== "password") throw new Error("Broadcast is not password protected");
    const hash = await sha256(data.password);
    const stored = (b as any).access_password_hash ?? "";
    if (!stored || !safeEqual(hash, stored)) throw new Error("Incorrect password");
    await supabaseAdmin.from("broadcast_unlocks").upsert({
      user_id: context.userId, broadcast_id: (b as any).id, method: "password",
    });
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
    if ((b as any).access_mode !== "paid") throw new Error("Broadcast is not for sale");
    await supabaseAdmin.from("broadcast_unlocks").upsert({
      user_id: context.userId, broadcast_id: (b as any).id, method: "espees",
    });
    return { ok: true };
  });

// Admin: set/clear password hash for a video
export const adminSetVideoAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id: string; access_mode: "free" | "password" | "paid";
    password?: string | null; price_espees?: number | null;
  }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: isAdmin } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin) throw new Error("Forbidden");
    const patch: any = { access_mode: data.access_mode, price_espees: data.price_espees ?? null };
    if (data.password !== undefined) {
      patch.access_password_hash = data.password ? await sha256(data.password) : null;
    }
    const { error } = await supabaseAdmin.from("videos").update(patch).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminSetBroadcastAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id: string; access_mode: "free" | "password" | "paid";
    password?: string | null; price_espees?: number | null;
  }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: isAdmin } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!isAdmin) throw new Error("Forbidden");
    const patch: any = { access_mode: data.access_mode, price_espees: data.price_espees ?? null };
    if (data.password !== undefined) {
      patch.access_password_hash = data.password ? await sha256(data.password) : null;
    }
    const { error } = await supabaseAdmin.from("broadcasts").update(patch).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const videoAccessQuery = (slug: string) =>
  queryOptions({
    queryKey: ["video-access", slug],
    queryFn: () => checkVideoAccess({ data: { slug } }),
    staleTime: 10_000,
  });

export const broadcastAccessQuery = (id: string) =>
  queryOptions({
    queryKey: ["broadcast-access", id],
    queryFn: () => checkBroadcastAccess({ data: { id } }),
    staleTime: 10_000,
  });
