import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { siteChromeQuery } from "@/lib/cms.functions";
import { resolveAvatarUrl } from "@/lib/avatar";

const DESIGNATIONS = ["Pastor", "Deacon", "Deaconess", "Brother", "Sister", "Other"] as const;

export const Route = createFileRoute("/_authenticated/profile")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(siteChromeQuery());
  },
  head: () => ({ meta: [{ title: "My Profile — CCM" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [designation, setDesignation] = useState("");
  const [designationOther, setDesignationOther] = useState("");
  const [kcUsername, setKcUsername] = useState("");
  const [email, setEmail] = useState("");
  const [church, setChurch] = useState("");
  const [zone, setZone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (!u) { navigate({ to: "/auth" }); return; }
      supabase.from("profiles")
        .select("display_name,email,designation,designation_other,church,zone,kingschat_username,avatar_url")
        .eq("id", u.id).maybeSingle()
        .then(({ data: p }) => {
          const x: any = p ?? {};
          setDisplayName(x.display_name ?? "");
          setDesignation(x.designation ?? "");
          setDesignationOther(x.designation_other ?? "");
          setKcUsername(x.kingschat_username ?? "");
          setEmail(x.email ?? u.email ?? "");
          setChurch(x.church ?? "");
          setZone(x.zone ?? "");
          resolveAvatarUrl(x.avatar_url).then(setAvatarUrl);
          setLoading(false);
        });
    });
  }, [navigate]);

  const isKcEmail = (email || "").toLowerCase().endsWith("@kingschat.online");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!displayName.trim() || !designation || !church.trim() || !zone.trim()) {
      toast.error("Please fill in all required fields"); return;
    }
    if (designation === "Other" && !designationOther.trim()) {
      toast.error("Please specify your designation"); return;
    }
    setSaving(true);
    try {
      const payload: any = {
        id: user.id,
        email: email || user.email,
        display_name: displayName.trim(),
        designation,
        designation_other: designation === "Other" ? designationOther.trim() : null,
        church: church.trim(),
        zone: zone.trim(),
        kingschat_username: kcUsername.trim() || null,
      };
      const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
      if (error) throw error;
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message ?? "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(file: File) {
    if (!user) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploadingAvatar(true);
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `avatars/${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { error } = await supabase.from("profiles").upsert({ id: user.id, avatar_url: path }, { onConflict: "id" });
      if (error) throw error;
      const signed = await resolveAvatarUrl(path);
      setAvatarUrl(signed);
      toast.success("Profile picture updated");
    } catch (err: any) {
      toast.error(err.message ?? "Could not upload picture");
    } finally {
      setUploadingAvatar(false);
    }
  }

  const designationLabel = designation === "Other" ? designationOther : designation;
  const esteemed = displayName ? `Esteemed ${designationLabel ? designationLabel + " " : ""}${displayName}`.trim() : "";

  const { data: chrome } = useSuspenseQuery(siteChromeQuery());
  const nav = chrome.nav ?? [];
  const brand = chrome.settings.brand ?? { name: "CCM" };

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <SiteHeader nav={nav} brandName={brand.name ?? "CCM"} livestream={chrome.settings.livestream ?? {}} logoUrl={brand.logo_url} />
      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs uppercase tracking-[0.3em] text-gold">My Account</span>
            </div>
            <h1 className="font-display text-4xl text-navy-deep">My Profile</h1>
            <p className="text-charcoal/70 mt-2 text-sm">View and edit your member details.</p>
          </div>

          {loading ? (
            <div className="text-charcoal/60 text-sm">Loading…</div>
          ) : (
            <div className="bg-white rounded-xl shadow-elegant border border-black/5 p-8">
              <div className="flex items-center gap-5 pb-6 mb-6 border-b border-black/5">
                <div className="relative group">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="h-20 w-20 rounded-full object-cover border border-black/10" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-navy-deep text-white flex items-center justify-center text-xl font-semibold">
                      {(displayName || email).slice(0,1).toUpperCase()}
                    </div>
                  )}
                  <label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/45 text-white text-[10px] uppercase tracking-[0.18em] font-semibold opacity-0 group-hover:opacity-100 cursor-pointer transition">
                    {uploadingAvatar ? "Uploading…" : "Change"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingAvatar}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); e.target.value = ""; }}
                    />
                  </label>
                </div>
                <div>
                  <div className="font-semibold text-navy-deep text-lg">{esteemed || email}</div>
                  <div className="text-xs text-charcoal/60 mt-0.5">{user?.email}</div>
                  <div className="text-[11px] text-charcoal/50 mt-1">Hover the picture to change it · JPG/PNG up to 5MB</div>
                </div>
              </div>

              <form onSubmit={save} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs uppercase tracking-[0.18em]">Designation *</Label>
                    <select
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                      className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="" disabled>Select…</option>
                      {DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-[0.18em]">Display name *</Label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="mt-2" />
                  </div>
                </div>
                {designation === "Other" && (
                  <div>
                    <Label className="text-xs uppercase tracking-[0.18em]">Please specify *</Label>
                    <Input value={designationOther} onChange={(e) => setDesignationOther(e.target.value)} required className="mt-2" />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs uppercase tracking-[0.18em]">KingsChat ID</Label>
                    <Input value={kcUsername} onChange={(e) => setKcUsername(e.target.value)} placeholder="username" className="mt-2" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-[0.18em]">Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={!isKcEmail && !!user?.email}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs uppercase tracking-[0.18em]">Church *</Label>
                    <Input value={church} onChange={(e) => setChurch(e.target.value)} required className="mt-2" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-[0.18em]">Zone *</Label>
                    <Input value={zone} onChange={(e) => setZone(e.target.value)} required className="mt-2" />
                  </div>
                </div>
                <div className="pt-2">
                  <Button type="submit" disabled={saving} className="h-11 px-8 bg-gradient-to-r from-gold to-gold-soft text-navy-deep font-semibold uppercase tracking-[0.18em] text-xs">
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <SiteFooter brand={brand} contact={chrome.settings.contact ?? {}} footer={chrome.settings.footer ?? {}} social={chrome.settings.social ?? {}} logoUrl={brand.logo_url} />
    </div>
  );
}
