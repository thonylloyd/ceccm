import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { adminList, adminUpsert, adminDelete, adminGetSetting, adminSetSetting } from "@/lib/admin.functions";
import { Field, Input, Textarea, Button, Card } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/livestream")({
  component: LivestreamAdmin,
});

const TABS = [
  { id: "settings", label: "Settings" },
  { id: "current", label: "Current Broadcast" },
  { id: "upcoming", label: "Upcoming" },
  { id: "replays", label: "Replays" },
  { id: "channels", label: "Channels" },
  { id: "stats", label: "Statistics" },
  { id: "alert", label: "Alert Bar" },
] as const;

function LivestreamAdmin() {
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("settings");
  return (
    <div className="px-8 py-10 max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-navy-deep">Livestream</h1>
        <p className="text-sm text-charcoal/60 mt-1">Manage the /live page, broadcasts, channels, and notifications.</p>
      </div>
      <div className="flex gap-1 border-b border-black/10 mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? "border-gold text-navy-deep font-semibold" : "border-transparent text-charcoal/60 hover:text-navy-deep"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "settings" && <HeroSettings />}
      {tab === "alert" && <AlertSettings />}
      {tab === "current" && <BroadcastList kind="live" title="Current Broadcast" hint="Toggle 'Is Live' on the broadcast you're currently airing." />}
      {tab === "upcoming" && <BroadcastList kind="upcoming" title="Upcoming Broadcasts" />}
      {tab === "replays" && <BroadcastList kind="replay" title="Replays" />}
      {tab === "channels" && <ChannelsAdmin />}
      {tab === "stats" && <StatsAdmin />}
    </div>
  );
}

function useSetting(key: string, defaults: any) {
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetSetting);
  const setFn = useServerFn(adminSetSetting);
  const q = useQuery({ queryKey: ["setting", key], queryFn: () => getFn({ data: { key } }) });
  const [val, setVal] = useState<any>(defaults);
  useEffect(() => { if (q.data) setVal({ ...defaults, ...((q.data as any).value ?? {}) }); }, [q.data]);
  const save = useMutation({
    mutationFn: (value: any) => setFn({ data: { key, value } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["setting", key] }); qc.invalidateQueries({ queryKey: ["livestream"] }); toast.success("Saved"); },
  });
  return { val, setVal, save, loading: q.isLoading };
}

