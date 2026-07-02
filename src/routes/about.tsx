import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { aboutQuery } from "@/lib/about.functions";
import { siteChromeQuery } from "@/lib/cms.functions";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Icon } from "@/components/site/Icon";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(aboutQuery()),
      context.queryClient.ensureQueryData(siteChromeQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "About Church Consolidation Mission — Strengthening the Body of Christ" },
      { name: "description", content: "Church Consolidation Mission (CCM) is a Department of the Loveworld Nation established to make every member effective and relevant in the Church." },
      { property: "og:title", content: "About Church Consolidation Mission" },
      { property: "og:description", content: "Strengthening churches, raising leaders, and equipping believers worldwide." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ceccm.lovable.app/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ceccm.lovable.app/about" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Church Consolidation Mission",
        url: "https://ceccm.lovable.app",
        description: "A Department of the Loveworld Nation strengthening churches worldwide.",
      }),
    }],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <p className="text-sm text-charcoal/70">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => <div>Not found</div>,
  component: AboutPage,
});

const DEFAULTS = {
  hero: {
    eyebrow: "About Us",
    title: "About Church Consolidation Mission",
    subtitle: "A Department of the Loveworld Nation — strengthening churches, raising leaders, and equipping every member for impactful service.",
    background_url: "",
  },
  who: {
    title: "Who We Are",
    body_1: "Church Consolidation Mission (CCM) is a Department of the Loveworld Nation, established by the President of Loveworld, Pastor Chris Oyakhilome D.Sc D.Sc D.D, to make every individual member a relevant and effective part of the Church, thereby making the Church more effective in fulfilling its divine mandate.",
    body_2: "The mission is designed to strengthen churches and zones around the world through conferences, training programs, strategic evaluation, and spiritual empowerment, ensuring that believers remain productive, committed, and impactful members of the Body of Christ as we await the soon return of our Lord and Saviour Jesus Christ.",
    image_url: "",
  },
  mission_intro: {
    title: "Our Mission",
    intro: "Church Consolidation Mission exists to strengthen churches and empower believers to become effective, committed, and relevant members of the Body of Christ.",
  },
  purpose: {
    title: "Why We Exist",
    items: [
      { icon: "users", text: "To translate 100% of members into effective members of the Church." },
      { icon: "book", text: "To help the brethren understand what it truly means to be members of the Church." },
      { icon: "compass", text: "To increase understanding and commitment to the vision." },
      { icon: "hand", text: "To help believers understand their relevance and responsibility in the house of God." },
    ],
  },
  cta: {
    title: "Join Us Today",
    description: "Get Access to Premium Resources for your Growth and Effectiveness",
    primary_label: "View Programs",
    primary_url: "/#programs",
    secondary_label: "Contact Us",
    secondary_url: "/contact",
  },
};

const MISSION_CARDS = [
  { icon: "church", title: "Church Consolidation", body: "Strengthening churches and zones by helping every member become an effective and relevant part of the Body of Christ. Member Effectiveness." },
  { icon: "compass", title: "Vision Alignment", body: "Helping members understand the Vision of the Ministry and increasing their commitment to our Divine Mandate." },
  { icon: "graduation-cap", title: "Leadership Development", body: "Equipping the Brethren with the knowledge, training, and spiritual understanding required to function effectively in the House of God." },
  { icon: "users", title: "Church Retention & Growth", body: "Helping churches identify challenges, close back doors, retain members, and build thriving congregations." },
];

