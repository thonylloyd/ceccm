import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert, adminDelete } from "@/lib/admin.functions";
import { PageHeader, Field, Input, Button, Card } from "@/components/admin/ui";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/navigation")({
  component: NavAdmin,
});

function NavAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const q = useQuery({ queryKey: ["a", "navigation_items"], queryFn: () => list({ data: { table: "navigation_items" } }) as any });
  const [open, setOpen] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: (row: any) => upsert({ data: { table: "navigation_items", row } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "navigation_items"] }); qc.invalidateQueries({ queryKey: ["homepage"] }); toast.success("Saved"); },
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { table: "navigation_items", id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["a", "navigation_items"] }),
  });

  const items = q.data ?? [];
  const roots = items.filter((i: any) => !i.parent_id).sort((a: any, b: any) => a.display_order - b.display_order);

  return (
    <div className="p-8 max-w-3xl">
      <PageHeader
        title="Navigation"
        description="Manage menu items, sub-menus, and ordering."
        actions={
          <Button onClick={() => save.mutate({ label: "New Item", url: "/", display_order: roots.length, is_active: true, is_external: false })}>
            <Plus className="h-3.5 w-3.5" /> Add Item
          </Button>
        }
      />
      {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-3">
          {roots.map((item: any) => (
            <NavItemRow
              key={item.id}
              item={item}
              children={items.filter((c: any) => c.parent_id === item.id).sort((a: any, b: any) => a.display_order - b.display_order)}
              expanded={open === item.id}
              onToggle={() => setOpen(open === item.id ? null : item.id)}
              onSave={(r) => save.mutate(r)}
              onDelete={(id) => { if (confirm("Delete?")) remove.mutate(id); }}
              onAddChild={() => save.mutate({ label: "Sub-item", url: "/", parent_id: item.id, display_order: items.filter((c: any) => c.parent_id === item.id).length, is_active: true, is_external: false })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavItemRow({ item, children, expanded, onToggle, onSave, onDelete, onAddChild }: any) {
  const [local, setLocal] = useState(item);
  const set = (k: string, v: any) => setLocal((s: any) => ({ ...s, [k]: v }));

  return (
    <Card className="!p-0">
      <div className="flex items-center px-4 py-3">
        <button onClick={onToggle} className="flex-1 text-left flex items-center gap-3">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="font-medium text-sm text-navy-deep">{local.label}</span>
          <span className="text-xs text-charcoal/50">{local.url}</span>
          {!local.is_active && <span className="text-[10px] uppercase text-charcoal/40">Hidden</span>}
        </button>
        <Button variant="ghost" onClick={() => onDelete(item.id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-black/5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label"><Input value={local.label} onChange={(e) => set("label", e.target.value)} /></Field>
            <Field label="URL"><Input value={local.url} onChange={(e) => set("url", e.target.value)} /></Field>
            <Field label="Order"><Input type="number" value={local.display_order} onChange={(e) => set("display_order", Number(e.target.value))} /></Field>
            <Field label="External Link">
              <label className="inline-flex items-center gap-2 text-sm h-9">
                <input type="checkbox" checked={local.is_external} onChange={(e) => set("is_external", e.target.checked)} /> Opens new tab
              </label>
            </Field>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={local.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Active
          </label>
          <div className="flex gap-2">
            <Button onClick={() => onSave(local)}>Save</Button>
            {!item.parent_id && <Button variant="outline" onClick={onAddChild}><Plus className="h-3 w-3" /> Sub-item</Button>}
          </div>
          {children?.length > 0 && (
            <div className="pl-4 border-l-2 border-gold/30 space-y-2 mt-3">
              {children.map((c: any) => (
                <NavItemRow key={c.id} item={c} children={[]} expanded={false} onToggle={() => {}} onSave={onSave} onDelete={onDelete} onAddChild={() => {}} />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
