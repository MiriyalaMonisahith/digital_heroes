# Digital Heroes

A golf performance and charity draw platform — subscribers log Stableford scores, get
automatically entered into a monthly number draw, and route part of their subscription
to a charity they choose.

Built with Next.js (App Router), Supabase (Postgres + Auth + Storage), and Tailwind CSS.
**Payments are mocked** — subscribing activates a demo account instantly, no card or
Stripe integration involved.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4
- Supabase — Postgres, Auth, Storage
- Framer Motion, Recharts, Zod

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a **new** project (per the
   brief, don't reuse a personal/existing one).
2. In the SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql) — this creates
   every table, RLS policy, trigger, and storage bucket the app needs.
3. Optionally run [`supabase/seed.sql`](supabase/seed.sql) to add four sample charities.
4. Under **Project Settings → API**, copy the Project URL, `anon` public key, and
   `service_role` secret key.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the three Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

The `service_role` key is only ever used server-side (listing user emails for the
admin panel, and signed URLs for winner proof screenshots) — never expose it to the
browser.

## 3. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

### Create your first admin

1. Sign up normally through the app (`/signup`).
2. In the Supabase dashboard, go to **Authentication → Users** and copy your new
   user's UUID.
3. In the SQL Editor, run:
   ```sql
   update public.profiles set role = 'admin' where id = '<your-uuid>';
   ```
4. Log out and back in — you'll be redirected to `/admin` instead of `/dashboard`.

## 4. Deploy

1. Push this repo to GitHub (or your VCS of choice).
2. Create a **new** Vercel project (per the brief, not your personal/existing one) and
   import the repo.
3. Add the same three environment variables from `.env.local` in the Vercel project
   settings.
4. Deploy. No build configuration changes are needed — `next build` / `next start`
   work out of the box.

## How the platform resolves the PRD's ambiguity around "draw numbers"

The PRD describes a 5/4/3-number monthly draw but doesn't specify how subscribers get
their numbers. This build ties it directly to score entry: **a subscriber's own last
five Stableford scores (values 1–45) are their numbers for that month**, so there's no
separate "pick your numbers" UI — logging a round is the whole participation flow. See
`lib/draw-engine.ts` for the matching/pool logic this produces.

## Project structure

```
app/(public)/         Marketing site, charity directory
app/(auth)/            Login / signup
app/(dashboard)/       Subscriber area (scores, subscription, draws, winnings)
app/(admin)/            Admin console (users, draws, charities, winners, reports)
lib/actions/            Server actions (mutations), one file per domain
lib/data/                Read helpers used by server components
lib/draw-engine.ts      Pure draw logic: number generation, matching, pool math
supabase/schema.sql      Full DDL, RLS policies, storage buckets
supabase/seed.sql        Sample charity data
```

## Demo mode notes

- Subscribing (`/dashboard/subscription`) is a mock action — it flips the subscription
  to `active` and logs a charity donation record, but no payment gateway is called.
- Winner proof screenshots are stored in a private Supabase Storage bucket
  (`winner-proofs`); admins view them via short-lived signed URLs.
