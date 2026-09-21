import { createContext, useContext } from "react";

export type AdminSession = {
  isAdmin: boolean;
  isSuperAdmin: boolean; // legacy alias for isSiteMaintenance
  isSiteMaintenance: boolean;
  permissions: string[];
  roles: string[];
  userId: string;
  email?: string | null;

};

export const AdminCtx = createContext<AdminSession | null>(null);

export const useAdminSession = () => {
  const v = useContext(AdminCtx);
  if (!v) throw new Error("useAdminSession outside AdminLayout");
  return v;
};

