import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { salvationSettingsQuery, submitSalvationLead } from "@/lib/salvation.functions";
import { X, Loader2, Heart, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const PRAYER = `O Lord God, I believe with all my heart in Jesus Christ, Son of the living God.

I believe He died for me and God raised Him from the dead. I believe He's alive today.

I confess with my mouth that Jesus Christ is the Lord of my life from this day.

Through Him and in His Name, I have eternal life; I'm born again.

Thank you Lord, for saving my soul! I'm now a child of God. Hallelujah!`;

const CONGRATS = `Congratulations! You are now a child of God.

We want to send you a Special Gift to help you grow in your walk with the Lord.

Kindly fill in your details below to receive your gift.

God bless you.`;

const GIFT_DOWNLOAD_URL = "https://kingscloud.co/api/shared_file/5RIDZA3NFSNNF5XKLD35LRLKGPOCGIEF";

function toEmbed(url: string): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  return url;
}

export function SalvationModal() {
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.search });
  const isOpen = (search as any)?.salvation === "1" || (search as any)?.salvation === 1;

  const q = useQuery(salvationSettingsQuery());
  const submit = useServerFn(submitSalvationLead);
  const [stage, setStage] = useState<"prayer" | "gift" | "done">("prayer");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const m = useMutation({
    mutationFn: (data: typeof form) => submit({ data }),
    onSuccess: () => {
      setStage("done");
      toast.success("Thank you! Your gift is downloading.");
      try {
        const a = document.createElement("a");
        a.href = GIFT_DOWNLOAD_URL;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch {
        window.open(GIFT_DOWNLOAD_URL, "_blank", "noopener,noreferrer");
      }
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not submit"),
  });

  useEffect(() => {
    if (isOpen) { setStage("prayer"); setForm({ name: "", email: "", phone: "" }); }
  }, [isOpen]);

  if (!isOpen) return null;

  const close = () => navigate({ to: ".", search: (prev: any) => ({ ...prev, salvation: undefined }) as any });
  const videoUrl = q.data?.video_url ? toEmbed(q.data.video_url) : "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-[fade-in_0.2s_ease-out]">
      <div className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gold/20 animate-[scale-in_0.25s_ease-out]">
        <button onClick={close} aria-label="Close" className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/95 hover:bg-gold hover:text-white border border-black/10 flex items-center justify-center text-navy-deep transition">
          <X className="h-4 w-4" />
        </button>

        {videoUrl ? (
          <div className="aspect-video w-full bg-black rounded-t-2xl overflow-hidden">
            <iframe src={videoUrl} title="Receive Salvation" className="w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-navy-deep via-navy-deep to-charcoal flex flex-col items-center justify-center text-white/80 text-sm rounded-t-2xl">
            <Heart className="h-10 w-10 text-gold mb-3" />
            <p className="font-display text-xl text-white">Receive Salvation</p>
            <p className="text-xs text-white/55 mt-1">Set video URL in Admin → Settings → Salvation</p>
          </div>
        )}

        <div className="p-6 sm:p-8">
          {stage === "prayer" && (
            <>
              <div className="text-center mb-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-gold font-bold mb-2">Prayer of Salvation</p>
                <h2 className="font-display text-2xl sm:text-3xl text-navy-deep">Say this prayer aloud</h2>
              </div>
              <div className="bg-light/60 border border-gold/15 rounded-xl p-5 sm:p-6">
                <p className="text-charcoal/85 leading-relaxed whitespace-pre-line italic text-sm sm:text-base">{PRAYER}</p>
              </div>
              <button
                onClick={() => setStage("gift")}
                className="mt-6 w-full bg-gradient-to-r from-gold to-gold-soft hover:from-gold-soft hover:to-gold text-white font-bold uppercase tracking-[0.18em] text-xs sm:text-sm px-6 py-4 rounded-lg shadow-gold transition"
              >
                I have said the prayer of Salvation
              </button>
            </>
          )}

          {stage === "gift" && (
            <>
              <div className="text-center mb-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold mb-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-navy-deep">Welcome to the family</h2>
              </div>
              <p className="text-sm text-charcoal/75 leading-relaxed whitespace-pre-line text-center mb-6">{CONGRATS}</p>
              <form
                onSubmit={(e) => { e.preventDefault(); m.mutate(form); }}
                className="space-y-3"
              >
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="w-full px-4 py-3 rounded-lg border border-black/10 text-sm focus:outline-none focus:border-gold" />
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-black/10 text-sm focus:outline-none focus:border-gold" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg border border-black/10 text-sm focus:outline-none focus:border-gold" />
                <button type="submit" disabled={m.isPending} className="w-full bg-navy-deep hover:bg-navy text-white font-bold uppercase tracking-[0.18em] text-xs sm:text-sm px-6 py-4 rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {m.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Receive my Gift
                </button>
              </form>
            </>
          )}

          {stage === "done" && (
            <div className="text-center py-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-navy-deep mb-2">Thank you!</h2>
              <p className="text-sm text-charcoal/70">We've received your details and will be in touch shortly. God bless you!</p>
              <button onClick={close} className="mt-6 inline-flex bg-navy-deep hover:bg-navy text-white font-bold uppercase tracking-[0.18em] text-xs px-8 py-3 rounded-lg transition">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
