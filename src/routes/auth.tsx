import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/logo-ccm.png.asset.json";
import hero from "@/assets/hero-cathedral.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Church Consolidation Mission" },
      { name: "description", content: "Sign in or create your CCM member account to access programs, resources and the global ministry community." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function handleGoogle() {
    setLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res?.error) {
      toast.error(res.error.message ?? "Could not sign in with Google");
      setLoading(false);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-navy-deep">
      <div className="relative hidden lg:block overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/80 via-navy/60 to-navy-deep/95" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo.url} alt="CCM" className="h-14 w-14 object-contain drop-shadow-[0_0_18px_rgba(184,138,27,0.4)]" />
            <div>
              <div className="font-display text-2xl text-gold">CCM</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/70">Church Consolidation Mission</div>
            </div>
          </Link>
          <div className="max-w-md">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs uppercase tracking-[0.3em] text-gold">Welcome</span>
            </div>
            <h2 className="font-display text-5xl leading-tight">
              Step into the<br />
              <span className="italic text-gold font-light">global community</span><br />
              of believers.
            </h2>
            <p className="mt-6 text-white/70 leading-relaxed">
              Access programs, prayer rooms, resources and ministry tools across 50+ nations.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.22em] text-white/40">
            © 2026 Church Consolidation Mission
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <img src={logo.url} alt="CCM" className="h-12 w-12 object-contain" />
            <div className="font-display text-xl text-gold">CCM</div>
          </Link>

          <h1 className="font-display text-4xl text-white mb-2">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-white/60 text-sm mb-8">
            {mode === "signin" ? "Welcome back to the mission." : "Join the global CCM community."}
          </p>

          <Button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            variant="outline"
            className="w-full h-12 bg-white text-navy-deep hover:bg-white/90 border-0 font-semibold"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-white/40">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleEmail} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="text-white/80 text-xs uppercase tracking-[0.18em]">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-2 bg-white/5 border-white/15 text-white h-12" />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-white/80 text-xs uppercase tracking-[0.18em]">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 bg-white/5 border-white/15 text-white h-12" />
            </div>
            <div>
              <Label htmlFor="password" className="text-white/80 text-xs uppercase tracking-[0.18em]">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-2 bg-white/5 border-white/15 text-white h-12" />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-gold to-gold-soft text-navy-deep hover:shadow-lg hover:shadow-gold/40 font-semibold uppercase tracking-[0.18em] text-xs"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-white/60">
            {mode === "signin" ? (
              <>New to CCM?{" "}
                <button onClick={() => setMode("signup")} className="text-gold hover:underline">Create an account</button>
              </>
            ) : (
              <>Already a member?{" "}
                <button onClick={() => setMode("signin")} className="text-gold hover:underline">Sign in</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
