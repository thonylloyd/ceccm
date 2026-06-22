import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const KINGSCHAT_CLIENT_ID = "376728a5-9c63-4857-b923-661ab96f160e";
export const KINGSCHAT_AUTH_URL = "https://accounts.kingsch.at/";
export const KINGSCHAT_TOKEN_URL = "https://connect.kingsch.at/oauth2/token";
export const KINGSCHAT_PROFILE_URL = "https://connect.kingsch.at/developer/api/profile";

/**
 * Exchanges a KingsChat OAuth `code` for an access token, fetches the user's
 * profile, provisions a Supabase user using `{username}@kingschat.online`, and
 * returns a magiclink hashed token the client uses with `verifyOtp` to sign in.
 */
export const kingschatLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { code: string; redirectUri: string }) => ({
    code: z.string().min(1).parse(d.code),
    redirectUri: z.string().url().parse(d.redirectUri),
  }))
  .handler(async ({ data }) => {
    // 1. Exchange code for access token
    const tokenRes = await fetch(KINGSCHAT_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: data.code,
        client_id: KINGSCHAT_CLIENT_ID,
        redirect_uri: data.redirectUri,
      }).toString(),
    });
    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      throw new Error(`KingsChat token exchange failed (${tokenRes.status}): ${text.slice(0, 200)}`);
    }
    const tokenJson = (await tokenRes.json()) as { access_token?: string; accessToken?: string };
    const accessToken = tokenJson.access_token || tokenJson.accessToken;
    if (!accessToken) throw new Error("KingsChat token response missing access_token");

    // 2. Fetch profile
    const profRes = await fetch(KINGSCHAT_PROFILE_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
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

    // 3. Find or create Supabase user (auto-confirmed)
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let userId: string | null = null;
    // Find by paging admin.listUsers (no direct email lookup in older types).
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

    // 4. Upsert profile (display name + avatar)
    await supabaseAdmin
      .from("profiles")
      .upsert(
        { id: userId, email, display_name: displayName, avatar_url: avatarUrl },
        { onConflict: "id" },
      );

    // 5. Generate a magiclink and return its hashed token for client-side verifyOtp
    const { data: link, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr) throw linkErr;
    const hashedToken = (link as any)?.properties?.hashed_token as string | undefined;
    if (!hashedToken) throw new Error("Failed to generate sign-in token");

    return { email, hashedToken };
  });
