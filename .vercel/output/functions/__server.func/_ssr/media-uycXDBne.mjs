import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, h as createMediaSignedUrl, r as recordMediaAsset, d as adminDelete, a as adminList } from "./admin.functions-B8Ws9k6i.mjs";
import { s as supabase } from "./client-CW46O5zz.mjs";
import { P as PageHeader, I as Input, B as Button } from "./ui-DcRKsItl.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, w as Upload, S as Search, x as Copy, T as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./auth-middleware-DQksU7Dh.mjs";
function MediaAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const sign = useServerFn(createMediaSignedUrl);
  const record = useServerFn(recordMediaAsset);
  const del = useServerFn(adminDelete);
  const [search, setSearch] = reactExports.useState("");
  const [folder, setFolder] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const q = useQuery({
    queryKey: ["a", "media_assets"],
    queryFn: () => list({
      data: {
        table: "media_assets"
      }
    })
  });
  const items = (q.data ?? []).filter((m) => (!search || m.file_name?.toLowerCase().includes(search.toLowerCase())) && (!folder || m.folder === folder));
  const folders = Array.from(new Set((q.data ?? []).map((m) => m.folder).filter(Boolean)));
  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const path = `${folder || "general"}/${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "_")}`;
      const {
        error: upErr
      } = await supabase.storage.from("media").upload(path, file);
      if (upErr) throw upErr;
      const {
        url
      } = await sign({
        data: {
          path
        }
      });
      await record({
        data: {
          file_name: file.name,
          file_path: path,
          public_url: url,
          mime_type: file.type,
          size_bytes: file.size,
          folder: folder || "general"
        }
      });
      qc.invalidateQueries({
        queryKey: ["a", "media_assets"]
      });
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };
  const remove = useMutation({
    mutationFn: async (item) => {
      await supabase.storage.from("media").remove([item.file_path]).catch(() => {
      });
      await del({
        data: {
          table: "media_assets",
          id: item.id
        }
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["a", "media_assets"]
      });
      toast.success("Deleted");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Media Library", description: "Upload and manage all images and videos.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.14em] bg-gold text-white hover:bg-gold-soft cursor-pointer", children: [
      uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
      "Upload",
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*,video/*", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        if (f) handleUpload(f);
      } })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-64", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "pl-9", placeholder: "Search media…", value: search, onChange: (e) => setSearch(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: folder, onChange: (e) => setFolder(e.target.value), className: "px-3 py-2 rounded-md border border-black/10 text-sm bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All folders" }),
        folders.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f, children: f }, f))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "New folder name", value: folder, onChange: (e) => setFolder(e.target.value), className: "w-48" })
    ] }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4", children: [
      items.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-black/5 rounded-lg overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-light overflow-hidden", children: m.mime_type?.startsWith("video/") ? /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: m.public_url, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.public_url, alt: m.file_name, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium truncate", children: m.file_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-charcoal/50 mt-1", children: m.folder }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "!px-2 !py-1", onClick: () => {
              navigator.clipboard.writeText(m.public_url);
              toast.success("URL copied");
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "!px-2 !py-1", onClick: () => {
              if (confirm("Delete this file?")) remove.mutate(m);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3 text-red-500" }) })
          ] })
        ] })
      ] }, m.id)),
      !items.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full text-center text-sm text-charcoal/50 py-12", children: "No media found." })
    ] })
  ] });
}
export {
  MediaAdmin as component
};
