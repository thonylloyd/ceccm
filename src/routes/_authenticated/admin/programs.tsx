import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { SectionEditor } from "@/components/admin/SectionEditor";

export const Route = createFileRoute("/_authenticated/admin/programs")({
  component: ProgramsAdmin,
});

function ProgramsAdmin() {
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader title="Programs" description="All ministry events and gatherings." />
      <SectionEditor
        title="Programs"
        table="programs"
        fields={[
          { key: "title", label: "Event Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "event_date", label: "Date", type: "date" },
          { key: "event_type", label: "Event Type", type: "text" },
          { key: "image_url", label: "Event Image", type: "image" },
          { key: "cta_label", label: "CTA Label", type: "text" },
          { key: "registration_url", label: "Registration URL", type: "url" },
        ]}
        defaults={{ title: "New Program", cta_label: "Register Now" }}
      />
    </div>
  );
}