function HeroSettings() {
  const { val, setVal, save } = useSetting("livestream_hero", {
    eyebrow: "Watch Live", heading: "Join Our Live Broadcast",
    subheading: "Watch ministry programs, conferences, prayer sessions, leadership trainings, and special broadcasts from anywhere in the world.",
    primary_label: "Watch Live", secondary_label: "View Schedule", background_url: "",
  });
  return (
    <Card>
      <h2 className="font-display text-lg text-navy-deep mb-4">Hero Section</h2>
      <div className="space-y-3">
        <Field label="Eyebrow"><Input value={val.eyebrow ?? ""} onChange={(e) => setVal({ ...val, eyebrow: e.target.value })} /></Field>
        <Field label="Heading"><Input value={val.heading ?? ""} onChange={(e) => setVal({ ...val, heading: e.target.value })} /></Field>
        <Field label="Subheading"><Textarea rows={3} value={val.subheading ?? ""} onChange={(e) => setVal({ ...val, subheading: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Primary Button"><Input value={val.primary_label ?? ""} onChange={(e) => setVal({ ...val, primary_label: e.target.value })} /></Field>
          <Field label="Secondary Button"><Input value={val.secondary_label ?? ""} onChange={(e) => setVal({ ...val, secondary_label: e.target.value })} /></Field>
        </div>
        <Field label="Background Image"><MediaPicker label="" value={val.background_url} onChange={(url) => setVal({ ...val, background_url: url })} /></Field>
        <Button onClick={() => save.mutate(val)} disabled={save.isPending}><Save className="h-3.5 w-3.5" /> Save</Button>
      </div>
    </Card>
  );
}

function AlertSettings() {
  const { val, setVal, save } = useSetting("livestream_alert", {
    visible: false, title: "", description: "", button_text: "", button_url: "",
    background_color: "#E6B341", text_color: "#0a1733", start_date: "", end_date: "",
  });
  return (
    <Card>
      <h2 className="font-display text-lg text-navy-deep mb-4">Alert Bar</h2>
      <div className="space-y-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!val.visible} onChange={(e) => setVal({ ...val, visible: e.target.checked })} />
          Visible
        </label>
        <Field label="Title"><Input value={val.title ?? ""} onChange={(e) => setVal({ ...val, title: e.target.value })} /></Field>
        <Field label="Description"><Input value={val.description ?? ""} onChange={(e) => setVal({ ...val, description: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Button Text"><Input value={val.button_text ?? ""} onChange={(e) => setVal({ ...val, button_text: e.target.value })} /></Field>
          <Field label="Button URL"><Input value={val.button_url ?? ""} onChange={(e) => setVal({ ...val, button_url: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Background Color"><Input type="color" value={val.background_color ?? "#E6B341"} onChange={(e) => setVal({ ...val, background_color: e.target.value })} /></Field>
          <Field label="Text Color"><Input type="color" value={val.text_color ?? "#0a1733"} onChange={(e) => setVal({ ...val, text_color: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date"><Input type="datetime-local" value={val.start_date ?? ""} onChange={(e) => setVal({ ...val, start_date: e.target.value })} /></Field>
          <Field label="End Date"><Input type="datetime-local" value={val.end_date ?? ""} onChange={(e) => setVal({ ...val, end_date: e.target.value })} /></Field>
        </div>
        <Button onClick={() => save.mutate(val)} disabled={save.isPending}><Save className="h-3.5 w-3.5" /> Save</Button>
      </div>
    </Card>
  );
}

function BroadcastList({ kind, title, hint }: { kind: "live" | "upcoming" | "replay"; title: string; hint?: string }) {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const q = useQuery({ queryKey: ["a", "broadcasts"], queryFn: () => list({ data: { table: "broadcasts" } }) as any });
  const [open, setOpen] = useState<string | null>(null);
  const save = useMutation({
    mutationFn: (row: any) => upsert({ data: { table: "broadcasts", row } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "broadcasts"] }); qc.invalidateQueries({ queryKey: ["livestream"] }); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message ?? "Save failed"),
  });
  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { table: "broadcasts", id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "broadcasts"] }); qc.invalidateQueries({ queryKey: ["livestream"] }); toast.success("Deleted"); },
  });
  const items = (q.data ?? []).filter((b: any) => b.kind === kind);
  const addNew = () => save.mutate({ kind, title: "New broadcast", is_published: true, display_order: items.length });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl text-navy-deep">{title}</h2>
          {hint && <p className="text-xs text-charcoal/60 mt-0.5">{hint}</p>}
        </div>
        <Button onClick={addNew}><Plus className="h-3.5 w-3.5" /> Add</Button>
      </div>
      {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin text-navy-deep" /> : (
        <div className="space-y-3">
          {items.map((b: any) => (
            <BroadcastRow
              key={b.id} row={b}
              expanded={open === b.id}
              onToggle={() => setOpen(open === b.id ? null : b.id)}
              onSave={(r: any) => save.mutate(r)} onDelete={() => { if (confirm("Delete?")) remove.mutate(b.id); }}
              saving={save.isPending}
            />
          ))}
          {!items.length && <div className="text-center text-sm text-charcoal/50 py-10 bg-white rounded-lg border border-black/5">None yet. Click "Add" to create one.</div>}
        </div>
      )}
    </div>
  );
}

function BroadcastRow({ row, expanded, onToggle, onSave, onDelete, saving }: any) {
  const [l, setL] = useState<any>(row);
  const s = (k: string, v: any) => setL((x: any) => ({ ...x, [k]: v }));
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="flex items-center px-4 py-3">
        <button onClick={onToggle} className="flex-1 text-left flex items-center gap-3">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="font-medium text-sm text-navy-deep truncate">{l.title || "(Untitled)"}</span>
          {l.is_live && <span className="text-[10px] uppercase tracking-wider bg-red-600 text-white px-1.5 py-0.5">Live</span>}
          {l.is_featured && <span className="text-[10px] uppercase tracking-wider text-gold">Featured</span>}
          {!l.is_published && <span className="text-[10px] uppercase tracking-wider text-charcoal/40">Hidden</span>}
        </button>
        <Button variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-black/5 space-y-3">
          <Field label="Title"><Input value={l.title ?? ""} onChange={(e) => s("title", e.target.value)} /></Field>
          <Field label="Slug"><Input value={l.slug ?? ""} onChange={(e) => s("slug", e.target.value)} placeholder="kebab-case-url" /></Field>
          <Field label="Description"><Textarea rows={3} value={l.description ?? ""} onChange={(e) => s("description", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Speaker"><Input value={l.speaker ?? ""} onChange={(e) => s("speaker", e.target.value)} /></Field>
            <Field label="Category"><Input value={l.category ?? ""} onChange={(e) => s("category", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stream Type">
              <select value={l.stream_type ?? ""} onChange={(e) => s("stream_type", e.target.value)} className="w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white">
                <option value="">—</option>
                {["youtube", "vimeo", "facebook", "hls", "embed"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Stream URL"><Input value={l.stream_url ?? ""} onChange={(e) => s("stream_url", e.target.value)} /></Field>
          </div>
          <Field label="Thumbnail"><MediaPicker label="" value={l.thumbnail_url} onChange={(url) => s("thumbnail_url", url)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start"><Input type="datetime-local" value={l.scheduled_start?.slice(0, 16) ?? ""} onChange={(e) => s("scheduled_start", e.target.value ? new Date(e.target.value).toISOString() : null)} /></Field>
            <Field label="End"><Input type="datetime-local" value={l.scheduled_end?.slice(0, 16) ?? ""} onChange={(e) => s("scheduled_end", e.target.value ? new Date(e.target.value).toISOString() : null)} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Duration (s)"><Input type="number" value={l.duration_seconds ?? 0} onChange={(e) => s("duration_seconds", Number(e.target.value))} /></Field>
            <Field label="Viewer Count"><Input type="number" value={l.viewer_count ?? 0} onChange={(e) => s("viewer_count", Number(e.target.value))} /></Field>
            <Field label="Display Order"><Input type="number" value={l.display_order ?? 0} onChange={(e) => s("display_order", Number(e.target.value))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Registration URL"><Input value={l.registration_url ?? ""} onChange={(e) => s("registration_url", e.target.value)} /></Field>
            <Field label="Reminder URL"><Input value={l.reminder_url ?? ""} onChange={(e) => s("reminder_url", e.target.value)} /></Field>
          </div>
          <div className="space-y-1.5">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!l.chat_enabled} onChange={(e) => s("chat_enabled", e.target.checked)} /> Enable Chat</label>
            {l.chat_enabled && <Field label="Chat Embed URL"><Input value={l.chat_url ?? ""} onChange={(e) => s("chat_url", e.target.value)} /></Field>}
          </div>
          <div className="border-t border-black/5 pt-3 mt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Access Control</div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Access">
                <select value={l.access_mode ?? "free"} onChange={(e) => s("access_mode", e.target.value)} className="w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white">
                  {["free", "password", "paid"].map((x) => <option key={x}>{x}</option>)}
                </select>
              </Field>
              {l.access_mode === "password" && (
                <Field label="Password (set to update)"><Input type="text" value={l._new_password ?? ""} onChange={(e) => s("_new_password", e.target.value)} placeholder="leave blank to keep" /></Field>
              )}
              {l.access_mode === "paid" && (
                <Field label="Price (ESPEES)"><Input type="number" value={l.price_espees ?? 0} onChange={(e) => s("price_espees", Number(e.target.value))} /></Field>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!l.is_live} onChange={(e) => s("is_live", e.target.checked)} /> Is Live Now</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!l.is_featured} onChange={(e) => s("is_featured", e.target.checked)} /> Featured</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!l.is_published} onChange={(e) => s("is_published", e.target.checked)} /> Published</label>
          </div>
          <Button onClick={() => onSave(l)} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}</Button>
        </div>
      )}
    </Card>
  );
}

function ChannelsAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const q = useQuery({ queryKey: ["a", "broadcast_channels"], queryFn: () => list({ data: { table: "broadcast_channels" } }) as any });
  const save = useMutation({ mutationFn: (row: any) => upsert({ data: { table: "broadcast_channels", row } }), onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "broadcast_channels"] }); qc.invalidateQueries({ queryKey: ["livestream"] }); toast.success("Saved"); } });
  const remove = useMutation({ mutationFn: (id: string) => del({ data: { table: "broadcast_channels", id } }), onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "broadcast_channels"] }); qc.invalidateQueries({ queryKey: ["livestream"] }); toast.success("Deleted"); } });
  const [open, setOpen] = useState<string | null>(null);
  const items = q.data ?? [];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-navy-deep">Ministry Channels</h2>
        <Button onClick={() => save.mutate({ name: "New channel", is_published: true, display_order: items.length })}><Plus className="h-3.5 w-3.5" /> Add</Button>
      </div>
      <div className="space-y-3">
        {items.map((c: any) => (
          <ChannelRow key={c.id} row={c} expanded={open === c.id} onToggle={() => setOpen(open === c.id ? null : c.id)} onSave={(r: any) => save.mutate(r)} onDelete={() => { if (confirm("Delete?")) remove.mutate(c.id); }} />
        ))}
        {!items.length && <div className="text-center text-sm text-charcoal/50 py-10 bg-white rounded-lg border border-black/5">No channels.</div>}
      </div>
    </div>
  );
}

