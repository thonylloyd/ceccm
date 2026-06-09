import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, createMediaSignedUrl, recordMediaAsset } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function MediaPicker({
  value,
  onChange,
  label = "Image",
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/60 mb-1.5">
        {label}
      </label>
      <div className="flex gap-2">
        {value ? (
          <div className="relative h-20 w-32 rounded-md overflow-hidden bg-light border border-black/10">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="h-20 w-32 rounded-md border border-dashed border-black/15 flex items-center justify-center text-charcoal/30">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        <div className="flex flex-col gap-2 flex-1">
          <input
            type="url"
            placeholder="Paste image URL"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className="px-3 py-2 rounded-md border border-black/10 text-sm w-full"
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-3 py-2 rounded-md bg-navy-deep text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-navy"
          >
            Browse / Upload
          </button>
        </div>
      </div>
      {open && (
        <MediaBrowser
          onClose={() => setOpen(false)}
          onSelect={(url) => { onChange(url); setOpen(false); }}
        />
      )}
    </div>
  );
}

function MediaBrowser({ onClose, onSelect }: { onClose: () => void; onSelect: (url: string) => void }) {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const sign = useServerFn(createMediaSignedUrl);
  const record = useServerFn(recordMediaAsset);
  const [uploading, setUploading] = useState(false);

  const q = useQuery({
    queryKey: ["a", "media_assets"],
    queryFn: () => list({ data: { table: "media_assets" } }) as any,
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "_")}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file);
      if (upErr) throw upErr;
      const { url } = await sign({ data: { path } });
      await record({
        data: {
          file_name: file.name, file_path: path, public_url: url,
          mime_type: file.type, size_bytes: file.size, folder: "general",
        },
      });
      await qc.invalidateQueries({ queryKey: ["a", "media_assets"] });
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-display text-lg text-navy-deep">Media Library</h3>
          <div className="flex gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gold text-white text-xs font-semibold uppercase tracking-[0.14em] rounded-md hover:bg-gold-soft">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              Upload
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
              />
            </label>
            <button onClick={onClose} className="p-2 text-charcoal/60 hover:text-navy-deep"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="p-5 overflow-y-auto">
          {q.isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-navy-deep mx-auto" />
          ) : !q.data?.length ? (
            <div className="text-center text-sm text-charcoal/50 py-12">No media yet. Upload your first asset.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {q.data.map((m: any) => (
                <button
                  key={m.id}
                  onClick={() => onSelect(m.public_url)}
                  className="group relative aspect-square rounded-md overflow-hidden bg-light border border-black/10 hover:border-gold"
                >
                  <img src={m.public_url} alt={m.file_name} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] py-1 px-2 truncate opacity-0 group-hover:opacity-100">
                    {m.file_name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
