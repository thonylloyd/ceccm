import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export const getVideoLibrary = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [videos, cats, cta] = await Promise.all([
    supabaseAdmin.from("videos").select("*").eq("is_published", true).order("display_order").order("publish_date", { ascending: false }),
    supabaseAdmin.from("video_categories").select("*").order("display_order"),
    supabaseAdmin.from("video_cta").select("*").eq("is_visible", true).order("display_order").limit(1).maybeSingle(),
  ]);
  return {
    videos: videos.data ?? [],
    categories: cats.data ?? [],
    cta: cta.data ?? null,
  };
});

export const videoLibraryQuery = () =>
  queryOptions({ queryKey: ["videos", "library"], queryFn: () => getVideoLibrary(), staleTime: 30_000 });

export const getVideoBySlug = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string }) => ({ slug: z.string().min(1).parse(d.slug) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: video } = await supabaseAdmin.from("videos").select("*").eq("slug", data.slug).eq("is_published", true).maybeSingle();
    if (!video) return { video: null, related: [] };
    const { data: related } = await supabaseAdmin
      .from("videos").select("*")
      .eq("is_published", true).neq("id", video.id)
      .eq("category_id", video.category_id ?? "00000000-0000-0000-0000-000000000000")
      .limit(6);
    return { video, related: related ?? [] };
  });
