import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { homepageQuery } from "@/lib/cms.functions";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Hero } from "@/components/site/Hero";
import { MissionSection } from "@/components/site/MissionSection";
import { StatsSection } from "@/components/site/StatsSection";
import { ProgramsSection } from "@/components/site/ProgramsSection";
import { ResourcesSection } from "@/components/site/ResourcesSection";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(homepageQuery());
  },
  head: () => ({
    meta: [
      { title: "Church Consolidation Mission — Consolidating the Body of Christ" },
      { name: "description", content: "CCM is a global Christian ministry strengthening churches, raising leaders, and impacting communities through the gospel of Jesus Christ." },
      { property: "og:title", content: "Church Consolidation Mission" },
      { property: "og:description", content: "Consolidating the Body of Christ — a global ministry strengthening churches, developing leaders, and impacting communities." },
      { property: "og:type", content: "website" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep text-white p-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-gold mb-2">Something went wrong</h1>
        <p className="text-white/70 text-sm">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => <div>Not found</div>,
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(homepageQuery());
  const banner = data.heroes[0];
  const brand = data.settings.brand ?? {};
  const contact = data.settings.contact ?? {};
  const footer = data.settings.footer ?? {};
  const social = data.settings.social ?? {};
  const nav = data.nav.filter((n) => !n.parent_id);

  return (
    <div className="bg-navy-deep min-h-screen">
      <SiteHeader nav={nav} brandName={brand.name ?? "Church Consolidation Mission"} />
      <main>
        {banner && <Hero banner={banner} />}
        <MissionSection cards={data.mission} />
        <StatsSection stats={data.stats} />
        <ProgramsSection programs={data.programs} />
        <ResourcesSection cards={data.resources} />
      </main>
      <SiteFooter nav={nav} brand={brand} contact={contact} footer={footer} social={social} />
    </div>
  );
}
