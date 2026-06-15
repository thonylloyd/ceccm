import { c as createServerRpc } from "./createServerRpc-Byf-sH7j.mjs";
import { c as createServerFn } from "./server-Cl-mkr1Z.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const getVideoLibrary_createServerFn_handler = createServerRpc({
  id: "ba0b7809e1b77e99fe78512cb006981a257429e742391e135feb6c7d488997a7",
  name: "getVideoLibrary",
  filename: "src/lib/videos.functions.ts"
}, (opts) => getVideoLibrary.__executeServer(opts));
const getVideoLibrary = createServerFn({
  method: "GET"
}).handler(getVideoLibrary_createServerFn_handler, async () => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const [videos, cats, cta] = await Promise.all([supabaseAdmin.from("videos").select("*").eq("is_published", true).order("display_order").order("publish_date", {
    ascending: false
  }), supabaseAdmin.from("video_categories").select("*").order("display_order"), supabaseAdmin.from("video_cta").select("*").eq("is_visible", true).order("display_order").limit(1).maybeSingle()]);
  return {
    videos: videos.data ?? [],
    categories: cats.data ?? [],
    cta: cta.data ?? null
  };
});
const getVideoBySlug_createServerFn_handler = createServerRpc({
  id: "426e7bfd8bf7784d80defbf7974ae221080d29ae53810d34e72cb03c0cd7fce0",
  name: "getVideoBySlug",
  filename: "src/lib/videos.functions.ts"
}, (opts) => getVideoBySlug.__executeServer(opts));
const getVideoBySlug = createServerFn({
  method: "POST"
}).inputValidator((d) => ({
  slug: stringType().min(1).parse(d.slug)
})).handler(getVideoBySlug_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: video
  } = await supabaseAdmin.from("videos").select("*").eq("slug", data.slug).eq("is_published", true).maybeSingle();
  if (!video) return {
    video: null,
    related: []
  };
  const {
    data: related
  } = await supabaseAdmin.from("videos").select("*").eq("is_published", true).neq("id", video.id).eq("category_id", video.category_id ?? "00000000-0000-0000-0000-000000000000").limit(6);
  return {
    video,
    related: related ?? []
  };
});
export {
  getVideoBySlug_createServerFn_handler,
  getVideoLibrary_createServerFn_handler
};
