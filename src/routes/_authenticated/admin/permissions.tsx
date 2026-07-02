import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPermissionsMatrix, setRolePermission } from "@/lib/admin.functions";
import { PageHeader, Card } from "@/components/admin/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAdminSession } from "./route";

export const Route = createFileRoute("/_authenticated/admin/permissions")({
  component: PermissionsAdmin,
});

type Role = "admin" | "viewer";

function PermissionsAdmin() {
  const session = useAdminSession();
  const qc = useQueryClient();
  const listFn = useServerFn(listPermissionsMatrix);
  const setFn = useServerFn(setRolePermission);
  const q = useQuery({ queryKey: ["a", "permissions-matrix"], queryFn: () => listFn() });

  const toggle = useMutation({
    mutationFn: (v: { role: Role; permission_key: string; grant: boolean }) => setFn({ data: v }),
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: ["a", "permissions-matrix"] });
      const prev = qc.getQueryData<any>(["a", "permissions-matrix"]);
      qc.setQueryData<any>(["a", "permissions-matrix"], (old: any) => {
        if (!old) return old;
        const next = { ...old, role_permissions: [...old.role_permissions] };
        if (v.grant) {
          next.role_permissions.push({ role: v.role, permission_key: v.permission_key });
        } else {
          next.role_permissions = next.role_permissions.filter(
            (rp: any) => !(rp.role === v.role && rp.permission_key === v.permission_key),
          );
        }
        return next;
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["a", "permissions-matrix"], ctx.prev);
      toast.error("Failed to update");
    },
    onSuccess: () => toast.success("Updated"),
    onSettled: () => qc.invalidateQueries({ queryKey: ["a", "permissions-matrix"] }),
  });

  if (!session.isSuperAdmin) {
    return (
      <div className="p-8">
        <Card>Only super admins can manage permissions.</Card>
      </div>
    );
  }

  if (q.isLoading || !q.data) {
    return <div className="p-8"><Loader2 className="h-5 w-5 animate-spin text-navy-deep" /></div>;
  }

  const { permissions, role_permissions, roles } = q.data;
  const has = (role: Role, key: string) =>
    role_permissions.some((rp: any) => rp.role === role && rp.permission_key === key);

  return (
    <div className="p-8 max-w-4xl">
      <PageHeader
        title="Role Permissions"
        description="Grant or revoke access to each admin dashboard section for each role. Super admins always have full access."
      />

      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-light text-xs uppercase tracking-wider text-charcoal/60">
            <tr>
              <th className="text-left px-4 py-3">Section</th>
              <th className="text-center px-4 py-3 w-32">
                <span className="inline-flex items-center gap-1.5 text-gold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
                </span>
              </th>
              {roles.map((r: Role) => (
                <th key={r} className="text-center px-4 py-3 w-32 capitalize">{r.replace("_", " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((p: any) => (
              <tr key={p.key} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <div className="font-medium text-navy-deep">{p.label}</div>
                  <div className="text-xs text-charcoal/50 font-mono">{p.key}</div>
                </td>
                <td className="text-center px-4 py-3">
                  <Checkbox checked disabled />
                </td>
                {roles.map((role: Role) => (
                  <td key={role} className="text-center px-4 py-3">
                    <Checkbox
                      checked={has(role, p.key)}
                      onCheckedChange={(v) =>
                        toggle.mutate({ role, permission_key: p.key, grant: !!v })
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 text-xs text-charcoal/60">
        Changes take effect on each user's next admin page load.
      </div>
    </div>
  );
}
