import { c as createServerRpc } from "./createServerRpc-Byf-sH7j.mjs";
import { c as createServerFn } from "./server-Cl-mkr1Z.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DQksU7Dh.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as enumType, s as stringType, a as arrayType } from "../_libs/zod.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const getIsAdmin_createServerFn_handler = createServerRpc({
  id: "8ec3a24cdfc816c6a99237bbadf5c75ae0affc14e8a68ec0663a4f7dc5edbfa9",
  name: "getIsAdmin",
  filename: "src/lib/admin.functions.ts"
}, (opts) => getIsAdmin.__executeServer(opts));
const getIsAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getIsAdmin_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId);
  const roles = (data ?? []).map((r) => r.role);
  return {
    isAdmin: roles.includes("admin"),
    roles,
    userId: context.userId
  };
});
const bootstrapAdminIfNone_createServerFn_handler = createServerRpc({
  id: "4ace4570f991c075b5a867d81119d2f45921163af898eb5e7e5fc80a3d7b8e98",
  name: "bootstrapAdminIfNone",
  filename: "src/lib/admin.functions.ts"
}, (opts) => bootstrapAdminIfNone.__executeServer(opts));
const bootstrapAdminIfNone = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(bootstrapAdminIfNone_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    count
  } = await supabaseAdmin.from("user_roles").select("*", {
    count: "exact",
    head: true
  }).eq("role", "admin");
  if ((count ?? 0) > 0) return {
    promoted: false
  };
  await supabaseAdmin.from("user_roles").insert({
    user_id: context.userId,
    role: "admin"
  });
  return {
    promoted: true
  };
});
const TableSchema = enumType(["hero_banners", "mission_cards", "statistics", "programs", "resource_cards", "navigation_items", "media_assets", "videos", "video_categories", "video_cta"]);
const adminList_createServerFn_handler = createServerRpc({
  id: "2a1221af605f33de14fcb3129215421dab3d887ea7a54786b11ee6fc22dd2385",
  name: "adminList",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminList.__executeServer(opts));
const adminList = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  table: TableSchema.parse(data.table)
})).handler(adminList_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isAdmin = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAdmin.data) throw new Error("Forbidden");
  const orderCol = data.table === "media_assets" ? "created_at" : "display_order";
  const {
    data: rows,
    error
  } = await supabaseAdmin.from(data.table).select("*").order(orderCol, {
    ascending: data.table !== "media_assets"
  });
  if (error) throw error;
  return rows ?? [];
});
const adminUpsert_createServerFn_handler = createServerRpc({
  id: "5cc0279c96364588651386247a894627f23b1528e5a701b5207f2967bcacde82",
  name: "adminUpsert",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpsert.__executeServer(opts));
const adminUpsert = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  table: TableSchema.parse(data.table),
  row: data.row
})).handler(adminUpsert_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isAdmin = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAdmin.data) throw new Error("Forbidden");
  const {
    data: row,
    error
  } = await supabaseAdmin.from(data.table).upsert(data.row).select().single();
  if (error) throw error;
  return row;
});
const adminDelete_createServerFn_handler = createServerRpc({
  id: "b54307ac4d34e95076d59a570cf2390f961b96c0ba131b8afe0ae55ca874601e",
  name: "adminDelete",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDelete.__executeServer(opts));
const adminDelete = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  table: TableSchema.parse(data.table),
  id: stringType().uuid().parse(data.id)
})).handler(adminDelete_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isAdmin = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAdmin.data) throw new Error("Forbidden");
  const {
    error
  } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
  if (error) throw error;
  return {
    ok: true
  };
});
const adminReorder_createServerFn_handler = createServerRpc({
  id: "b2f016c286b0a2c85f42701d27078bc0493de51e0688768282a6175b8ee445ae",
  name: "adminReorder",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminReorder.__executeServer(opts));
const adminReorder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  table: TableSchema.parse(data.table),
  ids: arrayType(stringType().uuid()).parse(data.ids)
})).handler(adminReorder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isAdmin = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAdmin.data) throw new Error("Forbidden");
  await Promise.all(data.ids.map((id, i) => supabaseAdmin.from(data.table).update({
    display_order: i
  }).eq("id", id)));
  return {
    ok: true
  };
});
const adminGetSetting_createServerFn_handler = createServerRpc({
  id: "517f5c10ca4ce444c5e3024b339393d5389496560a0fafe2b6a7ed3d689df1cc",
  name: "adminGetSetting",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminGetSetting.__executeServer(opts));
const adminGetSetting = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  key: stringType().max(64).parse(data.key)
})).handler(adminGetSetting_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isAdmin = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAdmin.data) throw new Error("Forbidden");
  const {
    data: row
  } = await supabaseAdmin.from("site_settings").select("*").eq("key", data.key).maybeSingle();
  return row;
});
const adminSetSetting_createServerFn_handler = createServerRpc({
  id: "3d6294706c0731220b3344c406b834693b02b2eabe60a02d4296a0dfe79b77d1",
  name: "adminSetSetting",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminSetSetting.__executeServer(opts));
const adminSetSetting = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  key: stringType().max(64).parse(data.key),
  value: data.value
})).handler(adminSetSetting_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isAdmin = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAdmin.data) throw new Error("Forbidden");
  const {
    data: row,
    error
  } = await supabaseAdmin.from("site_settings").upsert({
    key: data.key,
    value: data.value
  }).select().single();
  if (error) throw error;
  return row;
});
const createMediaSignedUrl_createServerFn_handler = createServerRpc({
  id: "538a3fc5c9b4340cd8685016098fc21a14a7e64d4a43193dab94923c1f7000f8",
  name: "createMediaSignedUrl",
  filename: "src/lib/admin.functions.ts"
}, (opts) => createMediaSignedUrl.__executeServer(opts));
const createMediaSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  path: stringType().min(1).max(512).parse(data.path)
})).handler(createMediaSignedUrl_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isAdmin = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAdmin.data) throw new Error("Forbidden");
  const {
    data: signed,
    error
  } = await supabaseAdmin.storage.from("media").createSignedUrl(data.path, 60 * 60 * 24 * 365 * 10);
  if (error) throw error;
  return {
    url: signed.signedUrl
  };
});
const recordMediaAsset_createServerFn_handler = createServerRpc({
  id: "c43d7092a224db39a5681991f507cf5e7377a72db6dfd80d372622ba7415b77b",
  name: "recordMediaAsset",
  filename: "src/lib/admin.functions.ts"
}, (opts) => recordMediaAsset.__executeServer(opts));
const recordMediaAsset = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(recordMediaAsset_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isAdmin = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAdmin.data) throw new Error("Forbidden");
  const {
    data: row,
    error
  } = await supabaseAdmin.from("media_assets").insert({
    ...data,
    uploaded_by: context.userId
  }).select().single();
  if (error) throw error;
  return row;
});
const listUsersWithRoles_createServerFn_handler = createServerRpc({
  id: "d8993bd40f9162497be09e35e3e219129afc683ceeb885dc57ad49e227c2d53b",
  name: "listUsersWithRoles",
  filename: "src/lib/admin.functions.ts"
}, (opts) => listUsersWithRoles.__executeServer(opts));
const listUsersWithRoles = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listUsersWithRoles_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isAdmin = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAdmin.data) throw new Error("Forbidden");
  const [{
    data: profiles
  }, {
    data: roles
  }] = await Promise.all([supabaseAdmin.from("profiles").select("*").order("created_at", {
    ascending: false
  }), supabaseAdmin.from("user_roles").select("*")]);
  const byUser = {};
  for (const r of roles ?? []) {
    byUser[r.user_id] ||= [];
    byUser[r.user_id].push(r.role);
  }
  return (profiles ?? []).map((p) => ({
    ...p,
    roles: byUser[p.id] ?? []
  }));
});
const setUserRole_createServerFn_handler = createServerRpc({
  id: "db980dd7fbef43d3fc13d10ddc5f8ed5aae0f52362aa36d741670b7c62aab77f",
  name: "setUserRole",
  filename: "src/lib/admin.functions.ts"
}, (opts) => setUserRole.__executeServer(opts));
const setUserRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(setUserRole_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const isAdmin = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!isAdmin.data) throw new Error("Forbidden");
  if (data.grant) {
    await supabaseAdmin.from("user_roles").upsert({
      user_id: data.user_id,
      role: data.role
    });
  } else {
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
  }
  return {
    ok: true
  };
});
export {
  adminDelete_createServerFn_handler,
  adminGetSetting_createServerFn_handler,
  adminList_createServerFn_handler,
  adminReorder_createServerFn_handler,
  adminSetSetting_createServerFn_handler,
  adminUpsert_createServerFn_handler,
  bootstrapAdminIfNone_createServerFn_handler,
  createMediaSignedUrl_createServerFn_handler,
  getIsAdmin_createServerFn_handler,
  listUsersWithRoles_createServerFn_handler,
  recordMediaAsset_createServerFn_handler,
  setUserRole_createServerFn_handler
};
