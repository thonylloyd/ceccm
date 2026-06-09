import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminGetSetting, adminSetSetting } from "@/lib/admin.functions";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/about")({
  component: AboutAdmin,
});

function AboutAdmin() {
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetSetting);
  const setFn = useServerFn(adminSetSetting);
  const q = useQuery({ queryKey: ["s", "about"], queryFn: () => getFn({ data: { key: "about" } }) as any });
  const [v, setV] = useState<any>({});
  useEffect(() => { if (q.data?.value) setV(q.data.value); }, [q.data]);
  const m = useMutation({
    mutationFn: () => setFn({ data: { key: "about", value: v } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["s", "about"] }); toast.success("Saved"); },
  });

  return (
    <div className="p-8 max-w-3xl">
      <PageHeader title="About Page" description="Manage content for the About page." />
      {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <Card>
          <div className="space-y-3">
            <Field label="Page Title"><Input value={v.title ?? ""} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
            <Field label="Subtitle"><Input value={v.subtitle ?? ""} onChange={(e) => setV({ ...v, subtitle: e.target.value })} /></Field>
            <MediaPicker label="Hero Image" value={v.image_url} onChange={(url) => setV({ ...v, image_url: url })} />
            <Field label="Mission Statement"><Textarea rows={4} value={v.mission ?? ""} onChange={(e) => setV({ ...v, mission: e.target.value })} /></Field>
            <Field label="Our Story"><Textarea rows={8} value={v.story ?? ""} onChange={(e) => setV({ ...v, story: e.target.value })} /></Field>
            <Field label="Vision"><Textarea rows={4} value={v.vision ?? ""} onChange={(e) => setV({ ...v, vision: e.target.value })} /></Field>
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
