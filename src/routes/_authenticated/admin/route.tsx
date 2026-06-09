import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getIsAdmin, bootstrapAdminIfNone } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Home, Info, Calendar, Mail, Menu as MenuIcon,
  Image as ImageIcon, Users, Settings, LogOut, Loader2,
} from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/about", label: "About", icon: Info },
  { to: "/admin/programs", label: "Programs", icon: Calendar },
  { to: "/admin/contact", label: "Contact", icon: Mail },
  { to: "/admin/navigation", label: "Navigation", icon: MenuIcon },
  { to: "/admin/media", label: "Media Library", icon: ImageIcon },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdminFn = useServerFn(getIsAdmin);
  const bootstrapFn = useServerFn(bootstrapAdminIfNone);
  const q = useQuery({ queryKey: ["is-admin"], queryFn: () => isAdminFn() });
  const bootstrap = useMutation({ mutationFn: () => bootstrapFn(), onSuccess: () => q.refetch() });

  useEffect(() => {
    if (q.data && !q.data.isAdmin && !bootstrap.isPending && !bootstrap.isSuccess) {
      bootstrap.mutate();
    }
  }, [q.data]);

  if (q.isLoading || bootstrap.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <Loader2 className="h-6 w-6 animate-spin text-navy-deep" />
      </div>
    );
  }
  if (q.data && !q.data.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl text-navy-deep mb-2">Access restricted</h1>
          <p className="text-sm text-charcoal/70">Your account does not have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-light">
      <aside className="w-64 shrink-0 bg-navy-deep text-white/85 flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="font-display text-xl text-gold">CCM Admin</div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 mt-1">Content Manager</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = item.end ? path === item.to : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active ? "bg-gold/15 text-gold" : "hover:bg-white/5 text-white/75"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/70 hover:bg-white/5">
            <Home className="h-4 w-4" /> View Site
          </Link>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/70 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
