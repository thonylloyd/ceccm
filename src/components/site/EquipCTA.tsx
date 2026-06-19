import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Handshake } from "lucide-react";



export function EquipCTA() {
  const navigate = useNavigate();
  const openPartner = () =>
    navigate({ to: ".", search: (prev: any) => ({ ...prev, partner: "1" }) as any });

  return (
    <section className="relative overflow-hidden bg-navy-deep text-white py-24 lg:py-32">
      {/* layered backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-deep via-navy to-[#020b1f]" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(ellipse at 25% 30%, oklch(0.66 0.13 75 / 0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, oklch(0.66 0.13 75 / 0.2) 0%, transparent 55%)",
      }} />
      {/* geometric grid */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      {/* gold corner accents */}
      <div className="absolute top-10 left-10 h-20 w-20 border-l-2 border-t-2 border-gold/40" />
      <div className="absolute bottom-10 right-10 h-20 w-20 border-r-2 border-b-2 border-gold/40" />

      <div className="relative mx-auto max-w-5xl px-5 lg:px-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.36em] text-gold font-semibold mb-5">Equip & Strengthen</p>
        <span className="inline-block h-[2px] w-12 bg-gold mb-8" />
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl leading-[1.05] mb-7 tracking-tight">
          Equip, Strengthen and Increase Your Workforce<br className="hidden lg:block" />
          <span className="text-gold"> For Effective Ministry</span>
        </h2>
        <p className="max-w-3xl mx-auto text-white/75 text-base sm:text-lg leading-relaxed mb-10">
          Access life-transforming teachings, prayer resources, training materials and ministry programs designed to help you grow and build more effective stewards in the work of the ministry.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/auth"
            className="group relative inline-flex items-center gap-2 px-9 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-navy-deep rounded-sm shadow-gold overflow-hidden"
            style={{ background: "linear-gradient(135deg, oklch(0.78 0.11 78) 0%, oklch(0.66 0.13 75) 50%, oklch(0.55 0.13 73) 100%)" }}
          >
            <span className="relative z-10">Register</span>
            <ArrowRight className="relative z-10 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          </Link>
          <button
            type="button"
            onClick={openPartner}
            className="group inline-flex items-center gap-2 px-9 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-navy-deep bg-white hover:bg-gold hover:text-navy-deep rounded-sm transition-all"
          >
            <Handshake className="h-3.5 w-3.5" />
            Partner With Us
          </button>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-9 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-white border-2 border-white/30 hover:border-gold hover:text-gold rounded-sm transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
