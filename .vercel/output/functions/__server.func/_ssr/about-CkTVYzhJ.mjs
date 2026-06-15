import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, e as adminSetSetting, f as adminGetSetting } from "./admin.functions-B8Ws9k6i.mjs";
import { P as PageHeader, C as Card, F as Field, I as Input, T as Textarea, B as Button } from "./ui-DcRKsItl.mjs";
import { M as MediaPicker } from "./MediaPicker-pIWHjKsi.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./router-EhlbKFja.mjs";
import "./server-Cl-mkr1Z.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./client-CW46O5zz.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "./auth-middleware-DQksU7Dh.mjs";
function AboutAdmin() {
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetSetting);
  const setFn = useServerFn(adminSetSetting);
  const q = useQuery({
    queryKey: ["s", "about"],
    queryFn: () => getFn({
      data: {
        key: "about"
      }
    })
  });
  const [v, setV] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (q.data?.value) setV(q.data.value);
  }, [q.data]);
  const m = useMutation({
    mutationFn: () => setFn({
      data: {
        key: "about",
        value: v
      }
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["s", "about"]
      });
      toast.success("Saved");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "About Page", description: "Manage content for the About page." }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Page Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.title ?? "", onChange: (e) => setV({
          ...v,
          title: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Subtitle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.subtitle ?? "", onChange: (e) => setV({
          ...v,
          subtitle: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MediaPicker, { label: "Hero Image", value: v.image_url, onChange: (url) => setV({
          ...v,
          image_url: url
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mission Statement", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: v.mission ?? "", onChange: (e) => setV({
          ...v,
          mission: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Our Story", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 8, value: v.story ?? "", onChange: (e) => setV({
          ...v,
          story: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Vision", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: v.vision ?? "", onChange: (e) => setV({
          ...v,
          vision: e.target.value
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-black/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => m.mutate(), disabled: m.isPending, children: m.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : "Save" }) })
    ] })
  ] });
}
export {
  AboutAdmin as component
};
