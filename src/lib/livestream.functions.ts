import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export const getLivestreamPage = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [broadcasts, channels, stats, settings] = await Promise.all([
    supabaseAdmin.from("broadcasts").select("*").eq("is_published", true).order("display_order"),
    supabaseAdmin.from("broadcast_channels").select("*").eq("is_published", true).order("display_order"),
    supabaseAdmin.from("broadcast_stats").select("*").eq("is_published", true).order("display_order"),
    supabaseAdmin.from("site_settings").select("*").in("key", ["livestream_hero", "livestream_alert", "brand", "livestream"]),
  ]);
  const settingsMap: Record<string, any> = {};
  for (const row of settings.data ?? []) settingsMap[row.key] = row.value;
  const all = (broadcasts.data ?? []) as any[];
  return {
    current: all.find((b) => b.kind === "live" && b.is_live) ?? null,
    upcoming: all.filter((b) => b.kind === "upcoming"),
    replays: all.filter((b) => b.kind === "replay"),
    featured: all.filter((b) => b.is_featured),
    channels: channels.data ?? [],
    stats: stats.data ?? [],
    settings: settingsMap,
  };
});

export const livestreamQuery = () =>
  queryOptions({
    queryKey: ["livestream"],
    queryFn: () => getLivestreamPage(),
    staleTime: 30_000,
  });

export const subscribeToBroadcasts = createServerFn({ method: "POST" })
  .inputValidator((data: { name?: string; email: string; country?: string; preferences?: string[] }) =>
    z.object({
      name: z.string().max(120).optional(),
      email: z.string().email().max(200),
      country: z.string().max(120).optional(),
      preferences: z.array(z.string().max(60)).max(10).optional(),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("broadcast_subscribers").insert(data);
    if (error) throw error;
    return { ok: true };
  });
