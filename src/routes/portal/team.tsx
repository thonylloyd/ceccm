import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyTeam } from "@/lib/analytics.functions";
import { usePortalSession } from "./route";
import { resolveAvatarUrl } from "@/lib/avatar";
import { Loader2, Church as ChurchIcon, Users2, Building2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/portal/team")({
  component: TeamPage,
});

const ROLE_LABEL: Record<string, string> = {
  zonal_pastor: "Zonal Pastor",
  group_pastor: "Group Pastor",
  church_pastor: "Church Pastor",
  external_pastor: "External Pastor",
};

function TeamPage() {
  const s = usePortalSession();
  const fn = useServerFn(getMyTeam);
  const q = useQuery({ queryKey: ["my-team"], queryFn: () => fn() });

  if (!(s.isZonalPastor || s.isGroupPastor || s.isChurchPastor)) {
    return <div className="p-8 text-sm text-charcoal/70">My Team is available to zonal, group, and church pastors.</div>;
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50">Portal</div>
        <h1 className="font-display text-3xl text-navy-deep">My Team</h1>
        <p className="text-sm text-charcoal/70 mt-1">Pastors and churches under your leadership scope.</p>
      </div>

      {q.isLoading ? (
        <div className="flex items-center gap-2 text-sm text-charcoal/60"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : !q.data ? null : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-8">
            <Stat icon={MapPin} label="Zones" value={q.data.scope.zones} />
            <Stat icon={Building2} label="Group Churches" value={q.data.scope.groups} />
            <Stat icon={ChurchIcon} label="Churches" value={q.data.scope.churches} />
          </div>

          <section className="bg-white rounded-lg shadow-elegant border border-black/5 p-6 mb-6">
            <h2 className="font-display text-lg text-navy-deep mb-4 flex items-center gap-2">
              <Users2 className="h-4 w-4 text-gold" /> Pastors in scope
            </h2>
            {q.data.pastors.length === 0 ? (
              <div className="text-sm text-charcoal/60">No pastors assigned yet within your scope.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {q.data.pastors.map((p: any) => (
                  <PastorCard key={p.id} p={p} />
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-lg shadow-elegant border border-black/5 p-6">
            <h2 className="font-display text-lg text-navy-deep mb-4 flex items-center gap-2">
              <ChurchIcon className="h-4 w-4 text-gold" /> Churches in scope
            </h2>
            {q.data.churches.length === 0 ? (
              <div className="text-sm text-charcoal/60">No churches in scope yet.</div>
            ) : (
              <ul className="divide-y divide-black/5">
                {q.data.churches.map((c: any) => (
                  <li key={c.id} className="py-2.5 flex items-center justify-between text-sm">
                    <span className="text-navy-deep">{c.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function PastorCard({ p }: { p: any }) {
  const [avatar, setAvatar] = useState<string | null>(null);
  useEffect(() => {
    if (p.profile?.avatar_url) resolveAvatarUrl(p.profile.avatar_url).then(setAvatar).catch(() => setAvatar(null));
  }, [p.profile?.avatar_url]);
  const name = p.profile?.display_name ?? p.profile?.email ?? "Unknown pastor";
  const desig = p.profile?.designation;
  return (
    <div className="border border-black/5 rounded-md p-3 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gold/20 text-gold flex items-center justify-center overflow-hidden shrink-0">
        {avatar ? <img src={avatar} alt={name} className="h-full w-full object-cover" /> : <span className="text-sm font-semibold">{name.charAt(0).toUpperCase()}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-navy-deep truncate">{desig ? `${desig} ${name}` : name}</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-charcoal/50">{ROLE_LABEL[p.role] ?? p.role}</div>
      </div>
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
      <div className="font-display text-2xl text-navy-deep mt-1">{value}</div>
    </div>
  );
}