function ChannelRow({ row, expanded, onToggle, onSave, onDelete }: any) {
  const [l, setL] = useState<any>(row);
  const s = (k: string, v: any) => setL((x: any) => ({ ...x, [k]: v }));
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="flex items-center px-4 py-3">
        <button onClick={onToggle} className="flex-1 text-left flex items-center gap-3">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="font-medium text-sm text-navy-deep truncate">{l.name || "(Untitled)"}</span>
        </button>
        <Button variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-black/5 space-y-3">
          <Field label="Name"><Input value={l.name ?? ""} onChange={(e) => s("name", e.target.value)} /></Field>
          <Field label="Description"><Textarea rows={3} value={l.description ?? ""} onChange={(e) => s("description", e.target.value)} /></Field>
          <Field label="Logo"><MediaPicker label="" value={l.logo_url} onChange={(url) => s("logo_url", url)} /></Field>
          <Field label="Watch URL"><Input value={l.watch_url ?? ""} onChange={(e) => s("watch_url", e.target.value)} /></Field>
          <Field label="Display Order"><Input type="number" value={l.display_order ?? 0} onChange={(e) => s("display_order", Number(e.target.value))} /></Field>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!l.is_published} onChange={(e) => s("is_published", e.target.checked)} /> Published</label>
          <Button onClick={() => onSave(l)}>Save</Button>
        </div>
      )}
    </Card>
  );
}

function StatsAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const q = useQuery({ queryKey: ["a", "broadcast_stats"], queryFn: () => list({ data: { table: "broadcast_stats" } }) as any });
  const save = useMutation({ mutationFn: (row: any) => upsert({ data: { table: "broadcast_stats", row } }), onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "broadcast_stats"] }); qc.invalidateQueries({ queryKey: ["livestream"] }); toast.success("Saved"); } });
  const remove = useMutation({ mutationFn: (id: string) => del({ data: { table: "broadcast_stats", id } }), onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "broadcast_stats"] }); qc.invalidateQueries({ queryKey: ["livestream"] }); toast.success("Deleted"); } });
  const items = q.data ?? [];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-navy-deep">Global Impact Stats</h2>
        <Button onClick={() => save.mutate({ label: "New stat", value: 0, is_published: true, display_order: items.length })}><Plus className="h-3.5 w-3.5" /> Add</Button>
      </div>
      <div className="space-y-3">
        {items.map((row: any) => <StatRow key={row.id} row={row} onSave={(r: any) => save.mutate(r)} onDelete={() => { if (confirm("Delete?")) remove.mutate(row.id); }} />)}
      </div>
    </div>
  );
}

function StatRow({ row, onSave, onDelete }: any) {
  const [l, setL] = useState<any>(row);
  const s = (k: string, v: any) => setL((x: any) => ({ ...x, [k]: v }));
  return (
    <Card>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
        <Field label="Label"><Input value={l.label ?? ""} onChange={(e) => s("label", e.target.value)} /></Field>
        <Field label="Value"><Input type="number" value={l.value ?? 0} onChange={(e) => s("value", Number(e.target.value))} /></Field>
        <Field label="Suffix"><Input value={l.suffix ?? ""} onChange={(e) => s("suffix", e.target.value)} placeholder="+, K, M" /></Field>
        <Field label="Order"><Input type="number" value={l.display_order ?? 0} onChange={(e) => s("display_order", Number(e.target.value))} /></Field>
        <div className="flex gap-2 justify-end">
          <Button onClick={() => onSave(l)}>Save</Button>
          <Button variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
        </div>
      </div>
    </Card>
  );
}

