# Toastwise

Wedding speech writer. See `CLAUDE.md` for the full product spec and
`BUILD_PLAN.md` for the milestone-by-milestone build plan.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup (needed for the waitlist form)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_waitlist.sql` — this
   creates the `waitlist` table with row level security enabled, allowing
   anonymous inserts only (no public read access).
3. In your Supabase project settings, copy the project URL and the `anon`
   public key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```
4. Restart `npm run dev` and submit the waitlist form — the email should
   appear in the `waitlist` table in the Supabase table editor.

## Scripts

- `npm run dev` — start the dev server
- `npm run lint` — run ESLint
- `npm run build` — production build
