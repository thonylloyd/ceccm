import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { User as UserIcon, LogIn, LogOut, Shield, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export function UserMenu({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null; designation: string | null; designation_other: string | null } | null>(null);
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
    supabase.from("profiles").select("display_name, avatar_url, designation, designation_other").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile((data as any) ?? null));
  }, [user]);

  const baseName = profile?.display_name || user?.email?.split("@")[0] || "";
  const designation = profile?.designation === "Other" ? (profile?.designation_other ?? "") : (profile?.designation ?? "");
  const displayName = baseName ? `Esteemed ${designation ? designation + " " : ""}${baseName}`.trim() : "";
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
            <div className="flex items-center gap-3 pb-2">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="h-9 w-9 rounded-full object-cover border border-black/10" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-navy-deep text-white flex items-center justify-center text-xs font-semibold">
                  {baseName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="text-sm font-semibold text-navy-deep truncate">{displayName}</div>
            </div>
            <Link to="/profile" className="flex items-center gap-2 text-sm text-navy-deep font-semibold"><UserCircle className="h-4 w-4" /> Profile</Link>
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
        className="h-10 w-10 rounded-full border border-black/10 bg-white text-navy-deep flex items-center justify-center hover:bg-navy-deep hover:text-white transition-colors overflow-hidden"
        aria-label="Account"
      >
        {user && avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
        ) : user ? (
          <span className="text-xs font-semibold">{baseName.slice(0, 1).toUpperCase()}</span>
        ) : (
          <UserIcon className="h-4 w-4" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-black/10 shadow-elegant rounded-md py-2 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 border-b border-black/5">
                <div className="text-sm font-semibold text-navy-deep truncate">{displayName}</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-charcoal/50 truncate">{user.email}</div>
              </div>
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-navy-deep hover:bg-light"><UserCircle className="h-4 w-4" /> Profile</Link>
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
