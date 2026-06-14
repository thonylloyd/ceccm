import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert, adminDelete, adminGetSetting, adminSetSetting } from "@/lib/admin.functions";
import { PageHeader, Field, Input, Button, Card } from "@/components/admin/ui";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, Save } from "lucide-react";
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
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setOpenIds((s) => ({ ...s, [id]: !s[id] }));

  const save = useMutation({
    mutationFn: (row: any) => upsert({ data: { table: "navigation_items", row } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "navigation_items"] }); qc.invalidateQueries({ queryKey: ["homepage"] }); qc.invalidateQueries({ queryKey: ["site-chrome"] }); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message ?? "Save failed"),
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { table: "navigation_items", id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["a", "navigation_items"] }),
  });

  const items = q.data ?? [];
  const roots = items.filter((i: any) => !i.parent_id).sort((a: any, b: any) => a.display_order - b.display_order);

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <LivestreamButtonSettings />
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
              childItems={items.filter((c: any) => c.parent_id === item.id).sort((a: any, b: any) => a.display_order - b.display_order)}
              openIds={openIds}
              onToggle={toggle}
              onSave={(r: any) => save.mutate(r)}
              onDelete={(id: string) => { if (confirm("Delete?")) remove.mutate(id); }}
              onAddChild={() => save.mutate({ label: "Sub-item", url: "/", parent_id: item.id, display_order: items.filter((c: any) => c.parent_id === item.id).length, is_active: true, is_external: false })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavItemRow({ item, childItems, openIds, onToggle, onSave, onDelete, onAddChild }: any) {
  const [local, setLocal] = useState(item);
  const set = (k: string, v: any) => setLocal((s: any) => ({ ...s, [k]: v }));
  const expanded = !!openIds[item.id];

  return (
    <Card className="!p-0">
      <div className="flex items-center px-4 py-3">
        <button onClick={() => onToggle(item.id)} className="flex-1 text-left flex items-center gap-3">
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
          {childItems?.length > 0 && (
            <div className="pl-4 border-l-2 border-gold/30 space-y-2 mt-3">
              {childItems.map((c: any) => (
                <NavItemRow
                  key={c.id}
                  item={c}
                  childItems={[]}
                  openIds={openIds}
                  onToggle={onToggle}
                  onSave={onSave}
                  onDelete={onDelete}
                  onAddChild={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function LivestreamButtonSettings() {
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetSetting);
  const setFn = useServerFn(adminSetSetting);
  const q = useQuery({ queryKey: ["setting", "livestream"], queryFn: () => getFn({ data: { key: "livestream" } }) });
  const defaults = {
    visible: true, label: "Watch Live", url: "/live",
    background_color: "", text_color: "#0a1733",
    show_pulse: true, open_new_tab: false,
  };
  const [val, setVal] = useState<any>(defaults);
  useEffect(() => { if (q.data) setVal({ ...defaults, ...((q.data as any).value ?? {}) }); }, [q.data]);
  const save = useMutation({
    mutationFn: (value: any) => setFn({ data: { key: "livestream", value } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["setting", "livestream"] }); qc.invalidateQueries({ queryKey: ["homepage"] }); qc.invalidateQueries({ queryKey: ["site-chrome"] }); toast.success("Saved"); },
  });
  return (
    <Card>
      <h2 className="font-display text-lg text-navy-deep mb-1">Livestream Button</h2>
      <p className="text-xs text-charcoal/60 mb-4">Controls the live-stream call-to-action in the site header.</p>
      <div className="space-y-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!val.visible} onChange={(e) => setVal({ ...val, visible: e.target.checked })} /> Visible
        </label>
        <Field label="Label"><Input value={val.label ?? ""} onChange={(e) => setVal({ ...val, label: e.target.value })} /></Field>
        <Field label="URL"><Input value={val.url ?? ""} onChange={(e) => setVal({ ...val, url: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Background (blank = gold gradient)"><Input value={val.background_color ?? ""} onChange={(e) => setVal({ ...val, background_color: e.target.value })} placeholder="#B88A1B or leave blank" /></Field>
          <Field label="Text Color"><Input type="color" value={val.text_color ?? "#0a1733"} onChange={(e) => setVal({ ...val, text_color: e.target.value })} /></Field>
        </div>
        <div className="flex gap-6 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!val.show_pulse} onChange={(e) => setVal({ ...val, show_pulse: e.target.checked })} /> Pulse Indicator</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!val.open_new_tab} onChange={(e) => setVal({ ...val, open_new_tab: e.target.checked })} /> Open in New Tab</label>
        </div>
        <Button onClick={() => save.mutate(val)} disabled={save.isPending}><Save className="h-3.5 w-3.5" /> Save</Button>
      </div>
    </Card>
  );
}
