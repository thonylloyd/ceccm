import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Radio } from "lucide-react";
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
  livestream?: {
    url?: string;
    label?: string;
    visible?: boolean;
    background_color?: string;
    text_color?: string;
    show_pulse?: boolean;
    open_new_tab?: boolean;
  };
  logoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showLive = livestream?.visible !== false;
  const liveLabel = livestream?.label || "Watch Live";
  const liveUrl = livestream?.url || "/live";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-black/5 shadow-[0_2px_18px_-12px_rgba(4,30,74,0.25)]"
          : "bg-light/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logoUrl || logo.url} alt={brandName} className="h-12 w-12 object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
          {nav.map((item) => {
            const active = item.url === path || (item.url !== "/" && path.startsWith(item.url));
            return (
              <a
                key={item.id}
                href={item.url}
                className={`relative text-[12px] uppercase tracking-[0.22em] font-semibold transition-colors py-2 ${
                  active ? "text-navy-deep" : "text-charcoal/75 hover:text-navy-deep"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-gold to-gold-soft transition-all duration-300 ${
                    active ? "w-8" : "w-0 group-hover:w-6"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {showLive && (
            <a
              href={liveUrl}
              target={livestream?.open_new_tab ? "_blank" : undefined}
              rel={livestream?.open_new_tab ? "noopener" : undefined}
              className="group relative inline-flex items-center gap-2.5 rounded-sm px-7 py-3 text-[11px] font-bold uppercase tracking-[0.22em] overflow-hidden shadow-gold transition-transform hover:-translate-y-0.5"
              style={{
                background: livestream?.background_color
                  ? livestream.background_color
                  : "linear-gradient(135deg, oklch(0.78 0.11 78) 0%, oklch(0.66 0.13 75) 50%, oklch(0.55 0.13 73) 100%)",
                color: livestream?.text_color || "#0a1733",
              }}
            >
              {livestream?.show_pulse !== false && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping" />
                  <span className="relative h-2 w-2 rounded-full bg-red-600" />
                </span>
              )}
              <Radio className="h-3.5 w-3.5" />
              <span className="relative z-10">{liveLabel}</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-25 transition-opacity" />
            </a>
          )}
        </div>

        <button onClick={() => setOpen((v) => !v)} className="lg:hidden text-navy-deep p-2" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-black/5">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {nav.map((item) => (
              <a key={item.id} href={item.url} className="text-sm uppercase tracking-[0.18em] text-navy-deep font-semibold" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            {showLive && (
              <a
                href={liveUrl}
                className="mt-2 inline-flex justify-center items-center gap-2 rounded-sm px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-navy-deep shadow-gold"
                style={{ background: "linear-gradient(135deg, oklch(0.78 0.11 78), oklch(0.66 0.13 75))" }}
              >
                <Radio className="h-3.5 w-3.5" /> {liveLabel}
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
