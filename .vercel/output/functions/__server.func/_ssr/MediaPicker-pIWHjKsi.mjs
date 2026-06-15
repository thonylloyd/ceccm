import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, a as adminList, h as createMediaSignedUrl, r as recordMediaAsset } from "./admin.functions-B8Ws9k6i.mjs";
import { s as supabase } from "./client-CW46O5zz.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { X, p as Image, L as LoaderCircle, w as Upload } from "../_libs/lucide-react.mjs";
function MediaPicker({
  value,
  onChange,
  label = "Image"
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/60 mb-1.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-20 w-32 rounded-md overflow-hidden bg-light border border-black/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: value, alt: "", className: "h-full w-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onChange(null),
            className: "absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-32 rounded-md border border-dashed border-black/15 flex items-center justify-center text-charcoal/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "url",
            placeholder: "Paste image URL",
            value: value ?? "",
            onChange: (e) => onChange(e.target.value || null),
            className: "px-3 py-2 rounded-md border border-black/10 text-sm w-full"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setOpen(true),
            className: "px-3 py-2 rounded-md bg-navy-deep text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-navy",
            children: "Browse / Upload"
          }
        )
      ] })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MediaBrowser,
      {
        onClose: () => setOpen(false),
        onSelect: (url) => {
          onChange(url);
          setOpen(false);
        }
      }
    )
  ] });
}
function MediaBrowser({ onClose, onSelect }) {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const sign = useServerFn(createMediaSignedUrl);
  const record = useServerFn(recordMediaAsset);
  const [uploading, setUploading] = reactExports.useState(false);
  const q = useQuery({
    queryKey: ["a", "media_assets"],
    queryFn: () => list({ data: { table: "media_assets" } })
  });
  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "_")}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file);
      if (upErr) throw upErr;
      const { url } = await sign({ data: { path } });
      await record({
        data: {
          file_name: file.name,
          file_path: path,
          public_url: url,
          mime_type: file.type,
          size_bytes: file.size,
          folder: "general"
        }
      });
      await qc.invalidateQueries({ queryKey: ["a", "media_assets"] });
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg text-navy-deep", children: "Media Library" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gold text-white text-xs font-semibold uppercase tracking-[0.14em] rounded-md hover:bg-gold-soft", children: [
          uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
          "Upload",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: "image/*,video/*",
              className: "hidden",
              onChange: (e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 text-charcoal/60 hover:text-navy-deep", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 overflow-y-auto", children: q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-navy-deep mx-auto" }) : !q.data?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-charcoal/50 py-12", children: "No media yet. Upload your first asset." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: q.data.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => onSelect(m.public_url),
        className: "group relative aspect-square rounded-md overflow-hidden bg-light border border-black/10 hover:border-gold",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.public_url, alt: m.file_name, className: "h-full w-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] py-1 px-2 truncate opacity-0 group-hover:opacity-100", children: m.file_name })
        ]
      },
      m.id
    )) }) })
  ] }) });
}
export {
  MediaPicker as M
};
