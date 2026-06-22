import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { kingschatLogin } from "@/lib/kingschat.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/kingschat-callback")({
  head: () => ({ meta: [{ title: "Signing in… — CCM" }] }),
  component: KingsChatCallback,
});

function KingsChatCallback() {
  const navigate = useNavigate();
  const login = useServerFn(kingschatLogin);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const err = url.searchParams.get("error");
        if (err) throw new Error(err);
        if (!code) throw new Error("Missing authorization code");
        const redirectUri = `${window.location.origin}/auth/kingschat-callback`;
        const { email, hashedToken } = await login({ data: { code, redirectUri } });
        const { error } = await supabase.auth.verifyOtp({
          email,
          token_hash: hashedToken,
          type: "magiclink",
        });
        if (error) throw error;
        toast.success("Signed in with KingsChat");
        navigate({ to: "/" });
      } catch (e: any) {
        toast.error(e?.message || "KingsChat sign-in failed");
        navigate({ to: "/auth" });
      }
    })();
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep text-white">
      <div className="text-center">
        <div className="font-display text-2xl text-gold mb-2">Signing you in…</div>
        <div className="text-white/60 text-sm">Completing KingsChat authentication</div>
      </div>
    </div>
  );
}
