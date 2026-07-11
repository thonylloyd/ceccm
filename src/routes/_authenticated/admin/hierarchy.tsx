import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/hierarchy")({
  component: HierarchyAdmin,
});

const TABS = [
  { key: "zones", label: "Zones" },
  { key: "group_churches", label: "Group Churches" },
  { key: "churches", label: "Churches" },
  { key: "assignments", label: "Pastor Assignments" },
] as const;

function HierarchyAdmin() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("zones");

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Church Hierarchy"
        description="Manage zones, group churches, and local churches. Assign pastors to each level in the Users tab."
      />

      <div className="flex gap-1 border-b border-black/10 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-gold text-navy-deep"
                : "border-transparent text-charcoal/60 hover:text-navy-deep"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "zones" && (
        <SectionEditor
          key="zones"
          title="Zones"
          table="zones"
          titleKey="name"
          fields={[
            { key: "name", label: "Zone Name", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
          defaults={{ name: "New Zone", is_active: true }}
        />
      )}

      {tab === "group_churches" && (
        <SectionEditor
          key="group_churches"
          title="Group Churches"
          table="group_churches"
          titleKey="name"
          fields={[
            { key: "name", label: "Group Church Name", type: "text" },
            { key: "zone_id", label: "Zone ID", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
          defaults={{ name: "New Group Church", is_active: true }}
        />
      )}

      {tab === "churches" && (
        <SectionEditor
          key="churches"
          title="Churches"
          table="churches"
          titleKey="name"
          fields={[
            { key: "name", label: "Church Name", type: "text" },
            { key: "group_church_id", label: "Group Church ID", type: "text" },
            { key: "location", label: "Location", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
          defaults={{ name: "New Church", is_active: true }}
        />
      )}

      {tab === "assignments" && (
        <SectionEditor
          key="assignments"
          title="Pastor Assignments"
          table="pastor_assignments"
          titleKey="user_id"
          fields={[
            { key: "user_id", label: "User ID (from Users tab)", type: "text" },
            { key: "role", label: "Role (church_pastor / group_pastor / zonal_pastor / external_pastor)", type: "text" },
            { key: "zone_id", label: "Zone ID (optional)", type: "text" },
            { key: "group_church_id", label: "Group Church ID (optional)", type: "text" },
            { key: "church_id", label: "Church ID (optional)", type: "text" },
          ]}
          defaults={{ role: "church_pastor" }}
        />
      )}
    </div>
  );
}
