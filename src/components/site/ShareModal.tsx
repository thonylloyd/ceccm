import { useState } from "react";
import { X, Copy, Check, Facebook, Twitter, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export function ShareModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  }

  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  const links = [
    { Icon: Facebook, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}` },
    { Icon: Twitter, label: "X / Twitter", href: `https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}` },
    { Icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/?text=${encTitle}%20${encUrl}` },
    { Icon: Mail, label: "Email", href: `mailto:?subject=${encTitle}&body=${encUrl}` },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-elegant max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-light"><X className="h-4 w-4" /></button>
        <h3 className="font-display text-xl text-navy-deep mb-1">Share</h3>
        <p className="text-xs text-charcoal/60 mb-5 line-clamp-1">{title}</p>

        <div className="grid grid-cols-4 gap-3 mb-5">
          {links.map(({ Icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-light transition-colors text-navy-deep">
              <Icon className="h-5 w-5" />
              <span className="text-[10px] uppercase tracking-wide">{label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-light border border-black/10 rounded-md px-3 py-2">
          <input readOnly value={url} className="flex-1 bg-transparent text-xs outline-none text-charcoal/80" />
          <button onClick={copy} className="inline-flex items-center gap-1 bg-navy-deep text-white text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded hover:bg-gold transition-colors">
            {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
          </button>
        </div>
      </div>
    </div>
  );
}
