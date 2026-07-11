import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAnalytics } from "@/lib/analytics.functions";
import { usePortalSession } from "./route";
import { useState } from "react";
import { Loader2, TrendingUp, Users, Droplet, Flame, UserPlus, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/portal/analytics")({
  component: AnalyticsPage,
});

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function AnalyticsPage() {
  const s = usePortalSession();
  const now = new Date();
  const [year, setYear] = useState(now.getUTCFullYear());
  const fn = useServerFn(getAnalytics);
  const q = useQuery({ queryKey: ["analytics", year], queryFn: () => fn({ data: { year } }) });

  if (!(s.isAdmin || s.isSiteMaintenance || s.isZonalPastor || s.isGroupPastor)) {
    return <div className="p-8 text-sm text-charcoal/70">Analytics is available to zonal, group, and admin roles.</div>;
  }

  const data = q.data;
  const max = Math.max(1, ...(data?.monthly ?? []).map((m: any) => m.new_converts));

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50">Portal</div>
          <h1 className="font-display text-3xl text-navy-deep">Analytics</h1>
          <p className="text-sm text-charcoal/70 mt-1">Growth insights across the churches you can view.</p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-black/10 rounded-md px-3 py-2 text-sm bg-white"
        >
          {Array.from({ length: 5 }, (_, i) => now.getUTCFullYear() - i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {q.isLoading ? (
        <div className="flex items-center gap-2 text-sm text-charcoal/60"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : !data ? null : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <Stat icon={UserPlus} label="New Converts" value={data.totals.new_converts} />
            <Stat icon={Droplet} label="Baptized" value={data.totals.water_baptized} />
            <Stat icon={Flame} label="Filled w/ Spirit" value={data.totals.filled_with_spirit} />
            <Stat icon={Users} label="First Timers" value={data.totals.first_timers} />
            <Stat icon={TrendingUp} label="Church Attendance" value={data.totals.church_attendance} />
            <Stat icon={ClipboardList} label="Reports" value={data.reportCount} />
          </div>

          <section className="bg-white rounded-lg shadow-elegant border border-black/5 p-6 mb-6">
            <h2 className="font-display text-lg text-navy-deep mb-4">New Converts by Month</h2>
            <div className="flex items-end gap-2 h-48">
              {data.monthly.map((m: any) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full bg-gold/70 rounded-sm"
                      style={{ height: `${(m.new_converts / max) * 100}%` }}
                      title={String(m.new_converts)}
                    />
                  </div>
                  <div className="text-[10px] text-charcoal/60">{MONTHS[m.month - 1]}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-lg shadow-elegant border border-black/5 p-6">
              <h2 className="font-display text-lg text-navy-deep mb-4">Membership Effectiveness (added)</h2>
              <ul className="space-y-2 text-sm">
                <Row label="Foundation School" value={data.totals.foundation_school_added} />
                <Row label="Discipleship" value={data.totals.discipleship_added} />
                <Row label="Cell Leaders" value={data.totals.cell_leaders_added} />
                <Row label="Cell Members" value={data.totals.cell_members_added} />
                <Row label="Workers" value={data.totals.workers_added} />
                <Row label="Tithers" value={data.totals.tithers} />
                <Row label="Partners" value={data.totals.partners} />
              </ul>
            </section>

            <section className="bg-white rounded-lg shadow-elegant border border-black/5 p-6">
              <h2 className="font-display text-lg text-navy-deep mb-4">Top Churches — New Converts</h2>
              {data.topChurches.length === 0 ? (
                <div className="text-sm text-charcoal/60">No church-scoped reports for {year}.</div>
              ) : (
                <ul className="space-y-2">
                  {data.topChurches.map((c: any, i: number) => (
                    <li key={c.id} className="flex items-center gap-3 text-sm">
                      <span className="w-6 text-charcoal/50">{i + 1}.</span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="font-semibold text-navy-deep">{c.converts}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="mt-6 text-xs text-charcoal/60">
            {data.submitted} submitted · {data.drafts} draft · {data.reportCount} total reports for {year}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white rounded-lg shadow-elegant border border-black/5 p-4">
      <div className="flex items-center gap-2 text-charcoal/60">
        <Icon className="h-4 w-4" />
        <span className="text-[10px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <div className="font-display text-2xl text-navy-deep mt-1">{Number(value ?? 0).toLocaleString()}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center justify-between border-b border-black/5 pb-1.5">
      <span className="text-charcoal/70">{label}</span>
      <span className="font-semibold text-navy-deep">{Number(value ?? 0).toLocaleString()}</span>
    </li>
  );
}
