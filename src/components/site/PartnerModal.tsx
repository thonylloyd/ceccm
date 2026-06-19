import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { partnerSettingsQuery } from "@/lib/partner.functions";
import { X, Copy, Check, Handshake, Landmark } from "lucide-react";
import espeesCoin from "@/assets/espees-coin.png.asset.json";
import { toast } from "sonner";

export function PartnerModal() {
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.search });
  const isOpen = (search as any)?.partner === "1" || (search as any)?.partner === 1;
  const q = useQuery(partnerSettingsQuery());
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;
  const data = q.data ?? {};
  const close = () =>
    navigate({ to: ".", search: (prev: any) => ({ ...prev, partner: undefined }) as any });

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-[fade-in_0.2s_ease-out]">
      <div className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gold/20 animate-[scale-in_0.25s_ease-out]">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/95 hover:bg-gold hover:text-white border border-black/10 flex items-center justify-center text-navy-deep transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-gradient-to-br from-navy-deep via-navy to-[#020b1f] text-white px-6 sm:px-8 pt-10 pb-8 rounded-t-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(ellipse at 30% 20%, oklch(0.66 0.13 75 / 0.6) 0%, transparent 55%)",
          }} />
          <div className="relative">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 border border-gold/40 text-gold mb-4">
              <Handshake className="h-7 w-7" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold font-bold mb-2">Partner With Us</p>
            <h2 className="font-display text-2xl sm:text-3xl leading-tight">
              {data.intro ?? "Join us in making the divine mandate a reality across the nations. Partner with us today."}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Espees */}
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/5 to-transparent p-5">
            <div className="flex items-center gap-3 mb-3">
              <img src={espeesCoin.url} alt="" className="h-8 w-8" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold font-bold">Give via Espees</p>
                <h3 className="font-display text-lg text-navy-deep">Merchant Code</h3>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 bg-white rounded-lg border border-black/5 px-4 py-3">
              <span className="font-mono text-lg sm:text-xl tracking-widest text-navy-deep font-bold">
                {data.espees_merchant}
              </span>
              <button
                onClick={() => copy("Merchant code", data.espees_merchant ?? "")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-deep hover:text-gold transition"
              >
                {copied === "Merchant code" ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
                {copied === "Merchant code" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Bank */}
          <div className="rounded-xl border border-black/10 bg-light/40 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-navy-deep text-gold flex items-center justify-center">
                <Landmark className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-navy-deep/60 font-bold">Give via Bank Transfer</p>
                <h3 className="font-display text-lg text-navy-deep">Bank Details</h3>
              </div>
            </div>
            <dl className="space-y-2">
              <BankRow label="Account Name" value={data.bank_account_name ?? ""} onCopy={copy} copied={copied} />
              <BankRow label="Account Number" value={data.bank_account_number ?? ""} mono onCopy={copy} copied={copied} />
              <BankRow label="Bank" value={data.bank_name ?? ""} onCopy={copy} copied={copied} />
            </dl>
          </div>

          <p className="text-center text-xs text-charcoal/60 italic pt-2">
            Thank you for sowing into the work of the ministry. God bless you abundantly!
          </p>
        </div>
      </div>
    </div>
  );
}

function BankRow({
  label,
  value,
  mono,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy: (l: string, v: string) => void;
  copied: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white rounded-lg border border-black/5 px-4 py-2.5">
      <div className="min-w-0">
        <dt className="text-[10px] uppercase tracking-[0.18em] text-charcoal/55 font-semibold">{label}</dt>
        <dd className={`text-sm text-navy-deep font-semibold truncate ${mono ? "font-mono tracking-wider" : ""}`}>{value}</dd>
      </div>
      <button
        onClick={() => onCopy(label, value)}
        className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-deep hover:text-gold transition"
      >
        {copied === label ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
