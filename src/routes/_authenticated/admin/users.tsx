import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listUsersWithRoles, setUserRole, createUserAccount, deleteUserAccount,
} from "@/lib/admin.functions";
import { PageHeader, Card, Field, Input, Button } from "@/components/admin/ui";
import { useAdminSession } from "./admin-context";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

type Role = "super_admin" | "admin" | "viewer";

function UsersAdmin() {
  const session = useAdminSession();
  const qc = useQueryClient();
  const listFn = useServerFn(listUsersWithRoles);
  const roleFn = useServerFn(setUserRole);
  const createFn = useServerFn(createUserAccount);
  const deleteFn = useServerFn(deleteUserAccount);
  const q = useQuery({ queryKey: ["a", "users"], queryFn: () => listFn() });

  const setRole = useMutation({
    mutationFn: (v: { user_id: string; role: Role; grant: boolean }) => roleFn({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "users"] }); toast.success("Updated"); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });
  const create = useMutation({
    mutationFn: (v: any) => createFn({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "users"] }); toast.success("User created"); setShowAdd(false); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });
  const del = useMutation({
    mutationFn: (user_id: string) => deleteFn({ data: { user_id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "users"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", display_name: "", role: "viewer" as Role });

  const roles: Role[] = session.isSuperAdmin
    ? ["super_admin", "admin", "viewer"]
    : ["admin", "viewer"];

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Users"
        description="Manage user accounts and roles."
        actions={session.isSuperAdmin ? (
          <Button onClick={() => setShowAdd(true)}><Plus className="h-3.5 w-3.5" /> Add User</Button>
        ) : null}
      />

      {showAdd && session.isSuperAdmin && (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg text-navy-deep">New user</h3>
            <button onClick={() => setShowAdd(false)} className="text-charcoal/50 hover:text-navy-deep"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Password (min 8)"><Input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
            <Field label="Display Name"><Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} /></Field>
            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white focus:outline-none focus:border-gold"
              >
                {roles.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
              </select>
            </Field>
          </div>
          <div className="mt-4 pt-4 border-t border-black/5 flex gap-2">
            <Button
              onClick={() => create.mutate(form)}
              disabled={create.isPending || !form.email || form.password.length < 8}
            >
              {create.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create User"}
            </Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <Card className="!p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-light text-xs uppercase tracking-wider text-charcoal/60">
              <tr>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Roles</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {q.data?.map((u: any) => (
                <tr key={u.id} className="border-t border-black/5">
                  <td className="px-4 py-3">
                    <div className="font-medium text-navy-deep">{u.display_name || u.email}</div>
                    <div className="text-xs text-charcoal/50">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.length ? u.roles.map((r: string) => (
                        <span key={r} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-gold/15 text-gold rounded">
                          {r.replace("_", " ")}
                        </span>
                      )) : <span className="text-xs text-charcoal/50">No roles</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex flex-wrap gap-1 justify-end">
                      {session.isSuperAdmin && roles.map((role) => {
                        const has = u.roles.includes(role);
                        return (
                          <Button
                            key={role}
                            variant={has ? "primary" : "outline"}
                            onClick={() => setRole.mutate({ user_id: u.id, role, grant: !has })}
                          >
                            {has ? `– ${role.replace("_", " ")}` : `+ ${role.replace("_", " ")}`}
                          </Button>
                        );
                      })}
                      {session.isSuperAdmin && u.id !== session.userId && (
                        <Button
                          variant="danger"
                          onClick={() => { if (confirm(`Delete ${u.email}? This cannot be undone.`)) del.mutate(u.id); }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!q.data?.length && <tr><td colSpan={3} className="text-center text-sm text-charcoal/50 py-8">No users yet.</td></tr>}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
