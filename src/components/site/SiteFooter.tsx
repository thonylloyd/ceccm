import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-ccm.png.asset.json";
import { Mail, Phone, MessageCircle } from "lucide-react";

type NavItem = { id: string; label: string; url: string };

export function SiteFooter({
  nav,
  brand,
  contact,
  footer,
  social,
}: {
  nav: NavItem[];
  brand: { name?: string; tagline?: string };
  contact: { email?: string; phone?: string; address?: string };
  footer: { copyright?: string };
  social: { email?: string; phone?: string; kingschat?: string };
}) {
  return (
    <footer className="bg-navy-deep text-white/80 border-t border-gold/20 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <img src={logo.url} alt={brand.name} className="h-14 w-14 object-contain" />
            <div>
              <div className="font-display text-2xl text-gold">CCM</div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                {brand.name ?? "Church Consolidation Mission"}
              </div>
            </div>
          </div>
          <p className="text-sm max-w-md text-white/65 leading-relaxed">
            {brand.tagline ?? "Consolidating the Body of Christ — strengthening churches, raising leaders, transforming nations."}
          </p>
          <div className="flex items-center gap-4 pt-2">
            {social.email && (
              <a href={social.email} className="h-10 w-10 rounded-full bg-white/5 hover:bg-gold hover:text-navy flex items-center justify-center transition-colors" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            )}
            {social.phone && (
              <a href={social.phone} className="h-10 w-10 rounded-full bg-white/5 hover:bg-gold hover:text-navy flex items-center justify-center transition-colors" aria-label="Phone">
                <Phone className="h-4 w-4" />
              </a>
            )}
            {social.kingschat && (
              <a href={social.kingschat} className="h-10 w-10 rounded-full bg-white/5 hover:bg-gold hover:text-navy flex items-center justify-center transition-colors" aria-label="KingsChat">
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-display text-gold text-lg mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={n.url} className="text-white/70 hover:text-gold transition-colors">{n.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-gold text-lg mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {contact.email && <li><a href={`mailto:${contact.email}`} className="hover:text-gold">{contact.email}</a></li>}
            {contact.phone && <li>{contact.phone}</li>}
            {contact.address && <li>{contact.address}</li>}
            <li className="pt-3">
              <Link to="/auth" className="inline-flex items-center rounded-full border border-gold/40 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gold hover:bg-gold hover:text-navy transition-colors">
                Member Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
        <div>{footer.copyright ?? "© 2026 Church Consolidation Mission. All rights reserved."}</div>
        <div className="uppercase tracking-[0.18em]">Established to consolidate the Body of Christ</div>
      </div>
    </footer>
  );
}
