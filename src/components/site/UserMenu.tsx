import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { User as UserIcon, LogIn, LogOut, Shield, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export function UserMenu({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); setProfile(null); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
    supabase.from("profiles").select("display_name, avatar_url").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile((data as any) ?? null));
  }, [user]);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "";
  const avatarUrl = profile?.avatar_url || null;

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    setOpen(false);
    navigate({ to: "/" });
  }

  if (variant === "mobile") {
    return (
      <div className="border-t border-black/5 pt-4 mt-2">
        {user ? (
          <div className="flex flex-col gap-3">
            <Link to="/auth" className="flex items-center gap-2 text-sm text-navy-deep font-semibold"><UserCircle className="h-4 w-4" /> Profile</Link>
            {isAdmin && <Link to="/admin" className="flex items-center gap-2 text-sm text-navy-deep font-semibold"><Shield className="h-4 w-4" /> Admin</Link>}
            <button onClick={signOut} className="flex items-center gap-2 text-sm text-navy-deep font-semibold text-left"><LogOut className="h-4 w-4" /> Sign Out</button>
          </div>
        ) : (
          <Link to="/auth" className="flex items-center gap-2 text-sm text-navy-deep font-semibold"><LogIn className="h-4 w-4" /> Sign In</Link>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="h-10 w-10 rounded-full border border-black/10 bg-white text-navy-deep flex items-center justify-center hover:bg-navy-deep hover:text-white transition-colors"
        aria-label="Account"
      >
        <UserIcon className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-black/10 shadow-elegant rounded-md py-2 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-charcoal/50 truncate border-b border-black/5">
                {user.email}
              </div>
              <Link to="/auth" className="flex items-center gap-2 px-4 py-2 text-sm text-navy-deep hover:bg-light"><UserCircle className="h-4 w-4" /> Profile</Link>
              {isAdmin && <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-navy-deep hover:bg-light"><Shield className="h-4 w-4" /> Admin</Link>}
              <button onClick={signOut} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-navy-deep hover:bg-light"><LogOut className="h-4 w-4" /> Sign Out</button>
            </>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 px-4 py-2 text-sm text-navy-deep hover:bg-light"><LogIn className="h-4 w-4" /> Sign In</Link>
          )}
        </div>
      )}
    </div>
  );
}
