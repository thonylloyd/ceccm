import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminGetSetting, adminSetSetting } from "@/lib/admin.functions";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/admin/ui";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/contact")({
  component: ContactAdmin,
});

function ContactAdmin() {
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetSetting);
  const setFn = useServerFn(adminSetSetting);
  const q = useQuery({ queryKey: ["s", "contact_page"], queryFn: () => getFn({ data: { key: "contact_page" } }) as any });
  const [v, setV] = useState<any>({});
  useEffect(() => { if (q.data?.value) setV(q.data.value); }, [q.data]);
  const m = useMutation({
    mutationFn: () => setFn({ data: { key: "contact_page", value: v } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["s", "contact_page"] }); toast.success("Saved"); },
  });

  return (
    <div className="p-8 max-w-3xl">
      <PageHeader title="Contact Page" description="Manage the contact page content and offices." />
      {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <Card>
          <div className="space-y-3">
            <Field label="Heading"><Input value={v.heading ?? ""} onChange={(e) => setV({ ...v, heading: e.target.value })} /></Field>
            <Field label="Intro"><Textarea rows={3} value={v.intro ?? ""} onChange={(e) => setV({ ...v, intro: e.target.value })} /></Field>
            <Field label="Email"><Input value={v.email ?? ""} onChange={(e) => setV({ ...v, email: e.target.value })} /></Field>
            <Field label="Phone"><Input value={v.phone ?? ""} onChange={(e) => setV({ ...v, phone: e.target.value })} /></Field>
            <Field label="Office Address"><Textarea rows={3} value={v.address ?? ""} onChange={(e) => setV({ ...v, address: e.target.value })} /></Field>
            <Field label="Office Hours"><Input value={v.hours ?? ""} onChange={(e) => setV({ ...v, hours: e.target.value })} /></Field>
          </div>
          <div className="mt-4 pt-4 border-t border-black/5">
            <Button onClick={() => m.mutate()} disabled={m.isPending}>
              {m.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
