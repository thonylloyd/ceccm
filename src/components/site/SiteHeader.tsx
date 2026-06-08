import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-ccm.png.asset.json";

type NavItem = { id: string; label: string; url: string; is_external: boolean };

export function SiteHeader({ nav, brandName }: { nav: NavItem[]; brandName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-navy/85 backdrop-blur-md border-b border-gold/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo.url}
            alt={brandName}
            className="h-12 w-12 object-contain drop-shadow-[0_0_12px_rgba(184,138,27,0.35)]"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-lg text-gold tracking-wide">CCM</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/70">
              Church Consolidation Mission
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {nav.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className="text-sm uppercase tracking-[0.14em] text-white/85 hover:text-gold transition-colors relative after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-0 hover:after:w-full after:bg-gold after:transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/auth"
            className="text-sm uppercase tracking-[0.14em] text-white/85 hover:text-gold transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-gold to-gold-soft px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-navy shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-shadow"
          >
            Join CCM
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-navy-deep border-t border-gold/20">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {nav.map((item) => (
              <a key={item.id} href={item.url} className="text-sm uppercase tracking-[0.14em] text-white/85" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <Link to="/auth" className="text-sm uppercase tracking-[0.14em] text-gold" onClick={() => setOpen(false)}>
              Sign In / Join
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
