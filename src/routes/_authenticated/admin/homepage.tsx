import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/ui";
import { SectionEditor, FieldDef } from "@/components/admin/SectionEditor";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: HomepageAdmin,
});

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "mission", label: "Mission" },
  { id: "stats", label: "Statistics" },
  { id: "programs", label: "Programs" },
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

function HomepageAdmin() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("hero");

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader title="Homepage" description="Manage all homepage sections." />
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
