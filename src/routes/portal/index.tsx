import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPortalOverview } from "@/lib/portal.functions";
import { usePortalSession } from "./portal-context";
import { FileText, GraduationCap, Users2, BarChart3, Building2, MapPin, ChurchIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/")({
  component: PortalDashboard,
});

function PortalDashboard() {
  const s = usePortalSession();
  const overviewFn = useServerFn(getPortalOverview);
  const q = useQuery({ queryKey: ["portal-overview"], queryFn: () => overviewFn() });

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50">Welcome to</div>
        <h1 className="font-display text-3xl text-navy-deep">CCM Portal</h1>
        <p className="text-sm text-charcoal/70 mt-2 max-w-2xl">
          Your gateway to weekly reporting, training resources, and church growth insights.
        </p>
      </div>

      {(s.isAdmin || s.isSiteMaintenance) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={MapPin} label="Zones" value={q.data?.zoneCount ?? "—"} />
          <StatCard icon={Building2} label="Group Churches" value={q.data?.groupCount ?? "—"} />
          <StatCard icon={ChurchIcon} label="Churches" value={q.data?.churchCount ?? "—"} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(s.isPastor || s.isAdmin || s.isSiteMaintenance) && (
          <QuickCard to="/portal/reports" icon={FileText} title="Weekly Reports" desc="Submit and review weekly church growth reports." />
        )}
        <QuickCard to="/portal/resources" icon={GraduationCap} title="Resource Center" desc="Access training materials, courses, and study guides." />
        {(s.isAdmin || s.isSiteMaintenance || s.isZonalPastor || s.isGroupPastor) && (
          <QuickCard to="/portal/analytics" icon={BarChart3} title="Analytics" desc="Track growth trends across your churches." />
        )}
        {(s.isZonalPastor || s.isGroupPastor || s.isChurchPastor) && (
          <QuickCard to="/portal/team" icon={Users2} title="My Team" desc="View pastors and churches under your leadership." />
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white rounded-lg shadow-elegant border border-black/5 p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-gold/10 text-gold flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50">{label}</div>
          <div className="font-display text-2xl text-navy-deep">{value}</div>
        </div>
      </div>
    </div>
  );
}

function QuickCard({ to, icon: Icon, title, desc }: any) {
  return (
    <Link to={to} className="block bg-white rounded-lg shadow-elegant border border-black/5 p-6 hover:border-gold/40 transition-colors">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-md bg-navy-deep text-gold flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-lg text-navy-deep">{title}</h3>
          <p className="text-sm text-charcoal/70 mt-1">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
