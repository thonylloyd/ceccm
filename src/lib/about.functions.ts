import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

export const getAboutPage = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [leadership, settings] = await Promise.all([
    supabaseAdmin.from("leadership").select("*").eq("is_active", true).order("display_order"),
    supabaseAdmin.from("site_settings").select("*").in("key", [
      "about_hero", "about_who", "about_mission_intro", "about_purpose", "about_cta", "about_seo",
      "brand", "contact", "footer", "social", "livestream",
    ]),
  ]);
  const settingsMap: Record<string, any> = {};
  for (const row of (settings.data ?? []) as any[]) settingsMap[row.key] = row.value;
  return { leadership: leadership.data ?? [], settings: settingsMap };
});

export const aboutQuery = () =>
  queryOptions({ queryKey: ["about"], queryFn: () => getAboutPage(), staleTime: 30_000 });