function CtaSettings() {
  const { val, setVal, save } = useSetting("livestream_cta", {
    visible: false, label: "Watch Live Now", url: "/live",
    background_color: "#E6B341", text_color: "#0a1733",
    icon: "radio", open_new_tab: false, start_date: "", end_date: "",
  });
  return (
    <Card>
      <h2 className="font-display text-lg text-navy-deep mb-4">Livestream CTA Button</h2>
      <p className="text-xs text-charcoal/60 mb-4">Floating call-to-action displayed in the site header and the /live page hero.</p>
      <div className="space-y-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!val.visible} onChange={(e) => setVal({ ...val, visible: e.target.checked })} />
          Visible
        </label>
        <Field label="Button Text"><Input value={val.label ?? ""} onChange={(e) => setVal({ ...val, label: e.target.value })} /></Field>
        <Field label="Button URL"><Input value={val.url ?? ""} onChange={(e) => setVal({ ...val, url: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Background Color"><Input type="color" value={val.background_color ?? "#E6B341"} onChange={(e) => setVal({ ...val, background_color: e.target.value })} /></Field>
          <Field label="Text Color"><Input type="color" value={val.text_color ?? "#0a1733"} onChange={(e) => setVal({ ...val, text_color: e.target.value })} /></Field>
        </div>
        <Field label="Icon">
          <select value={val.icon ?? "radio"} onChange={(e) => setVal({ ...val, icon: e.target.value })} className="w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white">
            {["radio", "play", "tv", "sparkles", "bell"].map((x) => <option key={x}>{x}</option>)}
          </select>
        </Field>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!val.open_new_tab} onChange={(e) => setVal({ ...val, open_new_tab: e.target.checked })} />
          Open in New Tab
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date"><Input type="datetime-local" value={val.start_date ?? ""} onChange={(e) => setVal({ ...val, start_date: e.target.value })} /></Field>
          <Field label="End Date"><Input type="datetime-local" value={val.end_date ?? ""} onChange={(e) => setVal({ ...val, end_date: e.target.value })} /></Field>
        </div>
        <Button onClick={() => save.mutate(val)} disabled={save.isPending}><Save className="h-3.5 w-3.5" /> Save</Button>
      </div>
    </Card>
  );
}

function BrowserCameraPanel() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e: any) { toast.error(e.message ?? "Camera blocked"); }
  };
  const stop = () => { stream?.getTracks().forEach((t) => t.stop()); setStream(null); };
  return (
    <Card>
      <h2 className="font-display text-lg text-navy-deep mb-2">Broadcast from Browser</h2>
      <p className="text-xs text-charcoal/60 mb-4">Preview your camera and microphone. For distribution, paste the resulting embed/HLS URL into the Current Broadcast's Stream URL field.</p>
      <div className="aspect-video bg-black overflow-hidden rounded-md mb-3">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      </div>
      <div className="flex gap-2">
        {!stream ? <Button onClick={start}>Start Camera</Button> : <Button variant="ghost" onClick={stop}>Stop</Button>}
      </div>
    </Card>
  );
}
