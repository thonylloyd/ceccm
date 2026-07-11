import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo } from "react";
import { usePortalSession } from "./route";
import {
  listReports, saveReport, approveReport, deleteReport, getMyAssignments,
  REPORT_NUMERIC_FIELDS,
} from "@/lib/reports.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, FileText, CheckCircle2, Trash2, Pencil, Download } from "lucide-react";

export const Route = createFileRoute("/portal/reports")({
  component: ReportsPage,
});

type Report = any;

const NUMERIC_GROUPS: { title: string; fields: { key: string; label: string }[] }[] = [
  {
    title: "Numerical Growth",
    fields: [
      { key: "new_converts", label: "New Converts" },
      { key: "water_baptized", label: "Water Baptized" },
      { key: "filled_with_spirit", label: "Filled with the Holy Ghost" },
      { key: "first_timers", label: "First Timers" },
      { key: "church_attendance", label: "Church Attendance" },
      { key: "cell_attendance", label: "Cell Attendance" },
      { key: "tithers", label: "Tithers" },
      { key: "partners", label: "Partners" },
    ],
  },
  {
    title: "Membership Effectiveness (Added this week / Current total)",
    fields: [
      { key: "foundation_school_added", label: "Foundation School — Added" },
      { key: "foundation_school_total", label: "Foundation School — Total" },
      { key: "discipleship_added", label: "Discipleship — Added" },
      { key: "discipleship_total", label: "Discipleship — Total" },
      { key: "cell_leaders_added", label: "Cell Leaders — Added" },
      { key: "cell_leaders_total", label: "Cell Leaders — Total" },
      { key: "cell_members_added", label: "Cell Members — Added" },
      { key: "cell_members_total", label: "Cell Members — Total" },
      { key: "workers_added", label: "Workers — Added" },
      { key: "workers_total", label: "Workers — Total" },
    ],
  },
];

function todayMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

