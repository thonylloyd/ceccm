import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DESIGNATIONS = ["Pastor", "Deacon", "Deaconess", "Brother", "Sister", "Other"] as const;

type Profile = {
  display_name: string | null;
  email: string | null;
  designation: string | null;
  designation_other: string | null;
  church: string | null;
  zone: string | null;
  kingschat_username: string | null;
};

function isIncomplete(p: Profile | null) {
  if (!p) return false; // wait until loaded
  if (!p.display_name?.trim()) return true;
  if (!p.designation?.trim()) return true;
  if (p.designation === "Other" && !p.designation_other?.trim()) return true;
  if (!p.church?.trim()) return true;
  if (!p.zone?.trim()) return true;
  return false;
}

export function ProfileCompletionModal() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [designation, setDesignation] = useState("");
  const [designationOther, setDesignationOther] = useState("");
  const [kcUsername, setKcUsername] = useState("");
  const [email, setEmail] = useState("");
  const [church, setChurch] = useState("");
  const [zone, setZone] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setProfile(null); setOpen(false); return; }
    supabase
      .from("profiles")
      .select("display_name,email,designation,designation_other,church,zone,kingschat_username")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const p = (data as Profile | null) ?? {
          display_name: null, email: user.email ?? null, designation: null,
          designation_other: null, church: null, zone: null, kingschat_username: null,
        };
        setProfile(p);
        if (isIncomplete(p)) {
          setDisplayName(p.display_name ?? "");
          setDesignation(p.designation ?? "");
          setDesignationOther(p.designation_other ?? "");
          setKcUsername(p.kingschat_username ?? "");
          setEmail(p.email ?? user.email ?? "");
          setChurch(p.church ?? "");
          setZone(p.zone ?? "");
          setOpen(true);
        }
      });
  }, [user]);

  const isKcEmail = (email || "").toLowerCase().endsWith("@kingschat.online");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!displayName.trim() || !designation || !church.trim() || !zone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (designation === "Other" && !designationOther.trim()) {
      toast.error("Please specify your designation");
      return;
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
      toast.success("Profile completed");
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !isIncomplete(profile)) setOpen(false); }}>
      <DialogContent
        className="max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-navy-deep">Complete your profile</DialogTitle>
          <DialogDescription>
            Welcome! Please tell us a little about yourself to continue.
          </DialogDescription>
        </DialogHeader>
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
          <Button type="submit" disabled={saving} className="w-full h-11 bg-gradient-to-r from-gold to-gold-soft text-navy-deep font-semibold uppercase tracking-[0.18em] text-xs">
            {saving ? "Saving…" : "Save & continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
