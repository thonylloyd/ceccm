import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export const getSalvationSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("site_settings").select("value").eq("key", "salvation").maybeSingle();
  return (data?.value as any) ?? { video_url: "", enabled: true };
});

export const salvationSettingsQuery = () =>
  queryOptions({
    queryKey: ["salvation-settings"],
    queryFn: () => getSalvationSettings(),
    staleTime: 60_000,
  });

const LeadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(3).max(40).optional().or(z.literal("")),
});

export const submitSalvationLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => LeadSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("salvation_leads").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListSalvationLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const r = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!r.data) throw new Error("Forbidden");
    const { data, error } = await supabaseAdmin.from("salvation_leads").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminDeleteSalvationLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => ({ id: z.string().uuid().parse(data.id) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const r = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!r.data) throw new Error("Forbidden");
    const { error } = await supabaseAdmin.from("salvation_leads").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
