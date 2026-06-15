import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, a as adminList, c as adminUpsert, d as adminDelete } from "./admin.functions-B8Ws9k6i.mjs";
import { B as Button, C as Card, F as Field, T as Textarea, I as Input } from "./ui-DcRKsItl.mjs";
import { M as MediaPicker } from "./MediaPicker-pIWHjKsi.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as Plus, L as LoaderCircle, t as ChevronUp, u as ChevronDown, T as Trash2 } from "../_libs/lucide-react.mjs";
function SectionEditor({
  title,
  description,
  table,
  fields,
  defaults,
  titleKey = "title"
}) {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const q = useQuery({
    queryKey: ["a", table],
    queryFn: () => list({ data: { table } })
  });
  const [expanded, setExpanded] = reactExports.useState(null);
  const save = useMutation({
    mutationFn: (row) => upsert({ data: { table, row } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["a", table] });
      qc.invalidateQueries({ queryKey: ["homepage"] });
      toast.success("Saved");
    },
    onError: (e) => toast.error(e.message ?? "Save failed")
  });
  const remove = useMutation({
    mutationFn: (id) => del({ data: { table, id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["a", table] });
      qc.invalidateQueries({ queryKey: ["homepage"] });
      toast.success("Deleted");
    }
  });
  const addNew = () => {
    const order = q.data?.length ?? 0;
    save.mutate({ ...defaults, display_order: order, is_active: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl text-navy-deep", children: title }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-charcoal/60 mt-0.5", children: description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: addNew, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
        "Add"
      ] })
    ] }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-navy-deep" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      q.data?.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ItemRow,
        {
          row,
          fields,
          titleKey,
          expanded: expanded === row.id,
          onToggle: () => setExpanded(expanded === row.id ? null : row.id),
          onSave: (r) => save.mutate(r),
          onDelete: () => {
            if (confirm("Delete this item?")) remove.mutate(row.id);
          },
          saving: save.isPending
        },
        row.id
      )),
      !q.data?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-charcoal/50 py-8 bg-white rounded-lg border border-black/5", children: 'No items yet. Click "Add" to create one.' })
    ] })
  ] });
}
function ItemRow({
  row,
  fields,
  titleKey,
  expanded,
  onToggle,
  onSave,
  onDelete,
  saving
}) {
  const [local, setLocal] = reactExports.useState(row);
  const set = (k, v) => setLocal((s) => ({ ...s, [k]: v }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "!p-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onToggle, className: "flex-1 text-left flex items-center gap-3", children: [
        expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-navy-deep truncate", children: local[titleKey] || "(Untitled)" }),
        !local.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-charcoal/40", children: "Hidden" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: onDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 text-red-500" }) })
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 pt-2 border-t border-black/5 space-y-3", children: [
      fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: f.label, children: f.type === "textarea" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: local[f.key] ?? "", onChange: (e) => set(f.key, e.target.value), placeholder: f.placeholder }) : f.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx(MediaPicker, { label: "", value: local[f.key], onChange: (url) => set(f.key, url) }) : f.type === "checkbox" ? /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!local[f.key], onChange: (e) => set(f.key, e.target.checked) }) : f.type === "icon" ? /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: local[f.key] ?? "", onChange: (e) => set(f.key, e.target.value), className: "w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white", children: ["globe", "compass", "graduation-cap", "heart", "book", "users", "hand", "church", "cross", "sparkles", "radio", "calendar", "download"].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: i }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text",
          value: local[f.key] ?? "",
          onChange: (e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value),
          placeholder: f.placeholder
        }
      ) }, f.key)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Display Order", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: local.display_order ?? 0, onChange: (e) => set("display_order", Number(e.target.value)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!local.is_active, onChange: (e) => set("is_active", e.target.checked) }),
        "Active (visible on site)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 pt-2 border-t border-black/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => onSave(local), disabled: saving, children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : "Save" }) })
    ] })
  ] });
}
export {
  SectionEditor as S
};
