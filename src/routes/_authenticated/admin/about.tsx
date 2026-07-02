import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminGetSetting, adminSetSetting } from "@/lib/admin.functions";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { SectionEditor, FieldDef } from "@/components/admin/SectionEditor";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/about")({
  component: AboutAdmin,
});

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "who", label: "Who We Are" },
  { id: "leadership", label: "Leadership" },
  { id: "mission_intro", label: "Mission Intro" },
  { id: "purpose", label: "Why We Exist" },
  { id: "cta", label: "Call to Action" },
  { id: "seo", label: "SEO" },
] as const;

const LEADERSHIP_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "position", label: "Position / Title (multi-line allowed)", type: "textarea" },
  { key: "message", label: "Message", type: "textarea" },
  { key: "photo_url", label: "Photo", type: "image" },
];

function AboutAdmin() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("hero");
  return (
    <div className="p-8 max-w-4xl">
      <PageHeader title="About Page" description="Manage everything that appears on /about." />
      <div className="flex gap-1 border-b border-black/10 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === t.id ? "border-gold text-navy-deep" : "border-transparent text-charcoal/60 hover:text-navy-deep"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "hero" && <SettingPanel settingKey="about_hero" title="Hero" fields={[
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "textarea" },
        { key: "background_url", label: "Background Image", type: "image" },
      ]} />}
      {tab === "who" && <SettingPanel settingKey="about_who" title="Who We Are" fields={[
        { key: "title", label: "Section Title", type: "text" },
        { key: "body_1", label: "Paragraph 1", type: "textarea" },
        { key: "body_2", label: "Paragraph 2", type: "textarea" },
        { key: "image_url", label: "Image (Pastor Chris)", type: "image" },
      ]} />}
      {tab === "leadership" && (
        <SectionEditor
          title="Leadership"
          description="3-card grid. Toggle 'Featured' for the elevated middle card."
          table="leadership"
          fields={LEADERSHIP_FIELDS}
          defaults={{ name: "New Leader", position: "", message: "" }}
          titleKey="name"
        />
      )}
      {tab === "mission_intro" && <SettingPanel settingKey="about_mission_intro" title="Mission Intro" fields={[
        { key: "title", label: "Section Title", type: "text" },
        { key: "intro", label: "Intro Text", type: "textarea" },
      ]} />}
      {tab === "purpose" && <PurposeEditor />}
      {tab === "cta" && <SettingPanel settingKey="about_cta" title="Call to Action" fields={[
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "primary_label", label: "Primary Button Label", type: "text" },
        { key: "primary_url", label: "Primary Button URL", type: "text" },
        { key: "secondary_label", label: "Secondary Button Label", type: "text" },
        { key: "secondary_url", label: "Secondary Button URL", type: "text" },
      ]} />}
      {tab === "seo" && <SettingPanel settingKey="about_seo" title="SEO" fields={[
        { key: "meta_title", label: "Meta Title", type: "text" },
        { key: "meta_description", label: "Meta Description", type: "textarea" },
        { key: "og_image", label: "OG Image", type: "image" },
      ]} />}
    </div>
  );
}

type SF = { key: string; label: string; type: "text" | "textarea" | "image" };

function SettingPanel({ settingKey, title, fields }: { settingKey: string; title: string; fields: SF[] }) {
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetSetting);
  const setFn = useServerFn(adminSetSetting);
  const q = useQuery({ queryKey: ["s", settingKey], queryFn: () => getFn({ data: { key: settingKey } }) as any });
  const [v, setV] = useState<any>({});
  useEffect(() => { if (q.data?.value) setV(q.data.value); }, [q.data]);
  const m = useMutation({
    mutationFn: () => setFn({ data: { key: settingKey, value: v } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["s", settingKey] }); qc.invalidateQueries({ queryKey: ["about"] }); toast.success("Saved"); },
  });
  if (q.isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;
  return (
    <Card>
      <h2 className="font-display text-lg text-navy-deep mb-4">{title}</h2>
      <div className="space-y-3">
        {fields.map((f) => (
          <Field key={f.key} label={f.label}>
            {f.type === "textarea" ? (
              <Textarea rows={4} value={v[f.key] ?? ""} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} />
            ) : f.type === "image" ? (
              <MediaPicker label="" value={v[f.key]} onChange={(url) => setV({ ...v, [f.key]: url })} />
            ) : (
              <Input value={v[f.key] ?? ""} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} />
            )}
          </Field>
        ))}
        <Button onClick={() => m.mutate()} disabled={m.isPending}>
          {m.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Save className="h-3.5 w-3.5" />Save</>}
        </Button>
      </div>
    </Card>
  );
}

function PurposeEditor() {
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetSetting);
  const setFn = useServerFn(adminSetSetting);
  const q = useQuery({ queryKey: ["s", "about_purpose"], queryFn: () => getFn({ data: { key: "about_purpose" } }) as any });
  const [v, setV] = useState<any>({ title: "Why We Exist", items: [{ icon: "users", text: "" }] });
  useEffect(() => { if (q.data?.value) setV(q.data.value); }, [q.data]);
  const m = useMutation({
    mutationFn: () => setFn({ data: { key: "about_purpose", value: v } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["s", "about_purpose"] }); qc.invalidateQueries({ queryKey: ["about"] }); toast.success("Saved"); },
  });
  const items = v.items ?? [];
  const setItem = (i: number, patch: any) => {
    const arr = [...items];
    arr[i] = { ...arr[i], ...patch };
    setV({ ...v, items: arr });
  };
  return (
    <Card>
      <h2 className="font-display text-lg text-navy-deep mb-4">Why We Exist (Purpose Statements)</h2>
      <Field label="Section Title"><Input value={v.title ?? ""} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
      <div className="space-y-3 mt-4">
        {items.map((it: any, i: number) => (
          <div key={i} className="grid grid-cols-[120px_1fr_auto] gap-2 items-start">
            <select value={it.icon ?? "sparkles"} onChange={(e) => setItem(i, { icon: e.target.value })} className="px-3 py-2 rounded-md border border-black/10 text-sm bg-white">
              {["users", "book", "compass", "hand", "globe", "heart", "cross", "church", "sparkles"].map((x) => <option key={x}>{x}</option>)}
            </select>
            <Textarea rows={2} value={it.text ?? ""} onChange={(e) => setItem(i, { text: e.target.value })} />
            <Button variant="ghost" onClick={() => setV({ ...v, items: items.filter((_: any, j: number) => j !== i) })}>×</Button>
          </div>
        ))}
        <Button variant="ghost" onClick={() => setV({ ...v, items: [...items, { icon: "sparkles", text: "" }] })}>+ Add Item</Button>
      </div>
      <div className="mt-4">
        <Button onClick={() => m.mutate()} disabled={m.isPending}>
          {m.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Save className="h-3.5 w-3.5" />Save</>}
        </Button>
      </div>
    </Card>
  );
}
