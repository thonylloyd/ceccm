import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/admin/ui";
import { SectionEditor, FieldDef } from "@/components/admin/SectionEditor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminGetSetting, adminSetSetting } from "@/lib/admin.functions";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: HomepageAdmin,
});

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "mission_statement", label: "Mission Statement" },
  { id: "mission", label: "Mission Cards" },
  { id: "stats", label: "Statistics" },
  { id: "programs", label: "Programs" },
  { id: "praise", label: "Praise Reports" },
  { id: "resources", label: "Resources" },
] as const;

const HERO_FIELDS: FieldDef[] = [
  { key: "eyebrow", label: "Welcome Text (Eyebrow)", type: "text", placeholder: "Welcome to" },
  { key: "heading", label: "Heading", type: "textarea", placeholder: "Church Consolidation Mission" },
  { key: "subheading", label: "Subheading", type: "text", placeholder: "Consolidating the Body of Christ" },
  { key: "background_image_url", label: "Background Image", type: "image" },
  { key: "overlay_opacity", label: "Overlay Opacity (0–1)", type: "number" },
  { key: "primary_cta_label", label: "Primary Button Label", type: "text" },
  { key: "primary_cta_url", label: "Primary Button URL", type: "url" },
  { key: "secondary_cta_label", label: "Secondary Button Label", type: "text" },
  { key: "secondary_cta_url", label: "Secondary Button URL", type: "url" },
];

const MISSION_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "icon", label: "Icon", type: "icon" },
];

const STAT_FIELDS: FieldDef[] = [
  { key: "value", label: "Number", type: "text", placeholder: "50+" },
  { key: "label", label: "Label", type: "text", placeholder: "Countries Reached" },
  { key: "icon", label: "Icon", type: "icon" },
];

const PROGRAM_FIELDS: FieldDef[] = [
  { key: "title", label: "Event Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "event_date", label: "Date", type: "date" },
  { key: "event_type", label: "Event Type", type: "text", placeholder: "Virtual Event" },
  { key: "location", label: "Location", type: "text", placeholder: "Lagos, Nigeria or Online" },
  { key: "image_url", label: "Event Image", type: "image" },
  { key: "cta_label", label: "CTA Label", type: "text" },
  { key: "registration_url", label: "Registration URL", type: "url" },
];

const RESOURCE_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "image_url", label: "Image", type: "image" },
  { key: "cta_label", label: "CTA Label", type: "text" },
  { key: "cta_url", label: "CTA URL", type: "url" },
];

const PRAISE_FIELDS: FieldDef[] = [
  { key: "quote", label: "Quote", type: "textarea" },
  { key: "author", label: "Author", type: "text" },
  { key: "role", label: "Role / Title", type: "text" },
];

function HomepageAdmin() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("hero");

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader title="Homepage" description="Manage all homepage sections." />
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

      {tab === "hero" && (
        <SectionEditor
          title="Hero Banners"
          description="Slides shown in the main hero carousel. Add unlimited banners."
          table="hero_banners"
          fields={HERO_FIELDS}
          defaults={{ eyebrow: "Welcome to", heading: "New Banner", overlay_opacity: 0.55 }}
          titleKey="heading"
        />
      )}
      {tab === "mission_statement" && <MissionStatementEditor />}
      {tab === "mission" && (
        <SectionEditor
          title="Mission Cards"
          table="mission_cards"
          fields={MISSION_FIELDS}
          defaults={{ title: "New Mission", description: "", icon: "globe" }}
        />
      )}
      {tab === "stats" && (
        <SectionEditor
          title="Statistics"
          table="statistics"
          fields={STAT_FIELDS}
          defaults={{ value: "0+", label: "New Stat" }}
          titleKey="label"
        />
      )}
      {tab === "programs" && (
        <SectionEditor
          title="Upcoming Programs"
          description="Events shown in the homepage programs carousel."
          table="programs"
          fields={PROGRAM_FIELDS}
          defaults={{ title: "New Program", cta_label: "Register Now" }}
        />
      )}
      {tab === "praise" && (
        <SectionEditor
          title="Praise Reports"
          description="Testimonials displayed on the homepage."
          table="praise_reports"
          fields={PRAISE_FIELDS}
          defaults={{ quote: "Share a testimony...", author: "", role: "" }}
          titleKey="author"
        />
      )}
      {tab === "resources" && (
        <SectionEditor
          title="Resource Cards"
          table="resource_cards"
          fields={RESOURCE_FIELDS}
          defaults={{ title: "New Resource", cta_label: "Click Here" }}
        />
      )}
    </div>
  );
}

function MissionStatementEditor() {
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetSetting);
  const setFn = useServerFn(adminSetSetting);
  const q = useQuery({ queryKey: ["s", "homepage_mission"], queryFn: () => getFn({ data: { key: "homepage_mission" } }) as any });
  const [v, setV] = useState<any>({
    title: "Our Mission",
    statement: "Church Consolidation Mission exists to help every member become an effective and relevant part of the Church, strengthening and equipping the brethren for impactful service in the race for the last lost soul.",
  });
  useEffect(() => { if (q.data?.value) setV({ ...v, ...q.data.value }); /* eslint-disable-next-line */ }, [q.data]);
  const m = useMutation({
    mutationFn: () => setFn({ data: { key: "homepage_mission", value: v } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["s", "homepage_mission"] }); qc.invalidateQueries({ queryKey: ["homepage"] }); toast.success("Saved"); },
  });
  if (q.isLoading) return <Loader2 className="h-5 w-5 animate-spin text-navy-deep" />;
  return (
    <Card>
      <h2 className="font-display text-lg text-navy-deep mb-4">Mission Section Header</h2>
      <div className="space-y-3">
        <Field label="Section Title"><Input value={v.title ?? ""} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
        <Field label="Mission Statement (shown above the cards)">
          <Textarea rows={5} value={v.statement ?? ""} onChange={(e) => setV({ ...v, statement: e.target.value })} />
        </Field>
        <Button onClick={() => m.mutate()} disabled={m.isPending}>
          {m.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Save className="h-3.5 w-3.5" />Save</>}
        </Button>
      </div>
    </Card>
  );
}
