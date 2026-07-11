import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listResources, saveResource, deleteResource, getResourceStats,
  RESOURCE_TYPES, RESOURCE_AUDIENCES,
} from "@/lib/resources.functions";
import { Plus, Pencil, Trash2, ExternalLink, Loader2, Eye, EyeOff, BarChart2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/resources")({
  component: AdminResources,
});

type ResourceRow = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  resource_type: string;
  file_url: string | null;
  external_url: string | null;
  thumbnail_url: string | null;
  audience: string;
  tags: string[];
  is_published: boolean;
  sort_order: number;
};

const EMPTY: Partial<ResourceRow> = {
  title: "", description: "", category: "general", resource_type: "document",
  file_url: "", external_url: "", thumbnail_url: "", audience: "all",
  tags: [], is_published: true, sort_order: 0,
};

function AdminResources() {
  const qc = useQueryClient();
  const listFn = useServerFn(listResources);
  const saveFn = useServerFn(saveResource);
  const delFn = useServerFn(deleteResource);
  const statsFn = useServerFn(getResourceStats);

  const q = useQuery({ queryKey: ["admin-resources"], queryFn: () => listFn({ data: {} }) });
  const stats = useQuery({ queryKey: ["admin-resource-stats"], queryFn: () => statsFn() });

  const [editing, setEditing] = useState<Partial<ResourceRow> | null>(null);

  const save = useMutation({
    mutationFn: (row: any) => saveFn({ data: row }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-resources"] });
      setEditing(null);
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-resources"] }),
  });

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50">Portal</div>
          <h1 className="font-display text-3xl text-navy-deep">Resource Center</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Manage training materials, courses, videos, and documents for pastors.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex items-center gap-2 bg-gold text-navy-deep px-4 py-2 rounded-md text-sm font-semibold hover:bg-gold/90"
        >
          <Plus className="h-4 w-4" /> New Resource
        </button>
      </div>

      {q.isLoading ? (
        <div className="py-16 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-navy-deep" /></div>
      ) : (
        <div className="bg-white rounded-lg border border-black/5 shadow-elegant overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-deep/5 text-charcoal/70 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Audience</th>
                <th className="text-center px-4 py-3">Views</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(q.data ?? []).map((r: any) => {
                const url = r.external_url || r.file_url;
                return (
                  <tr key={r.id} className="border-t border-black/5">
                    <td className="px-4 py-3">
                      <div className="font-medium text-navy-deep">{r.title}</div>
                      {r.description && <div className="text-xs text-charcoal/60 line-clamp-1">{r.description}</div>}
                    </td>
                    <td className="px-4 py-3 capitalize text-charcoal/70">{r.resource_type}</td>
                    <td className="px-4 py-3 text-charcoal/70">{r.category}</td>
                    <td className="px-4 py-3 text-charcoal/70">{r.audience}</td>
                    <td className="px-4 py-3 text-center text-charcoal/70">
                      <span className="inline-flex items-center gap-1"><BarChart2 className="h-3.5 w-3.5" />{stats.data?.[r.id] ?? 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {r.is_published ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700"><Eye className="h-3 w-3" />Live</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-charcoal/10 text-charcoal/60"><EyeOff className="h-3 w-3" />Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {url && (
                          <a href={url} target="_blank" rel="noreferrer" className="p-1.5 text-charcoal/60 hover:text-gold"><ExternalLink className="h-4 w-4" /></a>
                        )}
                        <button onClick={() => setEditing(r)} className="p-1.5 text-charcoal/60 hover:text-navy-deep"><Pencil className="h-4 w-4" /></button>
                        <button
                          onClick={() => { if (confirm("Delete this resource?")) remove.mutate(r.id); }}
                          className="p-1.5 text-charcoal/60 hover:text-red-600"
                        ><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(q.data ?? []).length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-charcoal/50">No resources yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditModal
          value={editing}
          onCancel={() => setEditing(null)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
    </div>
  );
}

function EditModal({
  value, onCancel, onSave, saving,
}: {
  value: Partial<ResourceRow>;
  onCancel: () => void;
  onSave: (v: any) => void;
  saving: boolean;
}) {
  const [f, setF] = useState<Partial<ResourceRow>>(value);
  const set = (k: string, v: any) => setF((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-black/5 sticky top-0 bg-white flex items-center justify-between">
          <h2 className="font-display text-xl text-navy-deep">{f.id ? "Edit Resource" : "New Resource"}</h2>
          <button onClick={onCancel} className="text-charcoal/60 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Title">
            <input value={f.title ?? ""} onChange={(e) => set("title", e.target.value)}
              className="w-full px-3 py-2 border border-black/10 rounded-md text-sm" />
          </Field>
          <Field label="Description">
            <textarea value={f.description ?? ""} onChange={(e) => set("description", e.target.value)}
              rows={3} className="w-full px-3 py-2 border border-black/10 rounded-md text-sm" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <input value={f.category ?? ""} onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. leadership, evangelism"
                className="w-full px-3 py-2 border border-black/10 rounded-md text-sm" />
            </Field>
            <Field label="Type">
              <select value={f.resource_type ?? "document"} onChange={(e) => set("resource_type", e.target.value)}
                className="w-full px-3 py-2 border border-black/10 rounded-md text-sm bg-white">
                {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Audience">
            <select value={f.audience ?? "all"} onChange={(e) => set("audience", e.target.value)}
              className="w-full px-3 py-2 border border-black/10 rounded-md text-sm bg-white">
              {RESOURCE_AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="File URL (upload to Media Library, paste URL)">
            <input value={f.file_url ?? ""} onChange={(e) => set("file_url", e.target.value)}
              placeholder="https://…" className="w-full px-3 py-2 border border-black/10 rounded-md text-sm" />
          </Field>
          <Field label="External URL (for links or hosted courses)">
            <input value={f.external_url ?? ""} onChange={(e) => set("external_url", e.target.value)}
              placeholder="https://…" className="w-full px-3 py-2 border border-black/10 rounded-md text-sm" />
          </Field>
          <Field label="Thumbnail URL">
            <input value={f.thumbnail_url ?? ""} onChange={(e) => set("thumbnail_url", e.target.value)}
              placeholder="https://…" className="w-full px-3 py-2 border border-black/10 rounded-md text-sm" />
          </Field>
          <Field label="Tags (comma separated)">
            <input value={(f.tags ?? []).join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              className="w-full px-3 py-2 border border-black/10 rounded-md text-sm" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input type="number" value={f.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))}
                className="w-full px-3 py-2 border border-black/10 rounded-md text-sm" />
            </Field>
            <label className="flex items-end gap-2 pb-2">
              <input type="checkbox" checked={!!f.is_published} onChange={(e) => set("is_published", e.target.checked)} />
              <span className="text-sm">Published</span>
            </label>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-black/5 flex justify-end gap-2 sticky bottom-0 bg-white">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-charcoal/70 hover:text-navy-deep">Cancel</button>
          <button
            onClick={() => onSave(f)}
            disabled={saving || !f.title}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-navy-deep rounded-md text-sm font-semibold disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-charcoal/60 font-semibold">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
