import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as useQueryClient, b as useMutation, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, e as adminSetSetting, f as adminGetSetting } from "./admin.functions-B8Ws9k6i.mjs";
import { P as PageHeader, F as Field, I as Input, T as Textarea, C as Card, B as Button } from "./ui-DcRKsItl.mjs";
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
function useSetting(key) {
  const getFn = useServerFn(adminGetSetting);
  return useQuery({
    queryKey: ["s", key],
    queryFn: () => getFn({
      data: {
        key
      }
    })
  });
}
function SettingCard({
  skey,
  title,
  render
}) {
  const qc = useQueryClient();
  const setFn = useServerFn(adminSetSetting);
  const q = useSetting(skey);
  const [value, setValue] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (q.data?.value) setValue(q.data.value);
  }, [q.data]);
  const m = useMutation({
    mutationFn: () => setFn({
      data: {
        key: skey,
        value
      }
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["s", skey]
      });
      qc.invalidateQueries({
        queryKey: ["homepage"]
      });
      toast.success("Saved");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg text-navy-deep mb-4", children: title }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: render(value, setValue) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-black/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => m.mutate(), disabled: m.isPending, children: m.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : "Save" }) })
    ] })
  ] });
}
function SettingsAdmin() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-3xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Global Settings", description: "Brand, contact, footer, social, and SEO." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingCard, { skey: "brand", title: "Brand", render: (v, set) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Site Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.name ?? "", onChange: (e) => set({
        ...v,
        name: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tagline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.tagline ?? "", onChange: (e) => set({
        ...v,
        tagline: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MediaPicker, { label: "Logo", value: v.logo_url, onChange: (url) => set({
        ...v,
        logo_url: url
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MediaPicker, { label: "Favicon", value: v.favicon_url, onChange: (url) => set({
        ...v,
        favicon_url: url
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Primary Color (Navy)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.color_primary ?? "", onChange: (e) => set({
        ...v,
        color_primary: e.target.value
      }), placeholder: "#041E4A" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Accent Color (Gold)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.color_accent ?? "", onChange: (e) => set({
        ...v,
        color_accent: e.target.value
      }), placeholder: "#B88A1B" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingCard, { skey: "contact", title: "Contact Information", render: (v, set) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.email ?? "", onChange: (e) => set({
        ...v,
        email: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.phone ?? "", onChange: (e) => set({
        ...v,
        phone: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Address", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: v.address ?? "", onChange: (e) => set({
        ...v,
        address: e.target.value
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingCard, { skey: "social", title: "Social Links", render: (v, set) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.email ?? "", onChange: (e) => set({
        ...v,
        email: e.target.value
      }), placeholder: "mailto:..." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.phone ?? "", onChange: (e) => set({
        ...v,
        phone: e.target.value
      }), placeholder: "tel:..." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Website URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.website ?? "", onChange: (e) => set({
        ...v,
        website: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "KingsChat", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.kingschat ?? "", onChange: (e) => set({
        ...v,
        kingschat: e.target.value
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingCard, { skey: "livestream", title: "Livestream Button", render: (v, set) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.label ?? "", onChange: (e) => set({
        ...v,
        label: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.url ?? "", onChange: (e) => set({
        ...v,
        url: e.target.value
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingCard, { skey: "footer", title: "Footer", render: (v, set) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Copyright", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.copyright ?? "", onChange: (e) => set({
        ...v,
        copyright: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Support Links (JSON array)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 5, value: JSON.stringify(v.support_links ?? [], null, 2), onChange: (e) => {
        try {
          set({
            ...v,
            support_links: JSON.parse(e.target.value)
          });
        } catch {
        }
      }, className: "font-mono text-xs" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingCard, { skey: "seo", title: "SEO Metadata", render: (v, set) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Site Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.site_title ?? "", onChange: (e) => set({
        ...v,
        site_title: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Site Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: v.site_description ?? "", onChange: (e) => set({
        ...v,
        site_description: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MediaPicker, { label: "OG Image", value: v.og_image, onChange: (url) => set({
        ...v,
        og_image: url
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingCard, { skey: "analytics", title: "Analytics Scripts", render: (v, set) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Google Analytics ID", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.ga_id ?? "", onChange: (e) => set({
        ...v,
        ga_id: e.target.value
      }), placeholder: "G-XXXXXXX" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Custom Head Script", hint: "Pasted verbatim into <head>", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 5, value: v.head_script ?? "", onChange: (e) => set({
        ...v,
        head_script: e.target.value
      }), className: "font-mono text-xs" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingCard, { skey: "homepage", title: "Homepage Copy", render: (v, set) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mission Section Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.mission_title ?? "", onChange: (e) => set({
        ...v,
        mission_title: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Programs Section Intro", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.programs_intro ?? "", onChange: (e) => set({
        ...v,
        programs_intro: e.target.value
      }) }) })
    ] }) })
  ] });
}
export {
  SettingsAdmin as component
};
