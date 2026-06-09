import logo from "@/assets/logo-ccm.png.asset.json";
import { Phone, Globe, Mail } from "lucide-react";

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
          { label: "Contact Us", url: "/contact" },
          { label: "Privacy Policy", url: "/privacy" },
          { label: "Terms of Service", url: "/terms" },
        ];

  return (
    <footer className="bg-navy-deep text-white/80 pt-16 pb-6">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        <div>
          <h4 className="text-gold text-xs uppercase tracking-[0.24em] font-bold mb-5">Support</h4>
          <ul className="space-y-2 text-sm">
            {supportLinks.map((l, i) => (
              <li key={i}>
                <a href={l.url} className="text-white/65 hover:text-gold transition-colors">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <img src={logoUrl || logo.url} alt={brand.name} className="h-20 w-20 mx-auto object-contain" />
          <div className="mt-3 text-sm font-display text-white/90">{brand.name ?? "Church Consolidation Mission"}</div>
        </div>

        <div className="md:text-right">
          <h4 className="text-gold text-xs uppercase tracking-[0.24em] font-bold mb-5">Connect With Us</h4>
          <div className="flex md:justify-end gap-3">
            {social.phone && (
              <a href={social.phone} aria-label="Phone" className="h-9 w-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center">
                <Phone className="h-4 w-4" />
              </a>
            )}
            {social.website && (
              <a href={social.website} aria-label="Website" className="h-9 w-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center">
                <Globe className="h-4 w-4" />
              </a>
            )}
            {(social.email || contact.email) && (
              <a href={social.email || `mailto:${contact.email}`} aria-label="Email" className="h-9 w-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center">
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 lg:px-8 mt-12 pt-6 border-t border-white/10 text-center text-[11px] text-white/50">
        {footer.copyright ?? `© ${new Date().getFullYear()} Church Consolidation Mission. All rights reserved.`}
      </div>
    </footer>
  );
}
