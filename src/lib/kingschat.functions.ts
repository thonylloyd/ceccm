import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const KINGSCHAT_CLIENT_ID = "376728a5-9c63-4857-b923-661ab96f160e";
export const KINGSCHAT_PROFILE_URL = "https://connect.kingsch.at/developer/api/profile";

/**
 * Exchanges a KingsChat access token (obtained via the kingschat-web-sdk popup
 * flow on the client) for a Supabase magiclink token. The server fetches the
 * KC profile, provisions/updates a user as `{username}@kingschat.online`, and
 * returns a `hashed_token` the client uses with `verifyOtp` to establish a
 * Supabase session.
 */
export const kingschatLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { accessToken: string }) => ({
    accessToken: z.string().min(1).parse(d.accessToken),
  }))
  .handler(async ({ data }) => {
    // 1. Fetch profile with the access token returned by the SDK
    const profRes = await fetch(KINGSCHAT_PROFILE_URL, {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });
    if (!profRes.ok) {
      const text = await profRes.text();
      throw new Error(`KingsChat profile fetch failed (${profRes.status}): ${text.slice(0, 200)}`);
    }
    const profJson = (await profRes.json()) as any;
    const p = profJson?.profile ?? profJson?.user ?? profJson ?? {};
    const username: string | undefined =
      p.username || p.user_name || p.userName || p.handle || p.name;
    if (!username) throw new Error("KingsChat profile missing username");
    const displayName: string =
      p.name ||
      [p.first_name, p.last_name].filter(Boolean).join(" ").trim() ||
      p.full_name ||
      username;
    const avatarUrl: string | null =
      p.avatar_url ||
      p.avatarUrl ||
      p.profile_picture ||
      p.profilePicture ||
      p.picture ||
      p.avatar ||
      null;

    const email = `${String(username).toLowerCase().replace(/[^a-z0-9._-]/g, "")}@kingschat.online`;

    // 2. Find or create Supabase user (auto-confirmed)
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let userId: string | null = null;
    {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (error) throw error;
      const found = list.users.find((u) => (u.email || "").toLowerCase() === email);
      if (found) userId = found.id;
    }
    if (!userId) {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: displayName, avatar_url: avatarUrl, kingschat_username: username },
      });
      if (error) throw error;
      userId = created.user!.id;
    }

    // 3. Upsert profile
    await supabaseAdmin
      .from("profiles")
      .upsert(
        { id: userId, email, display_name: displayName, avatar_url: avatarUrl, kingschat_username: username } as any,
        { onConflict: "id" },
      );

    // 4. Generate magiclink hashed_token for client-side verifyOtp
    const { data: link, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr) throw linkErr;
    const hashedToken = (link as any)?.properties?.hashed_token as string | undefined;
    if (!hashedToken) throw new Error("Failed to generate sign-in token");

    return { email, hashedToken };
  });
