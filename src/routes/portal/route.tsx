import { createFileRoute, Outlet, redirect, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPortalSession } from "@/lib/portal.functions";
import { Loader2, Home, LayoutDashboard, FileText, Users2, BarChart3, GraduationCap, LogOut } from "lucide-react";
import { NotificationsBell } from "@/components/portal/NotificationsBell";
import { PortalCtx, type PortalSession } from "./portal-context";

export const Route = createFileRoute("/portal")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: PortalLayout,
});

function PortalLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const sessFn = useServerFn(getPortalSession);
  const q = useQuery({ queryKey: ["portal-session"], queryFn: () => sessFn() });

  if (q.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <Loader2 className="h-6 w-6 animate-spin text-navy-deep" />
      </div>
    );
  }
  if (!q.data?.hasPortalAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl text-navy-deep mb-2">Portal access restricted</h1>
          <p className="text-sm text-charcoal/70 mb-4">
            Your account does not have Portal access. Please contact an administrator to be assigned a pastor role.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold font-semibold">← Return home</Link>
        </div>
      </div>
    );
  }

  const s = q.data;
  const nav = [
    { to: "/portal", label: "Dashboard", icon: LayoutDashboard, end: true, show: true },
    { to: "/portal/reports", label: "Weekly Reports", icon: FileText, show: s.isPastor || s.isAdmin || s.isSiteMaintenance },
    { to: "/portal/resources", label: "Resource Center", icon: GraduationCap, show: true },
    { to: "/portal/analytics", label: "Analytics", icon: BarChart3, show: s.isAdmin || s.isSiteMaintenance || s.isZonalPastor || s.isGroupPastor },
    { to: "/portal/team", label: "My Team", icon: Users2, show: s.isZonalPastor || s.isGroupPastor || s.isChurchPastor },
  ];

  return (
    <PortalCtx.Provider value={s}>
      <div className="min-h-screen flex bg-light">
        <aside className="w-64 shrink-0 bg-navy-deep text-white/85 flex flex-col">
          <div className="px-6 py-6 border-b border-white/10 flex items-start justify-between gap-2">
            <div>
              <div className="font-display text-xl text-gold">CCM Portal</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 mt-1">
                {roleLabel(s)}
              </div>
            </div>
            <NotificationsBell />
          </div>
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {nav.filter((n) => n.show).map((item) => {
              const active = item.end ? path === item.to : path.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    active ? "bg-gold/15 text-gold" : "hover:bg-white/5 text-white/75"
                  }`}>
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
    </PortalCtx.Provider>
  );
}

function roleLabel(s: PortalSession) {
  if (s.isSiteMaintenance) return "Site Maintenance";
  if (s.roles.includes("admin")) return "Administrator";
  if (s.roles.includes("super_admin")) return "Super Admin";
  if (s.isZonalPastor) return "Zonal Pastor";
  if (s.isGroupPastor) return "Group Pastor";
  if (s.isChurchPastor) return "Church Pastor";
  if (s.isExternalPastor) return "External Pastor";
  return "Member";
}
