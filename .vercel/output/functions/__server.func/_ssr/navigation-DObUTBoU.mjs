import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, c as adminUpsert, d as adminDelete, a as adminList } from "./admin.functions-B8Ws9k6i.mjs";
import { P as PageHeader, B as Button, C as Card, F as Field, I as Input } from "./ui-DcRKsItl.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { s as Plus, L as LoaderCircle, t as ChevronUp, u as ChevronDown, T as Trash2 } from "../_libs/lucide-react.mjs";
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
function NavAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const q = useQuery({
    queryKey: ["a", "navigation_items"],
    queryFn: () => list({
      data: {
        table: "navigation_items"
      }
    })
  });
  const [openIds, setOpenIds] = reactExports.useState({});
  const toggle = (id) => setOpenIds((s) => ({
    ...s,
    [id]: !s[id]
  }));
  const save = useMutation({
    mutationFn: (row) => upsert({
      data: {
        table: "navigation_items",
        row
      }
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["a", "navigation_items"]
      });
      qc.invalidateQueries({
        queryKey: ["homepage"]
      });
      qc.invalidateQueries({
        queryKey: ["site-chrome"]
      });
      toast.success("Saved");
    },
    onError: (e) => toast.error(e.message ?? "Save failed")
  });
  const remove = useMutation({
    mutationFn: (id) => del({
      data: {
        table: "navigation_items",
        id
      }
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["a", "navigation_items"]
    })
  });
  const items = q.data ?? [];
  const roots = items.filter((i) => !i.parent_id).sort((a, b) => a.display_order - b.display_order);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Navigation", description: "Manage menu items, sub-menus, and ordering.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => save.mutate({
      label: "New Item",
      url: "/",
      display_order: roots.length,
      is_active: true,
      is_external: false
    }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
      " Add Item"
    ] }) }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: roots.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavItemRow, { item, childItems: items.filter((c) => c.parent_id === item.id).sort((a, b) => a.display_order - b.display_order), openIds, onToggle: toggle, onSave: (r) => save.mutate(r), onDelete: (id) => {
      if (confirm("Delete?")) remove.mutate(id);
    }, onAddChild: () => save.mutate({
      label: "Sub-item",
      url: "/",
      parent_id: item.id,
      display_order: items.filter((c) => c.parent_id === item.id).length,
      is_active: true,
      is_external: false
    }) }, item.id)) })
  ] });
}
function NavItemRow({
  item,
  childItems,
  openIds,
  onToggle,
  onSave,
  onDelete,
  onAddChild
}) {
  const [local, setLocal] = reactExports.useState(item);
  const set = (k, v) => setLocal((s) => ({
    ...s,
    [k]: v
  }));
  const expanded = !!openIds[item.id];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "!p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onToggle(item.id), className: "flex-1 text-left flex items-center gap-3", children: [
        expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-navy-deep", children: local.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-charcoal/50", children: local.url }),
        !local.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase text-charcoal/40", children: "Hidden" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => onDelete(item.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 text-red-500" }) })
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 pt-2 border-t border-black/5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.label, onChange: (e) => set("label", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.url, onChange: (e) => set("url", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Order", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: local.display_order, onChange: (e) => set("display_order", Number(e.target.value)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "External Link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-sm h-9", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: local.is_external, onChange: (e) => set("is_external", e.target.checked) }),
          " Opens new tab"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: local.is_active, onChange: (e) => set("is_active", e.target.checked) }),
        " Active"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => onSave(local), children: "Save" }),
        !item.parent_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onAddChild, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
          " Sub-item"
        ] })
      ] }),
      childItems?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-4 border-l-2 border-gold/30 space-y-2 mt-3", children: childItems.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavItemRow, { item: c, childItems: [], openIds, onToggle, onSave, onDelete, onAddChild: () => {
      } }, c.id)) })
    ] })
  ] });
}
export {
  NavAdmin as component
};
