import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert, adminDelete } from "@/lib/admin.functions";
import { adminSetVideoAccess } from "@/lib/access.functions";
import { PageHeader, Field, Input, Textarea, Button, Card } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/videos")({
  component: VideosAdmin,
});

const TABS = [
  { id: "videos", label: "Videos" },
  { id: "categories", label: "Categories" },
  { id: "cta", label: "CTA Strip" },
] as const;

function VideosAdmin() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("videos");
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader title="Videos" description="Manage video library, categories, and the CTA strip." />
      <div className="flex gap-1 border-b border-black/10 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-gold text-navy-deep" : "border-transparent text-charcoal/60 hover:text-navy-deep"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "videos" && <VideosList />}
      {tab === "categories" && <CategoriesList />}
      {tab === "cta" && <CtaEditor />}
    </div>
  );
}

function useCrud(table: string, invalidates: string[] = []) {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const q = useQuery({ queryKey: ["a", table], queryFn: () => list({ data: { table } }) as any });
  const save = useMutation({
    mutationFn: (row: any) => upsert({ data: { table, row } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["a", table] });
      invalidates.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { table, id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["a", table] });
      invalidates.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
      toast.success("Deleted");
    },
  });
  return { q, save, remove };
}

function VideosList() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminList);
  const upsertFn = useServerFn(adminUpsert);
  const delFn = useServerFn(adminDelete);
  const setAccessFn = useServerFn(adminSetVideoAccess);
  const catsQ = useQuery({ queryKey: ["a", "video_categories"], queryFn: () => listFn({ data: { table: "video_categories" } }) as any });
  const q = useQuery({ queryKey: ["a", "videos"], queryFn: () => listFn({ data: { table: "videos" } }) as any });
  const [open, setOpen] = useState<string | null>(null);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

  const save = useMutation({
    mutationFn: async (row: any) => {
      const { _new_password, access_mode, price_espees, ...rest } = row;
      if (!rest.slug || rest.slug.startsWith("video-")) rest.slug = slugify(rest.title);
      const saved: any = await upsertFn({ data: { table: "videos", row: rest } });
      if (saved?.id && (access_mode || _new_password || price_espees != null)) {
        await setAccessFn({ data: {
          id: saved.id,
          access_mode: (access_mode ?? "free") as any,
          password: _new_password ? _new_password : undefined,
          price_espees: price_espees ?? null,
        }});
      }
      return saved;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["a", "videos"] });
      qc.invalidateQueries({ queryKey: ["videos", "library"] });
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { table: "videos", id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "videos"] }); toast.success("Deleted"); },
  });

  const add = () => save.mutate({
    title: "New Video", slug: `video-${Date.now()}`, is_published: true, is_featured: false,
    display_order: (q.data?.length ?? 0),
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={add}><Plus className="h-3.5 w-3.5" /> Add Video</Button>
      </div>
      {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-3">
          {(q.data ?? []).map((v: any) => (
            <VideoEditor
              key={v.id}
              v={v}
              cats={catsQ.data ?? []}
              expanded={open === v.id}
              onToggle={() => setOpen(open === v.id ? null : v.id)}
              onSave={(row: any) => save.mutate(row)}
              onDelete={() => confirm("Delete?") && remove.mutate(v.id)}
            />
          ))}
          {!q.data?.length && <div className="text-center text-sm text-charcoal/55 py-10">No videos yet.</div>}
        </div>
      )}
    </div>
  );
}

