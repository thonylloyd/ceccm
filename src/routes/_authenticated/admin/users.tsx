import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listUsersWithRoles, setUserRole } from "@/lib/admin.functions";
import { PageHeader, Card, Button } from "@/components/admin/ui";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

function UsersAdmin() {
  const qc = useQueryClient();
  const listFn = useServerFn(listUsersWithRoles);
  const roleFn = useServerFn(setUserRole);
  const q = useQuery({ queryKey: ["a", "users"], queryFn: () => listFn() });
  const setRole = useMutation({
    mutationFn: (v: any) => roleFn({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["a", "users"] }); toast.success("Updated"); },
  });

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader title="Users" description="Manage user accounts and roles." />
      {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <Card className="!p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-light text-xs uppercase tracking-wider text-charcoal/60">
              <tr><th className="text-left px-4 py-3">User</th><th className="text-left px-4 py-3">Roles</th><th className="text-right px-4 py-3">Actions</th></tr>
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
                        <span key={r} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-gold/15 text-gold rounded">{r}</span>
                      )) : <span className="text-xs text-charcoal/50">No roles</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      {(["admin", "editor", "viewer"] as const).map((role) => {
                        const has = u.roles.includes(role);
                        return (
                          <Button
                            key={role}
                            variant={has ? "primary" : "outline"}
                            onClick={() => setRole.mutate({ user_id: u.id, role, grant: !has })}
                          >
                            {has ? `–${role}` : `+${role}`}
                          </Button>
                        );
                      })}
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
