import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-ccm.png.asset.json";

type NavItem = { id: string; label: string; url: string; is_external: boolean };

export function SiteHeader({
  nav,
  brandName,
  livestream,
  logoUrl,
}: {
  nav: NavItem[];
  brandName: string;
  livestream?: { url?: string; label?: string };
  logoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="bg-light/95 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logoUrl || logo.url} alt={brandName} className="h-12 w-12 object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {nav.map((item) => {
            const active = item.url === path || (item.url !== "/" && path.startsWith(item.url));
            return (
              <a
                key={item.id}
                href={item.url}
                className={`relative text-[13px] uppercase tracking-[0.18em] font-semibold transition-colors ${
                  active ? "text-navy-deep" : "text-charcoal/70 hover:text-navy-deep"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gold" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={livestream?.url || "/live"}
            className="inline-flex items-center rounded-md bg-navy-deep px-7 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-white hover:bg-navy transition-colors"
          >
            {livestream?.label || "Livestream"}
          </a>
        </div>


        <button onClick={() => setOpen((v) => !v)} className="lg:hidden text-navy-deep p-2" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-light border-t border-black/5">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {nav.map((item) => (
              <a key={item.id} href={item.url} className="text-sm uppercase tracking-[0.18em] text-navy-deep font-semibold" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href={livestream?.url || "/live"} className="mt-2 inline-flex justify-center rounded-md bg-navy-deep px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
              {livestream?.label || "Livestream"}
            </a>

          </nav>
        </div>
      )}
    </header>
  );
}
