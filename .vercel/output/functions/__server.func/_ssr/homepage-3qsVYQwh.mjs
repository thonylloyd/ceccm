import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader } from "./ui-DcRKsItl.mjs";
import { S as SectionEditor } from "./SectionEditor-xGT2_OhJ.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./admin.functions-B8Ws9k6i.mjs";
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
import "./MediaPicker-pIWHjKsi.mjs";
import "../_libs/lucide-react.mjs";
const TABS = [{
  id: "hero",
  label: "Hero"
}, {
  id: "mission",
  label: "Mission"
}, {
  id: "stats",
  label: "Statistics"
}, {
  id: "programs",
  label: "Programs"
}, {
  id: "resources",
  label: "Resources"
}];
const HERO_FIELDS = [{
  key: "eyebrow",
  label: "Welcome Text (Eyebrow)",
  type: "text",
  placeholder: "Welcome to"
}, {
  key: "heading",
  label: "Heading",
  type: "textarea",
  placeholder: "Church Consolidation Mission"
}, {
  key: "subheading",
  label: "Subheading",
  type: "text",
  placeholder: "Consolidating the Body of Christ"
}, {
  key: "background_image_url",
  label: "Background Image",
  type: "image"
}, {
  key: "overlay_opacity",
  label: "Overlay Opacity (0–1)",
  type: "number"
}, {
  key: "primary_cta_label",
  label: "Primary Button Label",
  type: "text"
}, {
  key: "primary_cta_url",
  label: "Primary Button URL",
  type: "url"
}, {
  key: "secondary_cta_label",
  label: "Secondary Button Label",
  type: "text"
}, {
  key: "secondary_cta_url",
  label: "Secondary Button URL",
  type: "url"
}];
const MISSION_FIELDS = [{
  key: "title",
  label: "Title",
  type: "text"
}, {
  key: "description",
  label: "Description",
  type: "textarea"
}, {
  key: "icon",
  label: "Icon",
  type: "icon"
}];
const STAT_FIELDS = [{
  key: "value",
  label: "Number",
  type: "text",
  placeholder: "50+"
}, {
  key: "label",
  label: "Label",
  type: "text",
  placeholder: "Countries Reached"
}, {
  key: "icon",
  label: "Icon",
  type: "icon"
}];
const PROGRAM_FIELDS = [{
  key: "title",
  label: "Event Title",
  type: "text"
}, {
  key: "description",
  label: "Description",
  type: "textarea"
}, {
  key: "event_date",
  label: "Date",
  type: "date"
}, {
  key: "event_type",
  label: "Event Type",
  type: "text",
  placeholder: "Virtual Event"
}, {
  key: "location",
  label: "Location",
  type: "text",
  placeholder: "Lagos, Nigeria or Online"
}, {
  key: "image_url",
  label: "Event Image",
  type: "image"
}, {
  key: "cta_label",
  label: "CTA Label",
  type: "text"
}, {
  key: "registration_url",
  label: "Registration URL",
  type: "url"
}];
const RESOURCE_FIELDS = [{
  key: "title",
  label: "Title",
  type: "text"
}, {
  key: "description",
  label: "Description",
  type: "textarea"
}, {
  key: "image_url",
  label: "Image",
  type: "image"
}, {
  key: "cta_label",
  label: "CTA Label",
  type: "text"
}, {
  key: "cta_url",
  label: "CTA URL",
  type: "url"
}];
function HomepageAdmin() {
  const [tab, setTab] = reactExports.useState("hero");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Homepage", description: "Manage all homepage sections." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 border-b border-black/10 mb-6", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t.id), className: `px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] border-b-2 -mb-px transition-colors ${tab === t.id ? "border-gold text-navy-deep" : "border-transparent text-charcoal/60 hover:text-navy-deep"}`, children: t.label }, t.id)) }),
    tab === "hero" && /* @__PURE__ */ jsxRuntimeExports.jsx(SectionEditor, { title: "Hero Banners", description: "Slides shown in the main hero carousel. Add unlimited banners.", table: "hero_banners", fields: HERO_FIELDS, defaults: {
      eyebrow: "Welcome to",
      heading: "New Banner",
      overlay_opacity: 0.55
    }, titleKey: "heading" }),
    tab === "mission" && /* @__PURE__ */ jsxRuntimeExports.jsx(SectionEditor, { title: "Mission Cards", table: "mission_cards", fields: MISSION_FIELDS, defaults: {
      title: "New Mission",
      description: "",
      icon: "globe"
    } }),
    tab === "stats" && /* @__PURE__ */ jsxRuntimeExports.jsx(SectionEditor, { title: "Statistics", table: "statistics", fields: STAT_FIELDS, defaults: {
      value: "0+",
      label: "New Stat"
    }, titleKey: "label" }),
    tab === "programs" && /* @__PURE__ */ jsxRuntimeExports.jsx(SectionEditor, { title: "Upcoming Programs", description: "Events shown in the homepage programs carousel.", table: "programs", fields: PROGRAM_FIELDS, defaults: {
      title: "New Program",
      cta_label: "Register Now"
    } }),
    tab === "resources" && /* @__PURE__ */ jsxRuntimeExports.jsx(SectionEditor, { title: "Resource Cards", table: "resource_cards", fields: RESOURCE_FIELDS, defaults: {
      title: "New Resource",
      cta_label: "Click Here"
    } })
  ] });
}
export {
  HomepageAdmin as component
};
