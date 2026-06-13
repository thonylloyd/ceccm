## Scope

Big batch of changes across homepage, About page, Admin CMS, and Livestream/Videos access control. Grouped below.

---

### 1. Homepage — Mission section

- Add admin-controlled **Mission Statement** (paragraph above the cards).
- Switch Mission cards grid to **4 columns on desktop** (was 3): `md:grid-cols-2 lg:grid-cols-4`.
- Source the mission statement from `site_settings` key `homepage_mission` (`{ title, statement }`).
- Add a new admin sub-tab in **Admin → Homepage → Mission** for editing the statement.

### 2. Homepage — Praise Reports section (new)

- New section between Programs and Resources displaying testimonial quotes (large quote marks, author name, role).
- CMS-managed via new table `praise_reports` (quote, author, role, display_order, is_active).
- New tab in **Admin → Homepage → Praise Reports** using existing `SectionEditor`.
- Seed the three provided testimonies.

### 3. About Page (`/about`)

- Build complete page with sections: Hero, Who We Are (image left / text right), Leadership (3-card grid, middle elevated), Our Mission (intro + 4 cards), Why We Exist (icon grid/timeline), CTA section.
- Add `head()` with title, description, OG, Twitter, canonical, JSON-LD Organization.
- All content driven by `site_settings` keys + a new `leadership` table.
- New **Admin → About** tab (rebuild existing minimal one) with sub-tabs: Hero, Who We Are, Leadership, Mission Intro, Purpose Statements, CTA, SEO.

### 4. Admin — Livestream Settings: Add CTA button settings

- In `admin/livestream.tsx` Settings sub-tab, add Livestream CTA fields (label, url, bg color, text color, new tab, start/end date) stored in `site_settings.livestream_cta`.
- Surface on `/live` page hero.

### 5. Admin — Livestream device camera/mic broadcasting

- In **Admin → Livestream**, add "Go Live from Browser" panel using `navigator.mediaDevices.getUserMedia` to preview camera/mic.
- Provide RTMP/stream URL fields (record only — actual streaming server is out of scope; admin can paste embed URL once broadcasting elsewhere). Set `is_live` toggle + live preview.
- Note in UI: in-browser broadcast preview only; for distribution paste an embed URL (HLS/YouTube/etc).

### 6. Auth + Paywall on Videos & Livestream

- Require auth to view any video detail page (`/videos/$slug`) and the live player on `/live`.
  - If not signed in, render Sign-in CTA instead of the player.
- Add admin-controlled access mode per video/broadcast:
  - `access_mode`: `free | password | paid`
  - `password` (text, hashed server-side) and `price_espees` (numeric).
- Schema: add columns to `videos` and `broadcasts`: `access_mode`, `access_password_hash`, `price_espees`, plus `video_unlocks(user_id, video_id)` and `broadcast_unlocks(user_id, broadcast_id)` tables to record unlocks.
- Server functions:
  - `unlockVideoWithPassword({slug,password})` → verifies hash, inserts unlock.
  - `recordVideoPurchase({slug})` → placeholder marking paid (Espees integration out of scope, just mark unlocked).
  - Same for broadcasts.
- Gate player rendering on having an unlock row when `access_mode != free`.

### 7. Admin CMS for video/broadcast access

- Videos admin: add Access fields (mode, password, price ESPEES).
- Livestream admin: same fields on broadcast editor.

---

## Technical Details

**Migrations (single migration):**
- `CREATE TABLE public.praise_reports (id uuid pk, quote text, author text, role text, display_order int, is_active bool, created_at, updated_at)` + grants (anon SELECT, authenticated full, service_role all) + RLS (public read active; admin manage).
- `CREATE TABLE public.leadership (id uuid pk, name text, position text, message text, photo_url text, display_order int, is_active bool, is_featured bool, created_at, updated_at)` + grants + RLS.
- `ALTER TABLE videos ADD COLUMN access_mode text default 'free', access_password_hash text, price_espees numeric`.
- `ALTER TABLE broadcasts ADD COLUMN access_mode text default 'free', access_password_hash text, price_espees numeric`.
- `CREATE TABLE video_unlocks (user_id uuid, video_id uuid, created_at, primary key(user_id, video_id))` + RLS (user can read own; service_role manage).
- `CREATE TABLE broadcast_unlocks (...)` same.
- Seed 3 praise reports.

**Frontend:**
- `src/components/site/PraiseReports.tsx`
- `src/components/site/MissionSection.tsx`: add `statement` prop + 4-col grid.
- `src/lib/cms.functions.ts`: extend `getHomepage` to return `praise_reports` + `mission_statement`.
- `src/routes/about.tsx`: full rebuild with loader using new `getAboutPage` server fn.
- `src/lib/about.functions.ts`: server fn returning settings + leadership rows.
- `src/lib/access.functions.ts`: unlock functions using bcrypt-style hash (use Web Crypto SHA-256 to avoid native deps).
- `src/routes/videos.$slug.tsx`: enforce auth + access gate. Add password prompt + unlock button.
- `src/routes/live.tsx`: same auth/access gate around player.

**Admin:**
- `src/routes/_authenticated/admin/about.tsx`: rebuild with tabs.
- `src/routes/_authenticated/admin/homepage.tsx`: add `mission_statement` and `praise_reports` tabs.
- `src/routes/_authenticated/admin/livestream.tsx`: add CTA settings panel + "Browser Camera" tab using getUserMedia preview.
- `src/routes/_authenticated/admin/videos.tsx`: add access fields.

**Notes:**
- Password verified server-side via SHA-256 (no native bcrypt — Worker compat).
- ESPEES "purchase" is placeholder unlock (no payment integration requested).
- About page uses head() per `head-meta` rules with canonical + og:url self-referencing `/about`.

---

## Out of scope (will note to user)

- Real ESPEES payment processing (just unlock placeholder).
- Real RTMP server/WebRTC distribution for browser broadcast (preview + admin embed URL only).