function AboutPage() {
  const { data } = useSuspenseQuery(aboutQuery());
  const { data: chrome } = useSuspenseQuery(siteChromeQuery());
  const hero = { ...DEFAULTS.hero, ...(data.settings.about_hero ?? {}) };
  const who = { ...DEFAULTS.who, ...(data.settings.about_who ?? {}) };
  const mIntro = { ...DEFAULTS.mission_intro, ...(data.settings.about_mission_intro ?? {}) };
  const purpose = { ...DEFAULTS.purpose, ...(data.settings.about_purpose ?? {}) };
  const cta = { ...DEFAULTS.cta, ...(data.settings.about_cta ?? {}) };
  const brand = chrome.settings.brand ?? {};
  const nav = chrome.nav.filter((n: any) => !n.parent_id);

  const leadership = data.leadership;

  return (
    <div className="bg-light min-h-screen">
      <SiteHeader nav={nav} brandName={brand.name ?? "CCM"} livestream={chrome.settings.livestream ?? {}} logoUrl={brand.logo_url} />
      <main>
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[440px] overflow-hidden">
          {hero.background_url && <img src={hero.background_url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/90 via-navy-deep/80 to-black/80" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 h-full flex items-center">
            <div className="max-w-3xl text-white animate-fade-in">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold mb-5">
                <Sparkles className="h-3.5 w-3.5" /> {hero.eyebrow}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
                {hero.title}
              </h1>
              <p className="text-white/80 text-base lg:text-lg leading-relaxed max-w-2xl">
                {hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/5] bg-navy-deep overflow-hidden ring-1 ring-gold/30">
              {who.image_url ? (
                <img src={who.image_url} alt="Pastor Chris Oyakhilome" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white/40 text-sm">Add a portrait of Pastor Chris in the Admin → About panel</div>
              )}
            </div>
            <div>
              <h2 className="font-display text-3xl text-navy-deep mb-3">{who.title}</h2>
              <span className="inline-block h-0.5 w-12 bg-gold mb-6" />
              <p className="text-charcoal/80 leading-relaxed mb-5">{who.body_1}</p>
              <p className="text-charcoal/80 leading-relaxed">{who.body_2}</p>
            </div>
          </div>
        </section>

        {/* Leadership */}
        {leadership.length > 0 && (
          <section className="py-20 lg:py-24 bg-light">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="text-center mb-14">
                <h2 className="font-display text-3xl text-navy-deep uppercase tracking-[0.18em] font-semibold">Leadership</h2>
                <span className="inline-block mt-3 h-0.5 w-12 bg-gold" />
              </div>
              <div className="mx-auto max-w-5xl space-y-6">
                {leadership.slice(0, 3).map((l: any, i: number) => (
                  <article
                    key={l.id}
                    className={`relative overflow-hidden bg-white border border-gold/35 p-6 sm:p-7 shadow-card transition-transform hover:-translate-y-1 ${
                      l.is_featured || i === 1 ? "border-gold" : ""
                    }`}
                  >
                    <span className="absolute inset-x-0 top-0 h-1 bg-gold" />
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
                      <div className="aspect-square w-36 shrink-0 rounded-full bg-navy-deep overflow-hidden ring-2 ring-gold/40 shadow-lg">
                        {l.photo_url && <img src={l.photo_url} alt={l.name} className="h-full w-full object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gold/25 pb-4 mb-4">
                          <div>
                            <h3 className="font-display text-2xl text-navy-deep">{l.name}</h3>
                            {l.position && <div className="text-xs uppercase tracking-[0.18em] text-gold mt-1">{l.position}</div>}
                          </div>
                          {(l.is_featured || i === 1) && (
                            <span className="self-center sm:self-start inline-flex bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-deep">
                              Leadership
                            </span>
                          )}
                        </div>
                        {l.message && <p className="text-sm sm:text-base text-charcoal/75 leading-relaxed italic">&quot;{l.message}&quot;</p>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Our Mission */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 className="font-display text-3xl text-navy-deep uppercase tracking-[0.18em] font-semibold">{mIntro.title}</h2>
              <span className="inline-block mt-3 h-0.5 w-12 bg-gold" />
              <p className="mt-6 text-charcoal/75 leading-relaxed">{mIntro.intro}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MISSION_CARDS.map((c) => (
                <article key={c.title} className="bg-light border border-gold/40 p-7 hover:shadow-card transition-shadow">
                  <div className="h-11 w-11 rounded-full bg-gold/15 flex items-center justify-center mb-5">
                    <Icon name={c.icon} className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="font-display text-lg text-navy-deep mb-3">{c.title}</h3>
                  <p className="text-sm text-charcoal/70 leading-relaxed">{c.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why We Exist */}
        <section className="py-20 lg:py-24 bg-navy-deep text-white">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl uppercase tracking-[0.18em] font-semibold">{purpose.title}</h2>
              <span className="inline-block mt-3 h-0.5 w-12 bg-gold" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(purpose.items ?? []).map((it: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 p-7 hover:bg-white/10 transition-colors">
                  <div className="h-11 w-11 rounded-full bg-gold/20 flex items-center justify-center mb-5">
                    <Icon name={it.icon || "sparkles"} className="h-5 w-5 text-gold" />
                  </div>
                  <p className="text-sm text-white/85 leading-relaxed">{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 lg:py-24 bg-gradient-to-br from-gold/15 via-light to-light">
          <div className="mx-auto max-w-4xl px-5 lg:px-8 text-center">
            <h2 className="font-display text-4xl text-navy-deep mb-4">{cta.title}</h2>
            <p className="text-charcoal/75 text-lg mb-8 max-w-xl mx-auto">{cta.description}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={cta.primary_url} className="inline-flex items-center gap-2 bg-navy-deep text-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] hover:bg-gold transition-colors">
                {cta.primary_label} <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={cta.secondary_url} className="inline-flex items-center gap-2 border border-navy-deep text-navy-deep px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] hover:bg-navy-deep hover:text-white transition-colors">
                {cta.secondary_label}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter brand={brand} contact={chrome.settings.contact ?? {}} footer={chrome.settings.footer ?? {}} social={chrome.settings.social ?? {}} logoUrl={brand.logo_url} />
    </div>
  );
}
