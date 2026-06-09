import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminDelete, createMediaSignedUrl, recordMediaAsset } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Button, Input } from "@/components/admin/ui";
import { Upload, Trash2, Loader2, Search, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaAdmin,
});

function MediaAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const sign = useServerFn(createMediaSignedUrl);
  const record = useServerFn(recordMediaAsset);
  const del = useServerFn(adminDelete);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("");
  const [uploading, setUploading] = useState(false);

  const q = useQuery({ queryKey: ["a", "media_assets"], queryFn: () => list({ data: { table: "media_assets" } }) as any });
  const items = (q.data ?? []).filter((m: any) =>
    (!search || m.file_name?.toLowerCase().includes(search.toLowerCase())) &&
    (!folder || m.folder === folder)
  );
  const folders = Array.from(new Set((q.data ?? []).map((m: any) => m.folder).filter(Boolean)));

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = `${folder || "general"}/${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "_")}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file);
      if (upErr) throw upErr;
      const { url } = await sign({ data: { path } });
      await record({ data: { file_name: file.name, file_path: path, public_url: url, mime_type: file.type, size_bytes: file.size, folder: folder || "general" } });
      qc.invalidateQueries({ queryKey: ["a", "media_assets"] });
      toast.success("Uploaded");
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const remove = useMutation({
    mutationFn: async (item: any) => {
      await supabase.storage.from("media").remove([item.file_path]).catch(() => {});
      await del({ data: { table: "media_assets", id: item.id } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "media_assets"] }); toast.success("Deleted"); },
  });

  return (
    <div className="p-8 max-w-6xl">
      <PageHeader
        title="Media Library"
        description="Upload and manage all images and videos."
        actions={
          <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.14em] bg-gold text-white hover:bg-gold-soft cursor-pointer">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Upload
            <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
          </label>
        }
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
          <Input className="pl-9" placeholder="Search media…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="px-3 py-2 rounded-md border border-black/10 text-sm bg-white">
          <option value="">All folders</option>
          {folders.map((f) => <option key={f as string} value={f as string}>{f as string}</option>)}
        </select>
        <Input placeholder="New folder name" value={folder} onChange={(e) => setFolder(e.target.value)} className="w-48" />
      </div>

      {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((m: any) => (
            <div key={m.id} className="bg-white border border-black/5 rounded-lg overflow-hidden group">
              <div className="aspect-square bg-light overflow-hidden">
                {m.mime_type?.startsWith("video/") ? (
                  <video src={m.public_url} className="h-full w-full object-cover" />
                ) : (
                  <img src={m.public_url} alt={m.file_name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-3">
                <div className="text-xs font-medium truncate">{m.file_name}</div>
                <div className="text-[10px] text-charcoal/50 mt-1">{m.folder}</div>
                <div className="flex gap-1 mt-2">
                  <Button variant="outline" className="!px-2 !py-1" onClick={() => { navigator.clipboard.writeText(m.public_url); toast.success("URL copied"); }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" className="!px-2 !py-1" onClick={() => { if (confirm("Delete this file?")) remove.mutate(m); }}>
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {!items.length && <div className="col-span-full text-center text-sm text-charcoal/50 py-12">No media found.</div>}
        </div>
      )}
    </div>
  );
}
