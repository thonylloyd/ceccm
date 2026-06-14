import logo from "@/assets/logo-ccm.png.asset.json";
import { Phone, Globe, Mail, MapPin } from "lucide-react";

export function SiteFooter({
  brand,
  contact,
  footer,
  social,
  logoUrl,
}: {
  brand: { name?: string; tagline?: string };
  contact: { email?: string; phone?: string; address?: string };
  footer: { copyright?: string; support_links?: { label: string; url: string }[] };
  social: { email?: string; phone?: string; kingschat?: string; website?: string };
  logoUrl?: string | null;
}) {
  const supportLinks =
    footer.support_links && footer.support_links.length
      ? footer.support_links
      : [
          { label: "About", url: "/about" },
          { label: "Programs", url: "/programs" },
          { label: "Videos", url: "/videos" },
          { label: "Contact Us", url: "/contact" },
        ];

  return (
    <footer className="relative bg-navy-deep text-white/80 pt-20 pb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, var(--gold) 0%, transparent 50%)",
      }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-5">
            <img src={logoUrl || logo.url} alt={brand.name} className="h-14 w-14 object-contain" />
            <div>
              <div className="font-display text-white text-base leading-tight">{brand.name ?? "Church Consolidation Mission"}</div>
              {brand.tagline && <div className="text-xs text-white/55 mt-1">{brand.tagline}</div>}
            </div>
          </div>
          <p className="text-sm text-white/65 leading-relaxed max-w-sm">
            Consolidating the Body of Christ — perfecting the saints for the work of the ministry across the nations.
          </p>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-gold text-[11px] uppercase tracking-[0.28em] font-bold mb-5">Explore</h4>
          <ul className="space-y-3 text-sm">
            {supportLinks.map((l, i) => (
              <li key={i}>
                <a href={l.url} className="text-white/65 hover:text-gold transition-colors inline-flex items-center gap-2 group">
                  <span className="h-px w-3 bg-gold/40 group-hover:w-5 transition-all" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <h4 className="text-gold text-[11px] uppercase tracking-[0.28em] font-bold mb-5">Connect With Us</h4>
          <ul className="space-y-2.5 text-sm mb-6">
            {contact.email && (
              <li className="flex items-center gap-3 text-white/70"><Mail className="h-4 w-4 text-gold" /> <a href={`mailto:${contact.email}`} className="hover:text-gold">{contact.email}</a></li>
            )}
            {contact.phone && (
              <li className="flex items-center gap-3 text-white/70"><Phone className="h-4 w-4 text-gold" /> <a href={`tel:${contact.phone}`} className="hover:text-gold">{contact.phone}</a></li>
            )}
            {contact.address && (
              <li className="flex items-start gap-3 text-white/70"><MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" /> <span>{contact.address}</span></li>
            )}
          </ul>
          <div className="flex gap-3">
            {social.phone && (
              <a href={social.phone} aria-label="Phone" className="h-10 w-10 rounded-full bg-white/8 hover:bg-gold border border-white/10 hover:border-gold flex items-center justify-center transition-all hover:-translate-y-0.5">
                <Phone className="h-4 w-4" />
              </a>
            )}
            {social.website && (
              <a href={social.website} aria-label="Website" className="h-10 w-10 rounded-full bg-white/8 hover:bg-gold border border-white/10 hover:border-gold flex items-center justify-center transition-all hover:-translate-y-0.5">
                <Globe className="h-4 w-4" />
              </a>
            )}
            {(social.email || contact.email) && (
              <a href={social.email || `mailto:${contact.email}`} aria-label="Email" className="h-10 w-10 rounded-full bg-white/8 hover:bg-gold border border-white/10 hover:border-gold flex items-center justify-center transition-all hover:-translate-y-0.5">
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 mt-14 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/45">
        <span>{footer.copyright ?? `© ${new Date().getFullYear()} Church Consolidation Mission. All rights reserved.`}</span>
        <span className="uppercase tracking-[0.32em] text-gold/80 text-[10px]">Consolidating the Body of Christ</span>
      </div>
    </footer>
  );
}
