import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

export type PartnerSettings = {
  intro?: string;
  espees_merchant?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
};

const DEFAULTS: PartnerSettings = {
  intro:
    "Join us in making the divine mandate a reality across the nations. Partner with us today.",
  espees_merchant: "CECCM",
  bank_name: "Parallex",
  bank_account_name: "CE CCM",
  bank_account_number: "012345678",
};

export const getPartnerSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "partner")
    .maybeSingle();
  return { ...DEFAULTS, ...((data?.value as PartnerSettings) ?? {}) };
});

export const partnerSettingsQuery = () =>
  queryOptions({
    queryKey: ["partner-settings"],
    queryFn: () => getPartnerSettings(),
    staleTime: 60_000,
  });
