import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListSalvationLeads, adminDeleteSalvationLead } from "@/lib/salvation.functions";
import { PageHeader, Card, Button } from "@/components/admin/ui";
import { Loader2, Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/salvation-leads")({
  component: SalvationLeads,
});

function SalvationLeads() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListSalvationLeads);
  const delFn = useServerFn(adminDeleteSalvationLead);
  const q = useQuery({ queryKey: ["salvation-leads"], queryFn: () => listFn() });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["salvation-leads"] }); toast.success("Deleted"); },
  });

  const exportCsv = () => {
    const rows = q.data ?? [];
    const csv = [
      "Name,Email,Phone,Date",
      ...rows.map((r: any) => `"${r.name}","${r.email}","${r.phone ?? ""}","${new Date(r.created_at).toISOString()}"`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `salvation-leads-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Salvation Leads"
        description="People who filled in their details after praying the prayer of salvation."
        actions={<Button onClick={exportCsv} disabled={!q.data?.length}>Export CSV</Button>}
      />
      <Card>
        {q.isLoading ? (
          <div className="flex items-center justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-navy-deep" /></div>
        ) : !q.data?.length ? (
          <p className="text-sm text-charcoal/60 py-6 text-center">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-[0.18em] text-charcoal/60 border-b border-black/10">
                <tr>
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Phone</th>
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {q.data.map((r: any) => (
                  <tr key={r.id} className="border-b border-black/5 hover:bg-light/50">
                    <td className="py-3 px-2 font-medium text-navy-deep">{r.name}</td>
                    <td className="py-3 px-2"><a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 text-charcoal/80 hover:text-gold"><Mail className="h-3.5 w-3.5" />{r.email}</a></td>
                    <td className="py-3 px-2">{r.phone ? <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 text-charcoal/80 hover:text-gold"><Phone className="h-3.5 w-3.5" />{r.phone}</a> : <span className="text-charcoal/40">—</span>}</td>
                    <td className="py-3 px-2 text-charcoal/60 text-xs">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">
                      <button onClick={() => { if (confirm("Delete this lead?")) del.mutate(r.id); }} className="text-charcoal/50 hover:text-red-600 p-1.5"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
