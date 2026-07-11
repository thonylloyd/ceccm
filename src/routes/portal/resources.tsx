import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listResources, logResourceView } from "@/lib/resources.functions";
import { usePortalSession } from "./portal-context";
import {
  FileText, Video, Link as LinkIcon, GraduationCap,
  Search, Filter, ExternalLink, Download, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/portal/resources")({
  component: ResourceCenter,
});

const TYPE_ICONS: Record<string, any> = {
  document: FileText,
  video: Video,
  link: LinkIcon,
  course: GraduationCap,
};

function ResourceCenter() {
  const s = usePortalSession();
  const listFn = useServerFn(listResources);
  const logFn = useServerFn(logResourceView);
  const q = useQuery({
    queryKey: ["portal-resources"],
    queryFn: () => listFn({ data: { publishedOnly: !s.isAdmin && !s.isSiteMaintenance } }),
  });
  const logView = useMutation({ mutationFn: (id: string) => logFn({ data: { id } }) });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    (q.data ?? []).forEach((r: any) => set.add(r.category));
    return Array.from(set).sort();
  }, [q.data]);

  const filtered = (q.data ?? []).filter((r: any) => {
    if (search && !`${r.title} ${r.description ?? ""} ${r.tags?.join(" ") ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && r.category !== category) return false;
    if (type && r.resource_type !== type) return false;
    return true;
  });

  const openResource = (r: any) => {
    const url = r.external_url || r.file_url;
    if (!url) return;
    logView.mutate(r.id);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50">Portal</div>
        <h1 className="font-display text-3xl text-navy-deep">Resource Center</h1>
        <p className="text-sm text-charcoal/70 mt-2 max-w-2xl">
          Training materials, study guides, videos, and courses to equip you for the mission.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-black/5 shadow-elegant p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources…"
            className="w-full pl-9 pr-3 py-2 border border-black/10 rounded-md text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-black/10 rounded-md text-sm bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 border border-black/10 rounded-md text-sm bg-white"
        >
          <option value="">All Types</option>
          <option value="document">Documents</option>
          <option value="video">Videos</option>
          <option value="link">Links</option>
          <option value="course">Courses</option>
        </select>
      </div>

      {q.isLoading ? (
        <div className="flex items-center justify-center py-16 text-charcoal/60">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-black/10 rounded-lg p-12 text-center text-charcoal/60">
          <Filter className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No resources match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r: any) => {
            const Icon = TYPE_ICONS[r.resource_type] ?? FileText;
            return (
              <button
                key={r.id}
                onClick={() => openResource(r)}
                className="text-left bg-white rounded-lg border border-black/5 shadow-elegant overflow-hidden hover:border-gold/40 hover:shadow-lg transition-all group flex flex-col"
              >
                {r.thumbnail_url ? (
                  <div className="aspect-video bg-navy-deep/5 overflow-hidden">
                    <img src={r.thumbnail_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-navy-deep to-navy-deep/80 flex items-center justify-center">
                    <Icon className="h-10 w-10 text-gold/70" />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-gold font-semibold">{r.category}</span>
                    {!r.is_published && (
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-charcoal/10 text-charcoal/70">Draft</span>
                    )}
                  </div>
                  <h3 className="font-display text-base text-navy-deep line-clamp-2">{r.title}</h3>
                  {r.description && (
                    <p className="text-xs text-charcoal/60 mt-2 line-clamp-3 flex-1">{r.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5">
                    <span className="text-[11px] text-charcoal/50 capitalize">{r.resource_type}</span>
                    <span className="text-gold text-sm inline-flex items-center gap-1">
                      {r.external_url ? <ExternalLink className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                      Open
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
