import { j as jsxRuntimeExports } from "../_libs/react.mjs";
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
function ProgramsAdmin() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Programs", description: "All ministry events and gatherings." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionEditor, { title: "Programs", table: "programs", fields: [{
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
      type: "text"
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
    }], defaults: {
      title: "New Program",
      cta_label: "Register Now"
    } })
  ] });
}
export {
  ProgramsAdmin as component
};
