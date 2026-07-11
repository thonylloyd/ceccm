import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { homepageQuery } from "@/lib/cms.functions";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Hero } from "@/components/site/Hero";
import { MissionSection } from "@/components/site/MissionSection";
import { OurImpact } from "@/components/site/OurImpact";
import { ProgramsSection } from "@/components/site/ProgramsSection";
import { FeaturedTeachings } from "@/components/site/FeaturedTeachings";
import { PraiseReports } from "@/components/site/PraiseReports";
import { ResourcesSection } from "@/components/site/ResourcesSection";
import { EquipCTA } from "@/components/site/EquipCTA";
import { Reveal } from "@/components/site/Reveal";

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
    <div className="min-h-screen flex items-center justify-center bg-light p-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-navy-deep mb-2">Something went wrong</h1>
        <p className="text-charcoal/70 text-sm">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => <div>Not found</div>,
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(homepageQuery());
  const brand = data.settings.brand ?? {};
  const contact = data.settings.contact ?? {};
  const footer = data.settings.footer ?? {};
  const social = data.settings.social ?? {};
  const livestream = data.settings.livestream ?? {};
  const homepage = data.settings.homepage ?? {};
  const homepageMission = data.settings.homepage_mission ?? {};
  const nav = data.nav.filter((n: any) => !n.parent_id);

  return (
    <div className="bg-light min-h-screen">
      <SiteHeader
        nav={nav}
        brandName={brand.name ?? "Church Consolidation Mission"}
        livestream={livestream}
        logoUrl={brand.logo_url}
      />
      <main>
        <Hero banners={data.heroes} />
        <Reveal>
          <MissionSection
            cards={data.mission}
            title={homepageMission.title ?? homepage.mission_title ?? "Our Mission"}
            subtitle={homepageMission.subtitle ?? "Discover what drives us — the convictions and callings that shape every program, gathering and resource we build."}
            statement={homepageMission.statement ?? "Church Consolidation Mission exists to help every member become an effective and relevant part of the Church, strengthening and equipping the brethren for impactful service in the race for the last lost soul."}
          />
        </Reveal>
        <Reveal delay={80}>
          <OurImpact
            eyebrow={(data.settings.homepage_impact as any)?.eyebrow}
            heading={(data.settings.homepage_impact as any)?.heading}
            blocks={((data.settings.homepage_impact as any)?.blocks?.length ? (data.settings.homepage_impact as any).blocks : undefined)}
          />
        </Reveal>
        <Reveal>
          <ProgramsSection programs={data.programs} intro={homepage.programs_intro ?? "Join our global initiatives and transform lives."} />
        </Reveal>
        <Reveal delay={60}>
          <FeaturedTeachings videos={(data as any).featuredVideos ?? []} />
        </Reveal>
        <Reveal>
          <PraiseReports reports={(data as any).praise ?? []} title={homepage.praise_title ?? "Praise Reports"} intro={homepage.praise_intro} />
        </Reveal>
        <Reveal delay={60}>
          <ResourcesSection cards={data.resources} />
        </Reveal>
        <Reveal>
          <EquipCTA />
        </Reveal>
      </main>
      <SiteFooter
        brand={brand}
        contact={contact}
        footer={footer}
        social={social}
        logoUrl={brand.logo_url}
      />
    </div>
  );
}
