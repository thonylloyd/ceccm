import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Returns a DB client usable on any host.
 * - Lovable hosting (service-role key present): privileged client.
 * - External hosts like Vercel (no service-role key): the signed-in user's
 *   RLS-scoped client when given, otherwise a public publishable-key client.
 */
export async function serverDb(userClient?: SupabaseClient<Database>): Promise<SupabaseClient<Database>> {
  if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return supabaseAdmin as unknown as SupabaseClient<Database>;
  }
  if (userClient) return userClient;
  return publicDb();
}

export function publicDb(): SupabaseClient<Database> {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY environment variables");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const hasServiceRole = () => !!process.env["SUPABASE_SERVICE_ROLE_KEY"];
