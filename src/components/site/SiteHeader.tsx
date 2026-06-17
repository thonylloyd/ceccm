import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Radio } from "lucide-react";
import logo from "@/assets/logo-ccm.png.asset.json";
import { UserMenu } from "@/components/site/UserMenu";

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
  const isHome = path === "/";

  useEffect(() => {
    const onScroll = () => {
      // On the homepage, treat "scrolled past hero" (~ viewport height * 0.7).
      const threshold = isHome ? Math.max(window.innerHeight * 0.7, 400) : 8;
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const showLive = livestream?.visible !== false;
  const liveLabel = livestream?.label || "Watch Live";
  const liveUrl = livestream?.url || "/live";

  // Show 3-line brand title in nav: always on non-home pages, on home only after scroll past hero.
  const showBrandTitle = !isHome || scrolled;

  const brandTitle = (
    <div className="font-display leading-[1.05] text-navy-deep uppercase tracking-[0.18em]">
      <div className="text-[10px] sm:text-[11px] font-bold">Church</div>
      <div className="text-[10px] sm:text-[11px] font-bold">Consolidation</div>
      <div className="text-[10px] sm:text-[11px] font-bold text-gold">Mission</div>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-md border-b border-black/5 shadow-[0_2px_18px_-12px_rgba(4,30,74,0.25)]"
          : "bg-light/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8 flex items-center justify-between h-20 gap-3">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 min-w-0">
          <img src={logoUrl || logo.url} alt={brandName} className="h-11 w-11 sm:h-12 sm:w-12 object-contain shrink-0" />
          <div className={`transition-all duration-300 ${showBrandTitle ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0 overflow-hidden"}`}>
            {brandTitle}
          </div>
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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {showLive && (
            <a
              href={liveUrl}
              target={livestream?.open_new_tab ? "_blank" : undefined}
              rel={livestream?.open_new_tab ? "noopener" : undefined}
              className="group relative inline-flex items-center gap-1.5 sm:gap-2.5 rounded-sm px-3 sm:px-7 py-2 sm:py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] overflow-hidden shadow-gold transition-transform hover:-translate-y-0.5"
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
              <span className="relative z-10 hidden xs:inline sm:inline">{liveLabel}</span>
              <span className="relative z-10 xs:hidden sm:hidden">Live</span>
            </a>
          )}

          <div className="hidden lg:block">
            <UserMenu variant="desktop" />
          </div>

          <button onClick={() => setOpen((v) => !v)} className="lg:hidden text-navy-deep p-2" aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-black/5">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {nav.map((item) => (
              <a key={item.id} href={item.url} className="text-sm uppercase tracking-[0.18em] text-navy-deep font-semibold" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <UserMenu variant="mobile" />
          </nav>
        </div>
      )}
    </header>
  );
}
