import { Link } from "@tanstack/react-router";
import { Play, Clock } from "lucide-react";

type Video = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  duration?: string | null;
  speaker?: string | null;
  category_id?: string | null;
};

export function FeaturedTeachings({ videos }: { videos: Video[] }) {
  if (!videos.length) return null;
  return (
    <section className="relative bg-gradient-to-b from-light via-white to-light py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold font-semibold mb-3">Watch & Be Built</p>
          <h2 className="font-display text-4xl sm:text-5xl text-navy-deep tracking-tight">
            Featured Teachings & Highlights
          </h2>
          <span className="inline-block mt-5 h-[2px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-6 max-w-2xl mx-auto text-charcoal/70 leading-relaxed">
            Watch life-transforming teachings, conference sessions, leadership trainings and ministry highlights from across the CCM movement.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {videos.map((v) => (
            <Link
              key={v.id}
              to="/videos/$slug"
              params={{ slug: v.slug }}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-1 border border-black/5 flex flex-col"
            >
              <div className="relative aspect-video bg-navy-deep overflow-hidden">
                {v.thumbnail_url ? (
                  <img src={v.thumbnail_url} alt={v.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-navy-deep to-navy" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-gold/95 text-white flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 ml-1 fill-white" />
                  </div>
                </div>
                {v.duration && (
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {v.duration}
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gold font-semibold mb-2">Teaching</p>
                <h3 className="font-display text-lg text-navy-deep leading-snug mb-2 line-clamp-2">{v.title}</h3>
                {v.description && (
                  <p className="text-sm text-charcoal/65 line-clamp-2 mb-4 leading-relaxed">{v.description}</p>
                )}
                <div className="mt-auto pt-3 border-t border-black/5 flex items-center justify-between">
                  {v.speaker && <span className="text-xs text-charcoal/60">{v.speaker}</span>}
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-deep group-hover:text-gold transition-colors">
                    Watch Now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/videos" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-navy-deep text-navy-deep text-[11px] font-bold uppercase tracking-[0.24em] hover:bg-navy-deep hover:text-white transition-all">
            Explore All Teachings
          </Link>
        </div>
      </div>
    </section>
  );
}
