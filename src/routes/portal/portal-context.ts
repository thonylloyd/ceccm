import { createContext, useContext } from "react";

export type PortalSession = {
  userId: string;
  roles: string[];
  isSiteMaintenance: boolean;
  isAdmin: boolean;
  isPastor: boolean;
  isExternalPastor: boolean;
  isZonalPastor: boolean;
  isGroupPastor: boolean;
  isChurchPastor: boolean;
  isMember: boolean;
  hasPortalAccess: boolean;
};

export const PortalCtx = createContext<PortalSession | null>(null);

export const usePortalSession = () => {
  const v = useContext(PortalCtx);
  if (!v) throw new Error("usePortalSession outside PortalLayout");
  return v;
};
