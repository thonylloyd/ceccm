import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { Clock, User, Share2, ArrowLeft } from "lucide-react";
import { getVideoBySlug } from "@/lib/videos.functions";
import { siteChromeQuery } from "@/lib/cms.functions";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AccessGate } from "@/components/site/AccessGate";
import { ShareModal } from "@/components/site/ShareModal";
import { VideoComments } from "@/components/site/VideoComments";

const videoQuery = (slug: string) =>
  queryOptions({ queryKey: ["video", slug], queryFn: () => getVideoBySlug({ data: { slug } }) });

export const Route = createFileRoute("/videos/$slug")({
  loader: async ({ context, params }) => {
    const r = await context.queryClient.ensureQueryData(videoQuery(params.slug));
    if (!r.video) throw notFound();
    await context.queryClient.ensureQueryData(siteChromeQuery());
  },
  head: ({ params, loaderData }: any) => {
    const v = loaderData?.video;
    return {
      meta: [
        { title: v?.seo_title || `${v?.title ?? "Video"} — CCM` },
        { name: "description", content: v?.seo_description || v?.description || "Watch CCM ministry videos." },
        { property: "og:title", content: v?.title ?? "Video" },
        { property: "og:description", content: v?.description ?? "" },
        { property: "og:type", content: "video.other" },
        ...(v?.thumbnail_url ? [{ property: "og:image", content: v.thumbnail_url }] : []),
      ],
      links: [{ rel: "canonical", href: `https://ceccm.lovable.app/videos/${params.slug}` }],
      scripts: v ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org", "@type": "VideoObject",
          name: v.title, description: v.description, thumbnailUrl: v.thumbnail_url,
          uploadDate: v.publish_date, contentUrl: v.video_url || v.youtube_url || v.vimeo_url,
        }),
      }] : [],
    };
  },
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Video not found</div>,
  component: VideoDetail,
});

function getEmbed(v: any) {
  if (v.youtube_url) {
    const m = v.youtube_url.match(/(?:youtu\.be\/|v=)([^&?#]+)/);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  if (v.vimeo_url) {
    const m = v.vimeo_url.match(/vimeo\.com\/(\d+)/);
    if (m) return `https://player.vimeo.com/video/${m[1]}`;
  }
  return null;
}

function VideoDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(videoQuery(slug));
  const { data: chrome } = useSuspenseQuery(siteChromeQuery());
  const router = useRouter();
  const v = data.video!;
  const brand = chrome.settings.brand ?? {};
  const embed = getEmbed(v);
  const accessMode = (v.access_mode ?? "free") as any;
  const [shareOpen, setShareOpen] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://ceccm.lovable.app/videos/${v.slug}`;

  const goBack = () => {
    // Prefer history back so scrollRestoration returns the user to their card.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/videos" });
    }
  };

  const Player = (
    <div className="aspect-video bg-black overflow-hidden">
      {embed ? (
        <iframe src={embed} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      ) : v.video_url ? (
        <video src={v.video_url} poster={v.thumbnail_url ?? undefined} controls className="h-full w-full" />
      ) : v.thumbnail_url ? (
        <img src={v.thumbnail_url} alt={v.title} className="h-full w-full object-cover" />
      ) : null}
    </div>
  );

  return (
    <div className="bg-light min-h-screen">
      <SiteHeader nav={chrome.nav} brandName={brand.name ?? "CCM"} livestream={chrome.settings.livestream ?? {}} logoUrl={brand.logo_url} />
      <main className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <button onClick={goBack}
            className="mb-6 inline-flex items-center gap-2 text-sm text-charcoal/70 hover:text-navy-deep font-semibold transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Video Library
          </button>

          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            <div>
              <div className="mb-6">
                <AccessGate
                  kind="video"
                  contentKey={v.slug}
                  accessMode={accessMode}
                  price={v.price_espees}
                  thumbnail={v.thumbnail_url}
                  title={v.title}
                >
                  {Player}
                </AccessGate>
              </div>
              <h1 className="font-display text-3xl text-navy-deep mb-3">{v.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-charcoal/60 mb-5">
                {v.speaker && <span className="flex items-center gap-1"><User className="h-4 w-4" />{v.speaker}</span>}
                {v.duration && <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{v.duration}</span>}
                {v.publish_date && <span>{new Date(v.publish_date).toLocaleDateString()}</span>}
                <button onClick={() => setShareOpen(true)} className="flex items-center gap-1 hover:text-navy-deep"><Share2 className="h-4 w-4" />Share</button>
              </div>
              {v.description && <p className="text-charcoal/80 leading-relaxed whitespace-pre-line mb-6">{v.description}</p>}
              {(v.tags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(v.tags ?? []).map((t: string) => <span key={t} className="text-[11px] uppercase tracking-wider bg-white border border-black/10 px-3 py-1 rounded-full">{t}</span>)}
                </div>
              )}

              <VideoComments videoId={v.id} />
            </div>
            <aside>
              <h2 className="font-display text-lg text-navy-deep mb-4">Continue Learning</h2>
              <div className="space-y-3">
                {data.related.map((r: any) => (
                  <Link key={r.id} to="/videos/$slug" params={{ slug: r.slug }} className="flex gap-3 bg-white p-2 hover:shadow-card transition">
                    <div className="aspect-video w-32 shrink-0 bg-navy-deep overflow-hidden">
                      {r.thumbnail_url && <img src={r.thumbnail_url} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 py-1">
                      <div className="text-xs font-semibold text-navy-deep line-clamp-2">{r.title}</div>
                      {r.duration && <div className="text-[10px] text-charcoal/55 mt-1">{r.duration}</div>}
                    </div>
                  </Link>
                ))}
                {!data.related.length && <p className="text-sm text-charcoal/55">No related videos.</p>}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter brand={brand} contact={chrome.settings.contact ?? {}} footer={chrome.settings.footer ?? {}} social={chrome.settings.social ?? {}} logoUrl={brand.logo_url} />

      {shareOpen && <ShareModal url={shareUrl} title={v.title} onClose={() => setShareOpen(false)} />}
    </div>
  );
}
