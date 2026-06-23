import { supabase } from "@/integrations/supabase/client";

const SIGNED_TTL = 60 * 60 * 24 * 365; // 1 year

export async function resolveAvatarUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  // treat as storage path inside the "media" bucket
  const { data } = await supabase.storage.from("media").createSignedUrl(value, SIGNED_TTL);
  return data?.signedUrl ?? null;
}
