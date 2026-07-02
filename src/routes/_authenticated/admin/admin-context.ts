import { createContext, useContext } from "react";

export type AdminSession = {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  permissions: string[];
  roles: string[];
  userId: string;
};

export const AdminCtx = createContext<AdminSession | null>(null);

export const useAdminSession = () => {
  const v = useContext(AdminCtx);
  if (!v) throw new Error("useAdminSession outside AdminLayout");
  return v;
};
