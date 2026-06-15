import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, c as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, a as adminList, c as adminUpsert, d as adminDelete } from "./admin.functions-B8Ws9k6i.mjs";
import { P as PageHeader, B as Button, C as Card, F as Field, I as Input, T as Textarea } from "./ui-DcRKsItl.mjs";
import { M as MediaPicker } from "./MediaPicker-pIWHjKsi.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { s as Plus, L as LoaderCircle, t as ChevronUp, u as ChevronDown, v as Star, T as Trash2 } from "../_libs/lucide-react.mjs";
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
const TABS = [{
  id: "videos",
  label: "Videos"
}, {
  id: "categories",
  label: "Categories"
}, {
  id: "cta",
  label: "CTA Strip"
}];
function VideosAdmin() {
  const [tab, setTab] = reactExports.useState("videos");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Videos", description: "Manage video library, categories, and the CTA strip." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 border-b border-black/10 mb-6", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t.id), className: `px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] border-b-2 -mb-px transition-colors ${tab === t.id ? "border-gold text-navy-deep" : "border-transparent text-charcoal/60 hover:text-navy-deep"}`, children: t.label }, t.id)) }),
    tab === "videos" && /* @__PURE__ */ jsxRuntimeExports.jsx(VideosList, {}),
    tab === "categories" && /* @__PURE__ */ jsxRuntimeExports.jsx(CategoriesList, {}),
    tab === "cta" && /* @__PURE__ */ jsxRuntimeExports.jsx(CtaEditor, {})
  ] });
}
function useCrud(table, invalidates = []) {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const q = useQuery({
    queryKey: ["a", table],
    queryFn: () => list({
      data: {
        table
      }
    })
  });
  const save = useMutation({
    mutationFn: (row) => upsert({
      data: {
        table,
        row
      }
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["a", table]
      });
      invalidates.forEach((k) => qc.invalidateQueries({
        queryKey: [k]
      }));
      toast.success("Saved");
    },
    onError: (e) => toast.error(e.message)
  });
  const remove = useMutation({
    mutationFn: (id) => del({
      data: {
        table,
        id
      }
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["a", table]
      });
      invalidates.forEach((k) => qc.invalidateQueries({
        queryKey: [k]
      }));
      toast.success("Deleted");
    }
  });
  return {
    q,
    save,
    remove
  };
}
function VideosList() {
  const listFn = useServerFn(adminList);
  const catsQ = useQuery({
    queryKey: ["a", "video_categories"],
    queryFn: () => listFn({
      data: {
        table: "video_categories"
      }
    })
  });
  const {
    q,
    save,
    remove
  } = useCrud("videos", ["videos", "videos/library"]);
  const [open, setOpen] = reactExports.useState(null);
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
  const add = () => save.mutate({
    title: "New Video",
    slug: `video-${Date.now()}`,
    is_published: true,
    is_featured: false,
    display_order: q.data?.length ?? 0
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: add, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
      " Add Video"
    ] }) }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      (q.data ?? []).map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(VideoEditor, { v, cats: catsQ.data ?? [], expanded: open === v.id, onToggle: () => setOpen(open === v.id ? null : v.id), onSave: (row) => {
        if (!row.slug || row.slug.startsWith("video-")) row.slug = slugify(row.title);
        save.mutate(row);
      }, onDelete: () => confirm("Delete?") && remove.mutate(v.id) }, v.id)),
      !q.data?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-charcoal/55 py-10", children: "No videos yet." })
    ] })
  ] });
}
function VideoEditor({
  v,
  cats,
  expanded,
  onToggle,
  onSave,
  onDelete
}) {
  const [local, setLocal] = reactExports.useState(v);
  const set = (k, val) => setLocal((s) => ({
    ...s,
    [k]: val
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "!p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onToggle, className: "flex-1 text-left flex items-center gap-3", children: [
        expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }),
        local.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 text-gold fill-gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-navy-deep truncate", children: local.title || "(Untitled)" }),
        !local.is_published && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase text-charcoal/40", children: "Draft" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: onDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 text-red-500" }) })
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 pt-2 border-t border-black/5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.title ?? "", onChange: (e) => set("title", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Slug", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.slug ?? "", onChange: (e) => set("slug", e.target.value), placeholder: "auto from title" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: local.description ?? "", onChange: (e) => set("description", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Thumbnail", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MediaPicker, { label: "", value: local.thumbnail_url, onChange: (u) => set("thumbnail_url", u) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Video URL (uploaded file)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.video_url ?? "", onChange: (e) => set("video_url", e.target.value), placeholder: "https://..." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "YouTube URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.youtube_url ?? "", onChange: (e) => set("youtube_url", e.target.value), placeholder: "https://youtube.com/watch?v=..." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Vimeo URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.vimeo_url ?? "", onChange: (e) => set("vimeo_url", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Speaker", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.speaker ?? "", onChange: (e) => set("speaker", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Duration", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.duration ?? "", onChange: (e) => set("duration", e.target.value), placeholder: "45:00" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Publish Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: local.publish_date ?? "", onChange: (e) => set("publish_date", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: local.category_id ?? "", onChange: (e) => set("category_id", e.target.value || null), className: "w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— None —" }),
          cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Display Order", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: local.display_order ?? 0, onChange: (e) => set("display_order", Number(e.target.value)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tags (comma separated)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: (local.tags ?? []).join(", "), onChange: (e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "SEO Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.seo_title ?? "", onChange: (e) => set("seo_title", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "SEO Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.seo_description ?? "", onChange: (e) => set("seo_description", e.target.value) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!local.is_featured, onChange: (e) => set("is_featured", e.target.checked) }),
          " Featured"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!local.is_published, onChange: (e) => set("is_published", e.target.checked) }),
          " Published"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => onSave(local), children: "Save" })
    ] })
  ] });
}
function CategoriesList() {
  const {
    q,
    save,
    remove
  } = useCrud("video_categories", ["videos/library"]);
  const add = () => save.mutate({
    name: "New Category",
    slug: `cat-${Date.now()}`,
    display_order: q.data?.length ?? 0
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: add, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
      " Add Category"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (q.data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryRow, { c, onSave: (r) => save.mutate(r), onDelete: () => confirm("Delete?") && remove.mutate(c.id) }, c.id)) })
  ] });
}
function CategoryRow({
  c,
  onSave,
  onDelete
}) {
  const [local, setLocal] = reactExports.useState(c);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.name, onChange: (e) => setLocal((s) => ({
      ...s,
      name: e.target.value,
      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    })), className: "flex-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: local.display_order, onChange: (e) => setLocal((s) => ({
      ...s,
      display_order: Number(e.target.value)
    })), className: "w-20" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => onSave(local), children: "Save" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: onDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 text-red-500" }) })
  ] });
}
function CtaEditor() {
  const {
    q,
    save,
    remove
  } = useCrud("video_cta", ["videos/library"]);
  const item = (q.data ?? [])[0];
  const add = () => save.mutate({
    is_visible: true,
    title: "Featured Announcement",
    description: "",
    button_text: "Learn More",
    button_url: "#",
    background_color: "#041E4A",
    text_color: "#FFFFFF",
    open_new_tab: false
  });
  if (!item) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-charcoal/55 mb-4", children: "No CTA strip configured." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: add, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
      " Create CTA"
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CtaForm, { item, onSave: (r) => save.mutate(r), onDelete: () => confirm("Delete CTA?") && remove.mutate(item.id) });
}
function CtaForm({
  item,
  onSave,
  onDelete
}) {
  const [local, setLocal] = reactExports.useState(item);
  const set = (k, v) => setLocal((s) => ({
    ...s,
    [k]: v
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.title ?? "", onChange: (e) => set("title", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.description ?? "", onChange: (e) => set("description", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Button Text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.button_text ?? "", onChange: (e) => set("button_text", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Button URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: local.button_url ?? "", onChange: (e) => set("button_url", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Background Color", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "color", value: local.background_color ?? "#041E4A", onChange: (e) => set("background_color", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Text Color", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "color", value: local.text_color ?? "#FFFFFF", onChange: (e) => set("text_color", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Start Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: local.start_date?.slice(0, 10) ?? "", onChange: (e) => set("start_date", e.target.value || null) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "End Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: local.end_date?.slice(0, 10) ?? "", onChange: (e) => set("end_date", e.target.value || null) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!local.is_visible, onChange: (e) => set("is_visible", e.target.checked) }),
        " Visible"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!local.open_new_tab, onChange: (e) => set("open_new_tab", e.target.checked) }),
        " Open in new tab"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => onSave(local), children: "Save" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: onDelete, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 text-red-500" }),
        " Delete"
      ] })
    ] })
  ] });
}
export {
  VideosAdmin as component
};
