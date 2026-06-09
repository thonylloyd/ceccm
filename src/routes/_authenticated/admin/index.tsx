import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList } from "@/lib/admin.functions";
import { Home, Calendar, Image as ImageIcon, Menu, Users, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Card({ to, icon: Icon, label, count }: any) {
  return (
    <Link to={to} className="bg-white border border-black/5 rounded-lg p-5 hover:shadow-card transition-shadow flex items-center gap-4">
      <div className="h-11 w-11 rounded-md bg-navy-deep/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-navy-deep" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-charcoal/60">{label}</div>
        <div className="text-2xl font-display text-navy-deep">{count ?? "—"}</div>
      </div>
    </Link>
  );
}

function Dashboard() {
  const list = useServerFn(adminList);
  const heroes = useQuery({ queryKey: ["a", "hero_banners"], queryFn: () => list({ data: { table: "hero_banners" } }) });
  const mission = useQuery({ queryKey: ["a", "mission_cards"], queryFn: () => list({ data: { table: "mission_cards" } }) });
  const stats = useQuery({ queryKey: ["a", "statistics"], queryFn: () => list({ data: { table: "statistics" } }) });
  const programs = useQuery({ queryKey: ["a", "programs"], queryFn: () => list({ data: { table: "programs" } }) });
  const resources = useQuery({ queryKey: ["a", "resource_cards"], queryFn: () => list({ data: { table: "resource_cards" } }) });
  const nav = useQuery({ queryKey: ["a", "navigation_items"], queryFn: () => list({ data: { table: "navigation_items" } }) });
  const media = useQuery({ queryKey: ["a", "media_assets"], queryFn: () => list({ data: { table: "media_assets" } }) });

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-display text-3xl text-navy-deep mb-1">Dashboard</h1>
      <p className="text-sm text-charcoal/60 mb-8">Manage your ministry's website content.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card to="/admin/homepage" icon={Home} label="Hero Banners" count={heroes.data?.length} />
        <Card to="/admin/homepage" icon={BookOpen} label="Mission Cards" count={mission.data?.length} />
        <Card to="/admin/homepage" icon={Calendar} label="Statistics" count={stats.data?.length} />
        <Card to="/admin/programs" icon={Calendar} label="Programs" count={programs.data?.length} />
        <Card to="/admin/homepage" icon={BookOpen} label="Resource Cards" count={resources.data?.length} />
        <Card to="/admin/navigation" icon={Menu} label="Navigation Items" count={nav.data?.length} />
        <Card to="/admin/media" icon={ImageIcon} label="Media Assets" count={media.data?.length} />
        <Card to="/admin/users" icon={Users} label="Users" count="—" />
      </div>
    </div>
  );
}