function VideoEditor({ v, cats, expanded, onToggle, onSave, onDelete }: any) {
  const [local, setLocal] = useState(v);
  const set = (k: string, val: any) => setLocal((s: any) => ({ ...s, [k]: val }));

  return (
    <Card className="!p-0">
      <div className="flex items-center px-4 py-3">
        <button onClick={onToggle} className="flex-1 text-left flex items-center gap-3">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {local.is_featured && <Star className="h-3.5 w-3.5 text-gold fill-gold" />}
          <span className="font-medium text-sm text-navy-deep truncate">{local.title || "(Untitled)"}</span>
          {!local.is_published && <span className="text-[10px] uppercase text-charcoal/40">Draft</span>}
        </button>
        <Button variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-black/5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title"><Input value={local.title ?? ""} onChange={(e) => set("title", e.target.value)} /></Field>
            <Field label="Slug"><Input value={local.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" /></Field>
          </div>
          <Field label="Description"><Textarea rows={3} value={local.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
          <Field label="Thumbnail"><MediaPicker label="" value={local.thumbnail_url} onChange={(u) => set("thumbnail_url", u)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Video URL (uploaded file)"><Input value={local.video_url ?? ""} onChange={(e) => set("video_url", e.target.value)} placeholder="https://..." /></Field>
            <Field label="YouTube URL"><Input value={local.youtube_url ?? ""} onChange={(e) => set("youtube_url", e.target.value)} placeholder="https://youtube.com/watch?v=..." /></Field>
            <Field label="Vimeo URL"><Input value={local.vimeo_url ?? ""} onChange={(e) => set("vimeo_url", e.target.value)} /></Field>
            <Field label="Speaker"><Input value={local.speaker ?? ""} onChange={(e) => set("speaker", e.target.value)} /></Field>
            <Field label="Duration"><Input value={local.duration ?? ""} onChange={(e) => set("duration", e.target.value)} placeholder="45:00" /></Field>
            <Field label="Publish Date"><Input type="date" value={local.publish_date ?? ""} onChange={(e) => set("publish_date", e.target.value)} /></Field>
            <Field label="Category">
              <select value={local.category_id ?? ""} onChange={(e) => set("category_id", e.target.value || null)} className="w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white">
                <option value="">— None —</option>
                {cats.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Display Order"><Input type="number" value={local.display_order ?? 0} onChange={(e) => set("display_order", Number(e.target.value))} /></Field>
          </div>
          <Field label="Tags (comma separated)">
            <Input
              value={(local.tags ?? []).join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="SEO Title"><Input value={local.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} /></Field>
            <Field label="SEO Description"><Input value={local.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} /></Field>
          </div>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!local.is_featured} onChange={(e) => set("is_featured", e.target.checked)} /> Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!local.is_published} onChange={(e) => set("is_published", e.target.checked)} /> Published
            </label>
          </div>
          <Button onClick={() => onSave(local)}>Save</Button>
        </div>
      )}
    </Card>
  );
}

function CategoriesList() {
  const { q, save, remove } = useCrud("video_categories", ["videos/library"]);
  const add = () => save.mutate({ name: "New Category", slug: `cat-${Date.now()}`, display_order: (q.data?.length ?? 0) });
  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={add}><Plus className="h-3.5 w-3.5" /> Add Category</Button></div>
      <div className="space-y-2">
        {(q.data ?? []).map((c: any) => (
          <CategoryRow key={c.id} c={c} onSave={(r: any) => save.mutate(r)} onDelete={() => confirm("Delete?") && remove.mutate(c.id)} />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({ c, onSave, onDelete }: any) {
  const [local, setLocal] = useState(c);
  return (
    <Card className="flex items-center gap-3">
      <Input value={local.name} onChange={(e) => setLocal((s: any) => ({ ...s, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))} className="flex-1" />
      <Input type="number" value={local.display_order} onChange={(e) => setLocal((s: any) => ({ ...s, display_order: Number(e.target.value) }))} className="w-20" />
      <Button onClick={() => onSave(local)}>Save</Button>
      <Button variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
    </Card>
  );
}

function CtaEditor() {
  const { q, save, remove } = useCrud("video_cta", ["videos/library"]);
  const item = (q.data ?? [])[0];
  const add = () => save.mutate({
    is_visible: true, title: "Featured Announcement", description: "",
    button_text: "Learn More", button_url: "#", background_color: "#041E4A", text_color: "#FFFFFF", open_new_tab: false,
  });

  if (!item) return (
    <div className="text-center py-10">
      <p className="text-charcoal/55 mb-4">No CTA strip configured.</p>
      <Button onClick={add}><Plus className="h-3.5 w-3.5" /> Create CTA</Button>
    </div>
  );
  return <CtaForm item={item} onSave={(r: any) => save.mutate(r)} onDelete={() => confirm("Delete CTA?") && remove.mutate(item.id)} />;
}

function CtaForm({ item, onSave, onDelete }: any) {
  const [local, setLocal] = useState(item);
  const set = (k: string, v: any) => setLocal((s: any) => ({ ...s, [k]: v }));
  return (
    <Card className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Title"><Input value={local.title ?? ""} onChange={(e) => set("title", e.target.value)} /></Field>
        <Field label="Description"><Input value={local.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
        <Field label="Button Text"><Input value={local.button_text ?? ""} onChange={(e) => set("button_text", e.target.value)} /></Field>
        <Field label="Button URL"><Input value={local.button_url ?? ""} onChange={(e) => set("button_url", e.target.value)} /></Field>
        <Field label="Background Color"><Input type="color" value={local.background_color ?? "#041E4A"} onChange={(e) => set("background_color", e.target.value)} /></Field>
        <Field label="Text Color"><Input type="color" value={local.text_color ?? "#FFFFFF"} onChange={(e) => set("text_color", e.target.value)} /></Field>
        <Field label="Start Date"><Input type="date" value={local.start_date?.slice(0,10) ?? ""} onChange={(e) => set("start_date", e.target.value || null)} /></Field>
        <Field label="End Date"><Input type="date" value={local.end_date?.slice(0,10) ?? ""} onChange={(e) => set("end_date", e.target.value || null)} /></Field>
      </div>
      <div className="flex gap-6">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!local.is_visible} onChange={(e) => set("is_visible", e.target.checked)} /> Visible
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!local.open_new_tab} onChange={(e) => set("open_new_tab", e.target.checked)} /> Open in new tab
        </label>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(local)}>Save</Button>
        <Button variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-red-500" /> Delete</Button>
      </div>
    </Card>
  );
}
