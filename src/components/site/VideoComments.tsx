import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

type Comment = {
  id: string;
  user_id: string;
  author_name: string | null;
  body: string;
  created_at: string;
};

export function VideoComments({ videoId }: { videoId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("video_comments")
      .select("id, user_id, author_name, body, created_at")
      .eq("video_id", videoId)
      .order("created_at", { ascending: false });
    if (!error) setItems((data ?? []) as Comment[]);
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [videoId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { toast.error("Sign in to comment"); return; }
    if (!text.trim()) return;
    setPosting(true);
    const authorName = (user.user_metadata as any)?.full_name || user.email?.split("@")[0] || "Member";
    const { error } = await supabase.from("video_comments").insert({
      video_id: videoId, user_id: user.id, author_name: authorName, body: text.trim(),
    });
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    setText("");
    load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("video_comments").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setItems((x) => x.filter((c) => c.id !== id));
  }

  return (
    <section className="mt-10 pt-8 border-t border-black/10">
      <h2 className="font-display text-2xl text-navy-deep mb-5 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-gold" /> Comments ({items.length})
      </h2>

      {user ? (
        <form onSubmit={submit} className="mb-7 flex gap-3 items-start">
          <div className="h-9 w-9 rounded-full bg-navy-deep text-white font-semibold flex items-center justify-center text-sm shrink-0">
            {(user.email ?? "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts…" rows={3}
              className="w-full px-4 py-3 rounded-md border border-black/10 bg-white text-sm focus:outline-none focus:border-gold resize-y"
            />
            <div className="mt-2 flex justify-end">
              <button type="submit" disabled={posting || !text.trim()}
                className="inline-flex items-center gap-2 bg-navy-deep text-white px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] hover:bg-gold disabled:opacity-50 transition-colors">
                {posting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Post Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-7 p-4 bg-light border border-black/5 rounded-md text-sm text-charcoal/70">
          <Link to="/auth" className="text-gold font-semibold hover:underline">Sign in</Link> to leave a comment.
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-charcoal/50"><Loader2 className="h-5 w-5 animate-spin inline" /></div>
      ) : items.length === 0 ? (
        <p className="text-sm text-charcoal/55 py-6 text-center">No comments yet. Be the first.</p>
      ) : (
        <ul className="space-y-5">
          {items.map((c) => (
            <li key={c.id} className="flex gap-3 group">
              <div className="h-9 w-9 rounded-full bg-gold/20 text-navy-deep font-semibold flex items-center justify-center text-sm shrink-0">
                {(c.author_name ?? "?").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm text-navy-deep">{c.author_name ?? "Member"}</span>
                  <span className="text-[11px] text-charcoal/45">{new Date(c.created_at).toLocaleDateString()}</span>
                  {user?.id === c.user_id && (
                    <button onClick={() => remove(c.id)} className="ml-auto opacity-0 group-hover:opacity-100 text-charcoal/40 hover:text-red-600 transition" aria-label="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-charcoal/85 leading-relaxed whitespace-pre-wrap">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
