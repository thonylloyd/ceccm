import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminGetSetting, adminSetSetting } from "@/lib/admin.functions";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

function useSetting(key: string) {
  const getFn = useServerFn(adminGetSetting);
  return useQuery({ queryKey: ["s", key], queryFn: () => getFn({ data: { key } }) as any });
}

function SettingCard({ skey, title, render }: { skey: string; title: string; render: (v: any, set: (v: any) => void) => any }) {
  const qc = useQueryClient();
  const setFn = useServerFn(adminSetSetting);
  const q = useSetting(skey);
  const [value, setValue] = useState<any>({});
  useEffect(() => { if (q.data?.value) setValue(q.data.value); }, [q.data]);

  const m = useMutation({
    mutationFn: () => setFn({ data: { key: skey, value } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["s", skey] }); qc.invalidateQueries({ queryKey: ["homepage"] }); toast.success("Saved"); },
  });

  return (
    <Card>
      <h2 className="font-display text-lg text-navy-deep mb-4">{title}</h2>
      {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <>
          <div className="space-y-3">{render(value, setValue)}</div>
          <div className="mt-4 pt-4 border-t border-black/5">
            <Button onClick={() => m.mutate()} disabled={m.isPending}>
              {m.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

function SettingsAdmin() {
  return (
    <div className="p-8 max-w-3xl space-y-6">
      <PageHeader title="Global Settings" description="Brand, contact, footer, social, and SEO." />

      <SettingCard skey="brand" title="Brand" render={(v, set) => (
        <>
          <Field label="Site Name"><Input value={v.name ?? ""} onChange={(e) => set({ ...v, name: e.target.value })} /></Field>
          <Field label="Tagline"><Input value={v.tagline ?? ""} onChange={(e) => set({ ...v, tagline: e.target.value })} /></Field>
          <MediaPicker label="Logo" value={v.logo_url} onChange={(url) => set({ ...v, logo_url: url })} />
          <MediaPicker label="Favicon" value={v.favicon_url} onChange={(url) => set({ ...v, favicon_url: url })} />
          <Field label="Primary Color (Navy)"><Input value={v.color_primary ?? ""} onChange={(e) => set({ ...v, color_primary: e.target.value })} placeholder="#041E4A" /></Field>
          <Field label="Accent Color (Gold)"><Input value={v.color_accent ?? ""} onChange={(e) => set({ ...v, color_accent: e.target.value })} placeholder="#B88A1B" /></Field>
        </>
      )} />

      <SettingCard skey="contact" title="Contact Information" render={(v, set) => (
        <>
          <Field label="Email"><Input value={v.email ?? ""} onChange={(e) => set({ ...v, email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={v.phone ?? ""} onChange={(e) => set({ ...v, phone: e.target.value })} /></Field>
          <Field label="Address"><Textarea rows={2} value={v.address ?? ""} onChange={(e) => set({ ...v, address: e.target.value })} /></Field>
        </>
      )} />

      <SettingCard skey="social" title="Social Links" render={(v, set) => (
        <>
          <Field label="Email URL"><Input value={v.email ?? ""} onChange={(e) => set({ ...v, email: e.target.value })} placeholder="mailto:..." /></Field>
          <Field label="Phone URL"><Input value={v.phone ?? ""} onChange={(e) => set({ ...v, phone: e.target.value })} placeholder="tel:..." /></Field>
          <Field label="Website URL"><Input value={v.website ?? ""} onChange={(e) => set({ ...v, website: e.target.value })} /></Field>
          <Field label="KingsChat"><Input value={v.kingschat ?? ""} onChange={(e) => set({ ...v, kingschat: e.target.value })} /></Field>
        </>
      )} />

      <SettingCard skey="livestream" title="Livestream Button" render={(v, set) => (
        <>
          <Field label="Label"><Input value={v.label ?? ""} onChange={(e) => set({ ...v, label: e.target.value })} /></Field>
          <Field label="URL"><Input value={v.url ?? ""} onChange={(e) => set({ ...v, url: e.target.value })} /></Field>
        </>
      )} />

      <SettingCard skey="footer" title="Footer" render={(v, set) => (
        <>
          <Field label="Copyright"><Input value={v.copyright ?? ""} onChange={(e) => set({ ...v, copyright: e.target.value })} /></Field>
          <Field label="Support Links (JSON array)">
            <Textarea
              rows={5}
              value={JSON.stringify(v.support_links ?? [], null, 2)}
              onChange={(e) => { try { set({ ...v, support_links: JSON.parse(e.target.value) }); } catch {} }}
              className="font-mono text-xs"
            />
          </Field>
        </>
      )} />

      <SettingCard skey="seo" title="SEO Metadata" render={(v, set) => (
        <>
          <Field label="Site Title"><Input value={v.site_title ?? ""} onChange={(e) => set({ ...v, site_title: e.target.value })} /></Field>
          <Field label="Site Description"><Textarea rows={2} value={v.site_description ?? ""} onChange={(e) => set({ ...v, site_description: e.target.value })} /></Field>
          <MediaPicker label="OG Image" value={v.og_image} onChange={(url) => set({ ...v, og_image: url })} />
        </>
      )} />

      <SettingCard skey="analytics" title="Analytics Scripts" render={(v, set) => (
        <>
          <Field label="Google Analytics ID"><Input value={v.ga_id ?? ""} onChange={(e) => set({ ...v, ga_id: e.target.value })} placeholder="G-XXXXXXX" /></Field>
          <Field label="Custom Head Script" hint="Pasted verbatim into <head>">
            <Textarea rows={5} value={v.head_script ?? ""} onChange={(e) => set({ ...v, head_script: e.target.value })} className="font-mono text-xs" />
          </Field>
        </>
      )} />

      <SettingCard skey="homepage" title="Homepage Copy" render={(v, set) => (
        <>
          <Field label="Mission Section Title"><Input value={v.mission_title ?? ""} onChange={(e) => set({ ...v, mission_title: e.target.value })} /></Field>
          <Field label="Programs Section Intro"><Input value={v.programs_intro ?? ""} onChange={(e) => set({ ...v, programs_intro: e.target.value })} /></Field>
        </>
      )} />

      <SettingCard skey="salvation" title="Receive Salvation Popup" render={(v, set) => (
        <>
          <Field label="Video URL" hint="YouTube, Vimeo, or direct video URL shown at top of the popup">
            <Input value={v.video_url ?? ""} onChange={(e) => set({ ...v, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
          </Field>
          <div className="rounded-md bg-light p-3 text-xs text-charcoal/70 leading-relaxed">
            <div className="font-semibold text-navy-deep mb-1">Open the popup anywhere</div>
            Append <code className="px-1.5 py-0.5 rounded bg-white border border-black/10 font-mono">?salvation=1</code> to any URL.
            Examples: <code className="font-mono">/?salvation=1</code>, <code className="font-mono">/about?salvation=1</code>.
            Use this on any button (<code className="font-mono">&lt;a href="/?salvation=1"&gt;</code>) to open the modal.
          </div>
          <Field label="View Submitted Leads">
            <a href="/admin/salvation-leads" className="inline-flex items-center text-sm text-navy-deep hover:text-gold font-semibold">Open Leads &rarr;</a>
          </Field>
        </>
      )} />

      <SettingCard skey="partner" title="Partner With Us Popup" render={(v, set) => (
        <>
          <Field label="Intro Message" hint="Shown at the top of the partner popup">
            <Textarea rows={3} value={v.intro ?? ""} onChange={(e) => set({ ...v, intro: e.target.value })} placeholder="Join us in making the divine mandate a reality across the nations. Partner with us today." />
          </Field>
          <Field label="Espees Merchant Code">
            <Input value={v.espees_merchant ?? ""} onChange={(e) => set({ ...v, espees_merchant: e.target.value })} placeholder="CECCM" />
          </Field>
          <Field label="Bank Account Name">
            <Input value={v.bank_account_name ?? ""} onChange={(e) => set({ ...v, bank_account_name: e.target.value })} placeholder="CE CCM" />
          </Field>
          <Field label="Bank Account Number">
            <Input value={v.bank_account_number ?? ""} onChange={(e) => set({ ...v, bank_account_number: e.target.value })} placeholder="012345678" />
          </Field>
          <Field label="Bank Name">
            <Input value={v.bank_name ?? ""} onChange={(e) => set({ ...v, bank_name: e.target.value })} placeholder="Parallex" />
          </Field>
          <div className="rounded-md bg-light p-3 text-xs text-charcoal/70 leading-relaxed">
            <div className="font-semibold text-navy-deep mb-1">Open the popup anywhere</div>
            Append <code className="px-1.5 py-0.5 rounded bg-white border border-black/10 font-mono">?partner=1</code> to any URL.
            Examples: <code className="font-mono">/?partner=1</code>, <code className="font-mono">/about?partner=1</code>.
          </div>
        </>
      )} />
    </div>
  );
}
