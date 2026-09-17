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

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run every file in `supabase/migrations/` in order
   (`0001_waitlist.sql`, then `0002_speeches.sql`). This creates the
   `waitlist`, `profiles`, `speeches`, `usage_limits`, and
   `generation_logs` tables, all with row level security enabled.
3. In your Supabase project settings (API section), copy these into
   `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```
   The service role key is only ever used server-side (`lib/supabase/admin.ts`)
   to create users and write speeches/usage rows — never expose it to the
   browser.
4. Restart `npm run dev` and submit the waitlist form on `/` — the email
   should appear in the `waitlist` table in the Supabase table editor.

## Anthropic setup (needed to generate speeches)

Add to `.env.local`:
```
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=
```
Then run through `/create`, fill in the questionnaire, and enter an email
on the final step — the generated speech is saved to the `speeches` table
and shown in full on the page. The system prompt that controls how
speeches are written lives in `lib/ai/systemPrompt.ts`.

## Scripts

- `npm run dev` — start the dev server
- `npm run lint` — run ESLint
- `npm run build` — production build
