import { c as createServerRpc } from "./createServerRpc-Byf-sH7j.mjs";
import { c as createServerFn } from "./server-Cl-mkr1Z.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const getHomepageContent_createServerFn_handler = createServerRpc({
  id: "94c086f20075eea7704418952632703660682c76b793182a33273a52dc27f498",
  name: "getHomepageContent",
  filename: "src/lib/cms.functions.ts"
}, (opts) => getHomepageContent.__executeServer(opts));
const getHomepageContent = createServerFn({
  method: "GET"
}).handler(getHomepageContent_createServerFn_handler, async () => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const [heroes, mission, stats, programs, resources, nav, settings] = await Promise.all([supabaseAdmin.from("hero_banners").select("*").eq("is_active", true).order("display_order"), supabaseAdmin.from("mission_cards").select("*").eq("is_active", true).order("display_order"), supabaseAdmin.from("statistics").select("*").eq("is_active", true).order("display_order"), supabaseAdmin.from("programs").select("*").eq("is_active", true).order("display_order"), supabaseAdmin.from("resource_cards").select("*").eq("is_active", true).order("display_order"), supabaseAdmin.from("navigation_items").select("*").eq("is_active", true).order("display_order"), supabaseAdmin.from("site_settings").select("*")]);
  const settingsMap = {};
  for (const row of settings.data ?? []) settingsMap[row.key] = row.value;
  return {
    heroes: heroes.data ?? [],
    mission: mission.data ?? [],
    stats: stats.data ?? [],
    programs: programs.data ?? [],
    resources: resources.data ?? [],
    nav: nav.data ?? [],
    settings: settingsMap
  };
});
const getSiteChrome_createServerFn_handler = createServerRpc({
  id: "4ed7a4ded3c2e46db9c8a58b82cb4efcc161e0adfae83f7fec0b2ce245431f71",
  name: "getSiteChrome",
  filename: "src/lib/cms.functions.ts"
}, (opts) => getSiteChrome.__executeServer(opts));
const getSiteChrome = createServerFn({
  method: "GET"
}).handler(getSiteChrome_createServerFn_handler, async () => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const [nav, settings] = await Promise.all([supabaseAdmin.from("navigation_items").select("*").is("parent_id", null).eq("is_active", true).order("display_order"), supabaseAdmin.from("site_settings").select("*")]);
  const settingsMap = {};
  for (const row of settings.data ?? []) settingsMap[row.key] = row.value;
  return {
    nav: nav.data ?? [],
    settings: settingsMap
  };
});
export {
  getHomepageContent_createServerFn_handler,
  getSiteChrome_createServerFn_handler
};
