import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Bell, Check, Trash2, X } from "lucide-react";
import { listMyNotifications, markNotificationRead, deleteNotification } from "@/lib/notifications.functions";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const listFn = useServerFn(listMyNotifications);
  const markFn = useServerFn(markNotificationRead);
  const delFn = useServerFn(deleteNotification);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["portal-notifications"],
    queryFn: () => listFn(),
    refetchInterval: 60_000,
  });

  const mark = useMutation({
    mutationFn: (v: { id?: string; all?: boolean }) => markFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portal-notifications"] }),
  });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portal-notifications"] }),
  });

  const unread = q.data?.unread ?? 0;
  const items = q.data?.items ?? [];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/5 text-white/80"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-gold text-navy-deep text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute left-full ml-2 top-0 z-50 w-80 bg-white rounded-lg shadow-2xl border border-black/10 text-charcoal">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/5">
            <div className="font-display text-sm text-navy-deep">Notifications</div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={() => mark.mutate({ all: true })}
                  className="text-[10px] uppercase tracking-wider text-gold hover:underline px-1.5"
                >
                  Mark all
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-black/5 rounded">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center text-sm text-charcoal/60">No notifications yet.</div>
            ) : (
              items.map((n: any) => (
                <div key={n.id} className={`px-4 py-3 border-b border-black/5 flex gap-2 ${!n.read_at ? "bg-gold/5" : ""}`}>
                  <div className="flex-1 min-w-0">
                    {n.link ? (
                      <Link
                        to={n.link}
                        onClick={() => { setOpen(false); if (!n.read_at) mark.mutate({ id: n.id }); }}
                        className="block"
                      >
                        <div className="text-sm font-semibold text-navy-deep truncate">{n.title}</div>
                        {n.body && <div className="text-xs text-charcoal/70 mt-0.5 line-clamp-2">{n.body}</div>}
                      </Link>
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-navy-deep truncate">{n.title}</div>
                        {n.body && <div className="text-xs text-charcoal/70 mt-0.5 line-clamp-2">{n.body}</div>}
                      </>
                    )}
                    <div className="text-[10px] text-charcoal/50 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!n.read_at && (
                      <button onClick={() => mark.mutate({ id: n.id })} title="Mark read" className="p-1 hover:bg-black/5 rounded text-charcoal/60">
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button onClick={() => del.mutate(n.id)} title="Delete" className="p-1 hover:bg-black/5 rounded text-charcoal/60">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
