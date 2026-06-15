import { r as reactExports } from "../_libs/react.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { c as createSsrRpc } from "./router-EhlbKFja.mjs";
import { c as createServerFn } from "./server-Cl-mkr1Z.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DQksU7Dh.mjs";
import { s as stringType, e as enumType, a as arrayType } from "../_libs/zod.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
const getIsAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("8ec3a24cdfc816c6a99237bbadf5c75ae0affc14e8a68ec0663a4f7dc5edbfa9"));
const bootstrapAdminIfNone = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("4ace4570f991c075b5a867d81119d2f45921163af898eb5e7e5fc80a3d7b8e98"));
const TableSchema = enumType(["hero_banners", "mission_cards", "statistics", "programs", "resource_cards", "navigation_items", "media_assets", "videos", "video_categories", "video_cta"]);
const adminList = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  table: TableSchema.parse(data.table)
})).handler(createSsrRpc("2a1221af605f33de14fcb3129215421dab3d887ea7a54786b11ee6fc22dd2385"));
const adminUpsert = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  table: TableSchema.parse(data.table),
  row: data.row
})).handler(createSsrRpc("5cc0279c96364588651386247a894627f23b1528e5a701b5207f2967bcacde82"));
const adminDelete = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  table: TableSchema.parse(data.table),
  id: stringType().uuid().parse(data.id)
})).handler(createSsrRpc("b54307ac4d34e95076d59a570cf2390f961b96c0ba131b8afe0ae55ca874601e"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  table: TableSchema.parse(data.table),
  ids: arrayType(stringType().uuid()).parse(data.ids)
})).handler(createSsrRpc("b2f016c286b0a2c85f42701d27078bc0493de51e0688768282a6175b8ee445ae"));
const adminGetSetting = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  key: stringType().max(64).parse(data.key)
})).handler(createSsrRpc("517f5c10ca4ce444c5e3024b339393d5389496560a0fafe2b6a7ed3d689df1cc"));
const adminSetSetting = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  key: stringType().max(64).parse(data.key),
  value: data.value
})).handler(createSsrRpc("3d6294706c0731220b3344c406b834693b02b2eabe60a02d4296a0dfe79b77d1"));
const createMediaSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => ({
  path: stringType().min(1).max(512).parse(data.path)
})).handler(createSsrRpc("538a3fc5c9b4340cd8685016098fc21a14a7e64d4a43193dab94923c1f7000f8"));
const recordMediaAsset = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("c43d7092a224db39a5681991f507cf5e7377a72db6dfd80d372622ba7415b77b"));
const listUsersWithRoles = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d8993bd40f9162497be09e35e3e219129afc683ceeb885dc57ad49e227c2d53b"));
const setUserRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("db980dd7fbef43d3fc13d10ddc5f8ed5aae0f52362aa36d741670b7c62aab77f"));
export {
  adminList as a,
  bootstrapAdminIfNone as b,
  adminUpsert as c,
  adminDelete as d,
  adminSetSetting as e,
  adminGetSetting as f,
  getIsAdmin as g,
  createMediaSignedUrl as h,
  listUsersWithRoles as l,
  recordMediaAsset as r,
  setUserRole as s,
  useServerFn as u
};
