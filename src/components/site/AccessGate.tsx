import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Lock, KeyRound, Loader2 } from "lucide-react";
import espeesCoin from "@/assets/espees-coin.png.asset.json";
import { toast } from "sonner";
import {
  unlockVideoWithPassword, purchaseVideoWithEspees,
  unlockBroadcastWithPassword, purchaseBroadcastWithEspees,
  videoUnlockedQuery, broadcastUnlockedQuery,
  type AccessMode,
} from "@/lib/access.functions";

type GateProps = {
  kind: "video" | "broadcast";
  /** video slug or broadcast id */
  contentKey: string;
  accessMode: AccessMode;
  price?: number | null;
  thumbnail?: string | null;
  title?: string;
  /** Render this when access is granted (or mode is free). */
  children: React.ReactNode;
};

export function AccessGate({ kind, contentKey: keyId, accessMode, price, thumbnail, title, children }: GateProps) {
  const qc = useQueryClient();
  const needsAuth = accessMode !== "free";
  const unlockedQuery =
    kind === "video"
      ? videoUnlockedQuery(keyId, needsAuth)
      : broadcastUnlockedQuery(keyId, needsAuth);
  const q = useQuery(unlockedQuery);

  if (!needsAuth) return <>{children}</>;
  if (q.isLoading) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center text-white/60">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if ((q.data as any)?.unauthed) {
    return (
      <LockedShell thumbnail={thumbnail} title={title} accessMode={accessMode} price={price}>
        <p className="text-white/75 text-sm mb-4">Sign in to unlock this content.</p>
        <Link to="/auth" className="inline-flex items-center justify-center gap-2 bg-gold text-navy-deep px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] hover:bg-gold/90">
          Sign In to Continue
        </Link>
      </LockedShell>
    );
  }
  if (q.data?.unlocked) return <>{children}</>;

  const methods = (q.data as any)?.methods ?? [];
  const needsPassword = (accessMode === "password" || accessMode === "password_paid") && !methods.includes("password");
  const needsPayment = (accessMode === "paid" || accessMode === "password_paid") && !methods.includes("espees");

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: kind === "video" ? ["video-unlocked", keyId] : ["broadcast-unlocked", keyId] });
  };

  return (
    <LockedShell thumbnail={thumbnail} title={title} accessMode={accessMode} price={price}>
      <div className="space-y-4 w-full max-w-sm">
        {needsPassword && (
          <PasswordForm kind={kind} keyId={keyId} onUnlocked={invalidate} />
        )}
        {needsPayment && (
          <PurchaseButton kind={kind} keyId={keyId} price={price} onPurchased={invalidate} />
        )}
        {accessMode === "password_paid" && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 text-center">
            Both password and payment are required.
          </p>
        )}
      </div>
    </LockedShell>
  );
}

function LockedShell({ thumbnail, title, accessMode, price, children }: {
  thumbnail?: string | null; title?: string; accessMode: AccessMode; price?: number | null; children: React.ReactNode;
}) {
  const badge =
    accessMode === "password" ? "Password Protected"
    : accessMode === "paid" ? `Premium${price ? ` · ${price} ESPEES` : ""}`
    : accessMode === "password_paid" ? `Password + Premium${price ? ` · ${price} ESPEES` : ""}`
    : "Locked";
  return (
    <div className="relative aspect-video bg-black overflow-hidden">
      {thumbnail && <img src={thumbnail} alt={title ?? ""} className="absolute inset-0 h-full w-full object-cover opacity-30" />}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/85 to-black/90" />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <div className="inline-flex items-center gap-2 bg-gold text-navy-deep text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 mb-4">
          <Lock className="h-3 w-3" /> {badge}
        </div>
        {title && <h3 className="font-display text-xl sm:text-2xl mb-2 max-w-xl">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

function PasswordForm({ kind, keyId, onUnlocked }: { kind: "video" | "broadcast"; keyId: string; onUnlocked: () => void }) {
  const [pw, setPw] = useState("");
  const fn = useServerFn(kind === "video" ? unlockVideoWithPassword : unlockBroadcastWithPassword);
  const m = useMutation({
    mutationFn: () => kind === "video"
      ? (fn as any)({ data: { slug: keyId, password: pw } })
      : (fn as any)({ data: { id: keyId, password: pw } }),
    onSuccess: () => { toast.success("Unlocked"); onUnlocked(); },
    onError: (e: any) => toast.error(e.message ?? "Incorrect password"),
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (pw) m.mutate(); }} className="space-y-2">
      <div className="flex items-center gap-2 bg-white/10 ring-1 ring-white/20 px-3">
        <KeyRound className="h-4 w-4 text-gold" />
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter password" className="flex-1 bg-transparent py-2.5 outline-none text-sm text-white placeholder:text-white/40" />
      </div>
      <button type="submit" disabled={!pw || m.isPending} className="w-full inline-flex items-center justify-center gap-2 bg-gold text-navy-deep px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] hover:bg-gold/90 disabled:opacity-50">
        {m.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Unlock with Password"}
      </button>
    </form>
  );
}

function PurchaseButton({ kind, keyId, price, onPurchased }: { kind: "video" | "broadcast"; keyId: string; price?: number | null; onPurchased: () => void }) {
  const fn = useServerFn(kind === "video" ? purchaseVideoWithEspees : purchaseBroadcastWithEspees);
  const m = useMutation({
    mutationFn: () => kind === "video"
      ? (fn as any)({ data: { slug: keyId } })
      : (fn as any)({ data: { id: keyId } }),
    onSuccess: () => { toast.success("Purchase recorded"); onPurchased(); },
    onError: (e: any) => toast.error(e.message ?? "Purchase failed"),
  });
  return (
    <button onClick={() => m.mutate()} disabled={m.isPending} className="w-full inline-flex items-center justify-center gap-2 bg-white text-navy-deep px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] hover:bg-white/90 disabled:opacity-50">
      {m.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><img src={espeesCoin.url} alt="" className="h-5 w-5" /> Pay {price ? `${price} ESPEES` : "with ESPEES"}</>}
    </button>
  );
}
