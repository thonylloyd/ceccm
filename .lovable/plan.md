## Scope

This is a very large spec — 15 modules touching auth, RBAC, a new Portal, a weekly reporting system, church hierarchy, LMS, analytics, homepage additions, and export tooling. I'll deliver in phases so each phase ships working and reviewable. Confirm the phase order below (or reorder) before I start.

---

## Phase 1 — Roles, Portal shell, hierarchy data model

**Roles migration (Modules 2, 8):**
- Rename enum: `super_admin` → `site_maintenance`, `viewer` → `super_admin`. Add new `admin` stays as-is. Add `member`, `zonal_pastor`, `group_pastor`, `church_pastor`, `external_pastor`.
- Existing site_maintenance user preserved (was super_admin).
- New auth signups auto-assigned `member` via `handle_new_user` trigger.
- Update all `is_super_admin` / `is_admin` SQL helpers + RLS policies to the renamed enum.
- Update admin sidebar labels & permissions matrix references.

**Church hierarchy tables (Module 7):**
- `zones (name, description)`
- `group_churches (name, zone_id)`
- `churches (name, group_church_id)`
- `pastor_assignments (user_id, role, zone_id?, group_church_id?, church_id?)` — drives report visibility.
- RLS + grants + admin CRUD pages under `/admin/zones`, `/admin/group-churches`, `/admin/churches`, `/admin/assignments`.

**Portal shell (Module 1):**
- New pathless layout `src/routes/_portal/route.tsx` gating `/portal/*` to allowed roles; unauth → `/auth`, unauthorized role → `/portal/access-denied`.
- Portal dashboard `/portal` renders a role-specific dashboard component (stub cards for each role in Phase 1; real widgets in later phases).
- "Portal" link added to `UserMenu` when user has portal-eligible role.

**Profile modal (Module 8):**
- Zone dropdown sourced from `zones` table.
- Designation adds: Church Coordinator, Group Pastor, Zonal Pastor.

---

## Phase 2 — Weekly reporting system (Modules 5, 6, 14)

- `weekly_reports` table with numerical growth fields + membership effectiveness fields (added_this_week, current_total pairs) + `filled_with_spirit_added`, auto-captured week/month/year, `reporter_id`, `church_id`, `group_church_id`, `zone_id`, submission timestamp, `status` (draft/submitted/approved).
- RLS enforcing hierarchy visibility (church pastor → own; group pastor → churches in group; zonal → group churches in zone; admin/site maintenance → all).
- `has_permission` extended for `reports:submit|edit|view|export|delete|approve`.
- Report submission forms on Church Pastor / Group Pastor / Zonal Pastor / External Pastor portal dashboards.
- Edit-own-while-unapproved logic. Approval action for admin/site maintenance.
- Export helpers (CSV first; Excel/PDF/Print in Phase 5).

---

## Phase 3 — Resource Center / LMS (Module 9)

- `/resource` public entry + gated per-course access.
- Tables: `resource_categories`, `courses`, `lessons` (pdf/video/audio/slides/quiz), `quiz_questions`, `enrollments`, `lesson_progress`, `quiz_attempts`, `certificates`.
- Reuse existing access modes (free/password/paid/password_paid) at course level.
- Progress tracking, "Continue learning", completion, auto certificate (client-rendered PDF).
- Admin CMS for courses/lessons/categories.

---

## Phase 4 — Analytics dashboard (Module 11)

- `/portal/analytics` (role-gated). Charts via `recharts` (already common in shadcn ecosystem — install if missing).
- Aggregations from `weekly_reports` grouped by week/month/quarter/year and by zone/group/church.
- KPIs, top performers, filters, CSV export.

---

## Phase 5 — Polish & remaining features

- **Offline reporting (Module 10):** IndexedDB queue (`idb` package), background sync on `online` event, dedupe via client-generated report UUID + unique constraint on (reporter_id, week, year, church_id).
- **Announcements slider (Module 12):** `announcements` table (title, body_rich, image_url, priority, expires_at, is_active) + `AnnouncementsSlider` component on homepage + admin CMS.
- **Programs calendar view (Module 13):** month calendar on `/programs` fed from existing `programs` table.
- **Export formats (Module 14):** add xlsx (`xlsx` pkg), PDF (`jspdf` + autotable), print stylesheet.
- **Permissions matrix expansion (Module 15):** seed all new permission keys, expose in `/admin/permissions`.

---

## Technical details

- Migrations grouped per phase (schema + grants + RLS + policy in same migration per new public table).
- All new server logic via `createServerFn` with `requireSupabaseAuth` + `has_permission` checks.
- New portal routes under `src/routes/_portal/` (pathless layout, `ssr: false`, redirect to `/auth`).
- Existing `/admin` unchanged in structure; new admin pages added for hierarchy, courses, announcements.
- Renames update TypeScript enums via regenerated `types.ts` after migration approval.

---

## Confirm before I start

1. **Phase order OK?** Or do you want a specific module first (e.g., reporting before LMS)?
2. **Role rename impact:** Existing `admin` users keep the `admin` role and its current permissions — confirm.
3. **Announcements rich text:** OK with a simple markdown/HTML textarea, or need a full WYSIWYG editor?
4. **Certificates:** client-side PDF (name + course + date on a template) — acceptable, or need admin-designed templates?

Reply "go" (with any adjustments) and I'll start Phase 1.