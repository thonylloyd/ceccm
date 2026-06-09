import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert, adminDelete } from "@/lib/admin.functions";
import { Field, Input, Textarea, Button, Card } from "./ui";
import { MediaPicker } from "./MediaPicker";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "number" | "date" | "image" | "checkbox" | "icon";
  placeholder?: string;
};

export function SectionEditor({
  title,
  description,
  table,
  fields,
  defaults,
  titleKey = "title",
}: {
  title: string;
  description?: string;
  table: string;
  fields: FieldDef[];
  defaults: Record<string, any>;
  titleKey?: string;
}) {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const q = useQuery({
    queryKey: ["a", table],
    queryFn: () => list({ data: { table } }) as any,
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: (row: any) => upsert({ data: { table, row } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", table] }); qc.invalidateQueries({ queryKey: ["homepage"] }); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message ?? "Save failed"),
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { table, id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", table] }); qc.invalidateQueries({ queryKey: ["homepage"] }); toast.success("Deleted"); },
  });

  const addNew = () => {
    const order = (q.data?.length ?? 0);
    save.mutate({ ...defaults, display_order: order, is_active: true });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl text-navy-deep">{title}</h2>
          {description && <p className="text-xs text-charcoal/60 mt-0.5">{description}</p>}
        </div>
        <Button onClick={addNew}><Plus className="h-3.5 w-3.5" />Add</Button>
      </div>
      {q.isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-navy-deep" />
      ) : (
        <div className="space-y-3">
          {q.data?.map((row: any) => (
            <ItemRow
              key={row.id}
              row={row}
              fields={fields}
              titleKey={titleKey}
              expanded={expanded === row.id}
              onToggle={() => setExpanded(expanded === row.id ? null : row.id)}
              onSave={(r) => save.mutate(r)}
              onDelete={() => { if (confirm("Delete this item?")) remove.mutate(row.id); }}
              saving={save.isPending}
            />
          ))}
          {!q.data?.length && (
            <div className="text-center text-sm text-charcoal/50 py-8 bg-white rounded-lg border border-black/5">
              No items yet. Click "Add" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ItemRow({
  row, fields, titleKey, expanded, onToggle, onSave, onDelete, saving,
}: {
  row: any; fields: FieldDef[]; titleKey: string; expanded: boolean;
  onToggle: () => void; onSave: (r: any) => void; onDelete: () => void; saving: boolean;
}) {
  const [local, setLocal] = useState<any>(row);
  const set = (k: string, v: any) => setLocal((s: any) => ({ ...s, [k]: v }));

  return (
    <Card className="!p-0 overflow-hidden">
      <div className="flex items-center px-4 py-3">
        <button onClick={onToggle} className="flex-1 text-left flex items-center gap-3">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="font-medium text-sm text-navy-deep truncate">{local[titleKey] || "(Untitled)"}</span>
          {!local.is_active && <span className="text-[10px] uppercase tracking-wider text-charcoal/40">Hidden</span>}
        </button>
        <Button variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-black/5 space-y-3">
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.type === "textarea" ? (
                <Textarea rows={3} value={local[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} />
              ) : f.type === "image" ? (
                <MediaPicker label="" value={local[f.key]} onChange={(url) => set(f.key, url)} />
              ) : f.type === "checkbox" ? (
                <input type="checkbox" checked={!!local[f.key]} onChange={(e) => set(f.key, e.target.checked)} />
              ) : f.type === "icon" ? (
                <select value={local[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className="w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white">
                  {["globe", "compass", "graduation-cap", "heart", "book", "users", "hand", "church", "cross", "sparkles", "radio", "calendar", "download"].map(i => <option key={i}>{i}</option>)}
                </select>
              ) : (
                <Input type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
                  value={local[f.key] ?? ""}
                  onChange={(e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
                  placeholder={f.placeholder} />
              )}
            </Field>
          ))}
          <Field label="Display Order">
            <Input type="number" value={local.display_order ?? 0} onChange={(e) => set("display_order", Number(e.target.value))} />
          </Field>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!local.is_active} onChange={(e) => set("is_active", e.target.checked)} />
            Active (visible on site)
          </label>
          <div className="flex gap-2 pt-2 border-t border-black/5">
            <Button onClick={() => onSave(local)} disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
