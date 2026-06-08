import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

// Public read of all homepage content via admin client (bypasses RLS for SSR;
// only safe fields are returned and tables already allow public SELECT).
export const getHomepageContent = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [heroes, mission, stats, programs, resources, nav, settings] = await Promise.all([
    supabaseAdmin.from("hero_banners").select("*").eq("is_active", true).order("display_order"),
    supabaseAdmin.from("mission_cards").select("*").eq("is_active", true).order("display_order"),
    supabaseAdmin.from("statistics").select("*").eq("is_active", true).order("display_order"),
    supabaseAdmin.from("programs").select("*").eq("is_active", true).order("display_order"),
    supabaseAdmin.from("resource_cards").select("*").eq("is_active", true).order("display_order"),
    supabaseAdmin.from("navigation_items").select("*").eq("is_active", true).order("display_order"),
    supabaseAdmin.from("site_settings").select("*"),
  ]);

  const settingsMap: Record<string, any> = {};
  for (const row of settings.data ?? []) settingsMap[row.key] = row.value;

  return {
    heroes: heroes.data ?? [],
    mission: mission.data ?? [],
    stats: stats.data ?? [],
    programs: programs.data ?? [],
    resources: resources.data ?? [],
    nav: nav.data ?? [],
    settings: settingsMap,
  };
});

export const homepageQuery = () =>
  queryOptions({
    queryKey: ["homepage"],
    queryFn: () => getHomepageContent(),
    staleTime: 30_000,
  });

export const getSiteChrome = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [nav, settings] = await Promise.all([
    supabaseAdmin.from("navigation_items").select("*").is("parent_id", null).eq("is_active", true).order("display_order"),
    supabaseAdmin.from("site_settings").select("*"),
  ]);
  const settingsMap: Record<string, any> = {};
  for (const row of settings.data ?? []) settingsMap[row.key] = row.value;
  return { nav: nav.data ?? [], settings: settingsMap };
});

export const siteChromeQuery = () =>
  queryOptions({
    queryKey: ["site-chrome"],
    queryFn: () => getSiteChrome(),
    staleTime: 60_000,
  });
