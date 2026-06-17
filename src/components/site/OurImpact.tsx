import { CheckCircle2 } from "lucide-react";
import programSummit from "@/assets/program-summit.jpg";
import hero from "@/assets/hero-cathedral.jpg";
import library from "@/assets/resource-library.jpg";
import pastor from "@/assets/resource-pastor-live.jpg";

type Block = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  bullets: string[];
};

const DEFAULTS: Block[] = [
  {
    eyebrow: "Conferences & Training",
    title: "Equipping the Saints Through Conferences",
    body:
      "We host transformative conferences and training programs that deepen biblical understanding, build effective ministers and ignite renewed passion for the gospel.",
    image: hero,
    bullets: ["Annual ministry summits", "Specialized training tracks", "Hands-on equipping workshops"],
  },
  {
    eyebrow: "Leadership Development",
    title: "Raising a Generation of Effective Leaders",
    body:
      "Our leadership pathways form pastors, ministers and lay leaders into Christ-shaped stewards committed to the work of the ministry across nations.",
    image: pastor,
    bullets: ["Mentorship & coaching", "Pastoral capacity building", "Next-generation leaders"],
  },
  {
    eyebrow: "Church Strengthening",
    title: "Consolidating the Local Church",
    body:
      "We come alongside congregations with resources, systems and ministry support that strengthen worship life, discipleship and Kingdom impact.",
    image: programSummit,
    bullets: ["Discipleship frameworks", "Worship & music support", "Operational excellence"],
  },
  {
    eyebrow: "Zone Visitation & Evaluation",
    title: "Walking With Churches in Every Zone",
    body:
      "Through regular zone visitation and evaluation, we ensure spiritual health, accountability and continuous growth across every region we serve.",
    image: library,
    bullets: ["Pastoral visits & audits", "Health checks & feedback", "Tailored growth plans"],
  },
];

export function OurImpact({
  blocks = DEFAULTS,
  eyebrow = "Our Impact",
  heading = "Perfecting the Saints for the Work of the Ministry",
}: {
  blocks?: Block[];
  eyebrow?: string;
  heading?: string;
}) {
  return (
    <section className="relative bg-white py-24 lg:py-32 overflow-hidden">
      {/* faint watermark */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle at 20% 10%, var(--navy) 0%, transparent 40%), radial-gradient(circle at 80% 90%, var(--gold) 0%, transparent 35%)",
      }} />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold font-semibold mb-3">{eyebrow}</p>
          <h2 className="font-display text-4xl sm:text-5xl text-navy-deep tracking-tight">
            {heading}
          </h2>
          <span className="inline-block mt-5 h-[2px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        <div className="space-y-24 lg:space-y-32">
          {blocks.map((b, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={i}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}
              >
                <div className="relative group [direction:ltr]">
                  <div className="absolute -inset-4 bg-gradient-to-br from-gold/20 to-navy-deep/10 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity rounded-3xl" />
                  <div className="relative overflow-hidden rounded-2xl shadow-elegant aspect-[4/3]">
                    <img src={b.image} alt={b.title} className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-navy-deep/40 via-transparent to-transparent" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 lg:-left-6 bg-gold text-white px-5 py-3 text-[10px] uppercase tracking-[0.24em] font-bold shadow-gold rounded">
                    {String(i + 1).padStart(2, "0")} / 04
                  </div>
                </div>

                <div className="[direction:ltr]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-gold font-semibold mb-3">{b.eyebrow}</p>
                  <h3 className="font-display text-3xl sm:text-4xl text-navy-deep leading-tight mb-5">{b.title}</h3>
                  <span className="inline-block h-[2px] w-10 bg-gold mb-6" />
                  <p className="text-charcoal/75 leading-relaxed mb-6">{b.body}</p>
                  <ul className="space-y-3">
                    {b.bullets.map((bu, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-charcoal/80">
                        <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                        <span>{bu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
