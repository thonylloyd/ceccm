import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { homepageQuery } from "@/lib/cms.functions";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(homepageQuery());
  },
  head: () => ({
    meta: [
      { title: "Contact Us — Church Consolidation Mission" },
      { name: "description", content: "Reach Church Consolidation Mission — get in touch with our team for ministry, events, partnerships and prayer requests." },
      { property: "og:title", content: "Contact Us — CCM" },
      { property: "og:description", content: "Get in touch with Church Consolidation Mission." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://ceccm.lovable.app/contact" }],
  }),
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
  component: ContactPage,
});

function ContactPage() {
  const { data } = useSuspenseQuery(homepageQuery());
  const brand = data.settings.brand ?? {};
  const contact = data.settings.contact ?? {};
  const page = (data.settings as any).contact_page ?? {};
  const nav = data.nav.filter((n: any) => !n.parent_id);

  const email = page.email || contact.email;
  const phone = page.phone || contact.phone;
  const address = page.address || contact.address;
  const hours = page.hours;

  return (
    <div className="bg-light min-h-screen">
      <SiteHeader nav={nav} brandName={brand.name ?? "CCM"} livestream={data.settings.livestream ?? {}} logoUrl={brand.logo_url} />
      <main>
        <section className="relative bg-navy-deep text-white py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, var(--gold) 0%, transparent 40%)",
          }} />
          <div className="relative mx-auto max-w-4xl px-5 lg:px-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold font-semibold mb-3">Get in Touch</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight">{page.heading || "We'd Love to Hear From You"}</h1>
            <p className="text-white/75 max-w-2xl mx-auto mt-6 leading-relaxed">
              {page.intro || "Whether you're seeking ministry support, partnering with us, or simply asking a question — our team is here for you."}
            </p>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16">
            <aside className="space-y-6">
              <h2 className="font-display text-2xl text-navy-deep">Reach Us Directly</h2>
              <div className="space-y-4">
                {email && <InfoRow icon={<Mail />} label="Email" value={email} href={`mailto:${email}`} />}
                {phone && <InfoRow icon={<Phone />} label="Phone" value={phone} href={`tel:${phone}`} />}
                {address && <InfoRow icon={<MapPin />} label="Address" value={address} />}
                {hours && <InfoRow icon={<Clock />} label="Office Hours" value={hours} />}
              </div>
            </aside>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter
        brand={brand}
        contact={contact}
        footer={data.settings.footer ?? {}}
        social={data.settings.social ?? {}}
        logoUrl={brand.logo_url}
      />
    </div>
  );
}

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4 p-5 bg-white shadow-card hover:shadow-elegant transition-shadow border border-black/[0.04] rounded-lg">
      <span className="text-gold mt-1 shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/55 font-bold">{label}</div>
        <div className="text-navy-deep font-medium break-words whitespace-pre-line mt-1">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Frontend-only fallback: open user's mail client with prefilled content.
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} <${form.email}>`);
    const subject = encodeURIComponent(form.subject || "Contact from CCM website");
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast.success("Opening your mail client…");
    setSending(false);
  };
  return (
    <form onSubmit={submit} className="bg-white p-8 lg:p-10 shadow-card border border-black/[0.04] rounded-xl space-y-4">
      <h2 className="font-display text-2xl text-navy-deep mb-2">Send Us a Message</h2>
      <p className="text-sm text-charcoal/60 mb-4">We'll respond as soon as possible.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Your Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Input label="Email Address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
      </div>
      <Input label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
      <div>
        <label className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/55 font-bold mb-1.5">Message</label>
        <textarea
          required rows={6} value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 bg-light border border-black/10 rounded-md text-sm focus:outline-none focus:border-gold transition-colors"
        />
      </div>
      <button type="submit" disabled={sending} className="inline-flex items-center gap-2 bg-navy-deep text-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.22em] hover:bg-gold hover:text-navy-deep transition-colors disabled:opacity-50">
        <Send className="h-3.5 w-3.5" /> Send Message
      </button>
    </form>
  );
}

function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/55 font-bold mb-1.5">{label}</label>
      <input
        type={type} value={value} required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-light border border-black/10 rounded-md text-sm focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
