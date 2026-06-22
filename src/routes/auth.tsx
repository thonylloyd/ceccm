import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/logo-ccm.png.asset.json";
import kcIcon from "@/assets/kingschat-icon.png.asset.json";
import hero from "@/assets/hero-cathedral.jpg";
import { KINGSCHAT_AUTH_URL, KINGSCHAT_CLIENT_ID } from "@/lib/kingschat.functions";

function startKingsChat() {
  const redirectUri = `${window.location.origin}/auth/kingschat-callback`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: KINGSCHAT_CLIENT_ID,
    redirect_uri: redirectUri,
    scopes: "send_chat_message",
  });
  window.location.href = `${KINGSCHAT_AUTH_URL}?${params.toString()}`;
}

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Church Consolidation Mission" },
      { name: "description", content: "Sign in or create your CCM member account to access programs, resources and the global ministry community." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset email sent. Check your inbox.");
        setMode("signin");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  const heading = mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Reset password";
  const subheading =
    mode === "signin" ? "Welcome back to the mission."
    : mode === "signup" ? "Join the global CCM community."
    : "Enter your email to receive a reset link.";

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

          <h1 className="font-display text-4xl text-white mb-2">{heading}</h1>
          <p className="text-white/60 text-sm mb-8">{subheading}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/80 text-xs uppercase tracking-[0.18em]">Password</Label>
                  {mode === "signin" && (
                    <button type="button" onClick={() => setMode("forgot")} className="text-xs text-gold hover:underline">Forgot?</button>
                  )}
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-2 bg-white/5 border-white/15 text-white h-12" />
              </div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-gold to-gold-soft text-navy-deep hover:shadow-lg hover:shadow-gold/40 font-semibold uppercase tracking-[0.18em] text-xs">
              {loading ? "Please wait…"
                : mode === "signin" ? "Sign in"
                : mode === "signup" ? "Create account"
                : "Send reset link"}
            </Button>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/40">
                <span className="h-px flex-1 bg-white/10" />
                or
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <button
                type="button"
                onClick={startKingsChat}
                className="w-full h-12 flex items-center justify-center gap-3 rounded-md bg-white text-navy-deep font-semibold uppercase tracking-[0.18em] text-xs hover:bg-white/90 transition-colors"
              >
                <img src={kcIcon.url} alt="" className="h-5 w-5 object-contain" />
                Continue with KingsChat
              </button>
            </>
          )}

          <div className="mt-6 text-center text-sm text-white/60 space-y-2">
            {mode === "signin" && (
              <div>New to CCM?{" "}
                <button onClick={() => setMode("signup")} className="text-gold hover:underline">Create an account</button>
              </div>
            )}
            {mode === "signup" && (
              <div>Already a member?{" "}
                <button onClick={() => setMode("signin")} className="text-gold hover:underline">Sign in</button>
              </div>
            )}
            {mode === "forgot" && (
              <div>
                <button onClick={() => setMode("signin")} className="text-gold hover:underline">Back to sign in</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
