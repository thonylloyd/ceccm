import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, e as adminSetSetting, f as adminGetSetting } from "./admin.functions-B8Ws9k6i.mjs";
import { P as PageHeader, C as Card, F as Field, I as Input, T as Textarea, B as Button } from "./ui-DcRKsItl.mjs";
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
function ContactAdmin() {
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetSetting);
  const setFn = useServerFn(adminSetSetting);
  const q = useQuery({
    queryKey: ["s", "contact_page"],
    queryFn: () => getFn({
      data: {
        key: "contact_page"
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
        key: "contact_page",
        value: v
      }
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["s", "contact_page"]
      });
      toast.success("Saved");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Contact Page", description: "Manage the contact page content and offices." }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Heading", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.heading ?? "", onChange: (e) => setV({
          ...v,
          heading: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Intro", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: v.intro ?? "", onChange: (e) => setV({
          ...v,
          intro: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.email ?? "", onChange: (e) => setV({
          ...v,
          email: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.phone ?? "", onChange: (e) => setV({
          ...v,
          phone: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Office Address", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: v.address ?? "", onChange: (e) => setV({
          ...v,
          address: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Office Hours", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.hours ?? "", onChange: (e) => setV({
          ...v,
          hours: e.target.value
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-black/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => m.mutate(), disabled: m.isPending, children: m.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : "Save" }) })
    ] })
  ] });
}
export {
  ContactAdmin as component
};
