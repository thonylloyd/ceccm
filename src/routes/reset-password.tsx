import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/logo-ccm.png.asset.json";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — CCM" }, { name: "description", content: "Set a new password for your CCM account." }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase places recovery tokens in the URL hash. supabase-js parses them
    // automatically and emits a PASSWORD_RECOVERY event.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center">
          <img src={logo.url} alt="CCM" className="h-12 w-12 object-contain" />
          <div className="font-display text-xl text-gold">CCM</div>
        </Link>
        <h1 className="font-display text-3xl text-white mb-2 text-center">Set a new password</h1>
        <p className="text-white/60 text-sm mb-8 text-center">Choose a strong password you'll remember.</p>

        {!ready ? (
          <div className="text-center text-white/70 text-sm">
            Open this page using the link in your password reset email.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="pw" className="text-white/80 text-xs uppercase tracking-[0.18em]">New password</Label>
              <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-2 bg-white/5 border-white/15 text-white h-12" />
            </div>
            <div>
              <Label htmlFor="cf" className="text-white/80 text-xs uppercase tracking-[0.18em]">Confirm password</Label>
              <Input id="cf" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} className="mt-2 bg-white/5 border-white/15 text-white h-12" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-to-r from-gold to-gold-soft text-navy-deep font-semibold uppercase tracking-[0.18em] text-xs">
              {loading ? "Saving…" : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