function ReportsPage() {
  const s = usePortalSession();
  const canApprove = s.isAdmin || s.isSiteMaintenance;
  const qc = useQueryClient();
  const listFn = useServerFn(listReports);
  const assignFn = useServerFn(getMyAssignments);
  const approveFn = useServerFn(approveReport);
  const delFn = useServerFn(deleteReport);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [editing, setEditing] = useState<Report | null>(null);
  const [open, setOpen] = useState(false);

  const reportsQ = useQuery({
    queryKey: ["weekly-reports", statusFilter],
    queryFn: () => listFn({ data: { status: statusFilter || undefined } as any }),
  });
  const assignQ = useQuery({ queryKey: ["my-assignments"], queryFn: () => assignFn() });

  const approveM = useMutation({
    mutationFn: (id: string) => approveFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["weekly-reports"] }); toast.success("Report approved"); },
    onError: (e: any) => toast.error(e.message),
  });
  const deleteM = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["weekly-reports"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const canSubmit = (assignQ.data ?? []).length > 0 || s.isAdmin || s.isSiteMaintenance;

  function exportCsv() {
    const rows = reportsQ.data ?? [];
    if (!rows.length) return toast.info("No reports to export");
    const headers = [
      "week_start","status","church","group_church","zone","reporter",
      ...REPORT_NUMERIC_FIELDS,
    ];
    const lines = [headers.join(",")];
    for (const r of rows) {
      const line = [
        r.week_start, r.status,
        JSON.stringify(r.churches?.name ?? ""),
        JSON.stringify(r.group_churches?.name ?? ""),
        JSON.stringify(r.zones?.name ?? ""),
        JSON.stringify((r as any).profiles?.display_name ?? ""),
        ...REPORT_NUMERIC_FIELDS.map((k) => (r as any)[k] ?? 0),
      ];
      lines.push(line.join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `weekly-reports-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50">Portal</div>
          <h1 className="font-display text-3xl text-navy-deep">Weekly Reports</h1>
          <p className="text-sm text-charcoal/70 mt-1">Submit and track weekly church growth reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-1" />CSV</Button>
          {canSubmit && (
            <Button onClick={() => { setEditing(null); setOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> New Report
            </Button>
          )}
        </div>
      </div>

      {!canSubmit && !reportsQ.data?.length && (
        <div className="rounded-lg border border-dashed border-black/15 p-10 text-center text-sm text-charcoal/70">
          You don't have any church assignments yet. Ask an administrator to assign you to a church.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-elegant border border-black/5 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-black/5 text-[11px] uppercase tracking-wider text-charcoal/50 font-semibold">
          <div className="col-span-2">Week</div>
          <div className="col-span-3">Church</div>
          <div className="col-span-2">Reporter</div>
          <div className="col-span-2">Growth (NC / Att)</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {reportsQ.isLoading && <div className="p-6 text-center text-sm text-charcoal/60">Loading…</div>}
        {reportsQ.data?.length === 0 && <div className="p-6 text-center text-sm text-charcoal/60">No reports yet.</div>}
        {reportsQ.data?.map((r: Report) => (
          <div key={r.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-black/5 items-center text-sm">
            <div className="col-span-2 font-mono text-xs">{r.week_start}</div>
            <div className="col-span-3">
              <div className="font-medium">{r.churches?.name ?? "—"}</div>
              <div className="text-xs text-charcoal/60">{r.zones?.name ?? ""}</div>
            </div>
            <div className="col-span-2 text-xs">{r.profiles?.display_name ?? "—"}</div>
            <div className="col-span-2 text-xs">
              +{r.new_converts} conv · {r.church_attendance} att
            </div>
            <div className="col-span-1">
              <Badge variant={r.status === "approved" ? "default" : r.status === "submitted" ? "secondary" : "outline"}>
                {r.status}
              </Badge>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-1">
              {(r.reporter_id === s.userId && r.status !== "approved") && (
                <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {canApprove && r.status === "submitted" && (
                <Button size="icon" variant="ghost" onClick={() => approveM.mutate(r.id)}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </Button>
              )}
              {(canApprove || (r.reporter_id === s.userId && r.status === "draft")) && (
                <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete report?")) deleteM.mutate(r.id); }}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <ReportDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        assignments={assignQ.data ?? []}
        onSaved={() => qc.invalidateQueries({ queryKey: ["weekly-reports"] })}
      />
    </div>
  );
}

function ReportDialog({ open, onOpenChange, editing, assignments, onSaved }: any) {
  const saveFn = useServerFn(saveReport);
  const initial = useMemo<any>(() => {
    if (editing) return { ...editing };
    const churchAssign = assignments.find((a: any) => a.church_id) ?? assignments[0];
    return {
      week_start: todayMonday(),
      status: "draft",
      church_id: churchAssign?.church_id ?? null,
      group_church_id: churchAssign?.group_church_id ?? null,
      zone_id: churchAssign?.zone_id ?? null,
      notes: "",
      ...Object.fromEntries(REPORT_NUMERIC_FIELDS.map((k) => [k, 0])),
    };
  }, [editing, assignments, open]);

  const [form, setForm] = useState<any>(initial);
  // reset on open
  useMemo(() => setForm(initial), [initial]);

  const saveM = useMutation({
    mutationFn: (status: "draft" | "submitted") => saveFn({ data: { ...form, status } as any }),
    onSuccess: () => { toast.success("Saved"); onOpenChange(false); onSaved(); },
    onError: (e: any) => toast.error(e.message),
  });

  const churchOptions = assignments.filter((a: any) => a.church_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-navy-deep flex items-center gap-2">
            <FileText className="h-5 w-5 text-gold" />
            {editing ? "Edit Weekly Report" : "New Weekly Report"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label>Week Starting (Monday)</Label>
            <Input type="date" value={form.week_start ?? ""} onChange={(e) => setForm({ ...form, week_start: e.target.value })} />
          </div>
          <div>
            <Label>Church</Label>
            <Select value={form.church_id ?? ""} onValueChange={(v) => {
              const a = churchOptions.find((x: any) => x.church_id === v);
              setForm({ ...form, church_id: v, group_church_id: a?.group_church_id ?? null, zone_id: a?.zone_id ?? null });
            }}>
              <SelectTrigger><SelectValue placeholder="Select church" /></SelectTrigger>
              <SelectContent>
                {churchOptions.map((a: any) => (
                  <SelectItem key={a.id} value={a.church_id}>{a.churches?.name ?? a.church_id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {NUMERIC_GROUPS.map((grp) => (
          <div key={grp.title} className="mt-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-navy-deep mb-3">{grp.title}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {grp.fields.map((f) => (
                <div key={f.key}>
                  <Label className="text-xs">{f.label}</Label>
                  <Input
                    type="number" min={0}
                    value={form[f.key] ?? 0}
                    onChange={(e) => setForm({ ...form, [f.key]: parseInt(e.target.value || "0", 10) })}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6">
          <Label>Notes / Testimonies</Label>
          <Textarea rows={4} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={() => saveM.mutate("draft")} disabled={saveM.isPending}>
            Save Draft
          </Button>
          <Button onClick={() => saveM.mutate("submitted")} disabled={saveM.isPending}>
            Submit Report
          </Button>
        </DialogFooter>

        {!churchOptions.length && (
          <p className="text-xs text-red-600 mt-3">
            You have no church assignments. Ask an admin to assign your account before submitting a report.
          </p>
        )}
        <div className="text-[11px] text-charcoal/60 mt-2">
          <Link to="/portal" className="underline">← Back to Portal</Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
