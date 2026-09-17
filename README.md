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
   (`0001_waitlist.sql`, `0002_speeches.sql`, `0003_payments.sql`). This
   creates the `waitlist`, `profiles`, `speeches`, `usage_limits`,
   `generation_logs`, and `payments` tables, all with row level security
   enabled.
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
and you land on `/speech/[id]`, which shows the first ~30% of the text
(the rest is locked behind the paywall until payment). The system prompt
that controls how speeches are written lives in `lib/ai/systemPrompt.ts`.

## Stripe setup (needed to unlock speeches)

1. In the [Stripe dashboard](https://dashboard.stripe.com) (test mode),
   create two products: Standard (£19) and Premium (£29), each with a
   one-time price. Copy their price IDs into `.env.local`:
   ```
   STRIPE_SECRET_KEY=
   STRIPE_PRICE_STANDARD=
   STRIPE_PRICE_PREMIUM=
   ```
2. Set `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000` locally) —
   Stripe Checkout redirects back here after payment.
3. **Testing the webhook locally**, using the [Stripe CLI](https://docs.stripe.com/stripe-cli):
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   This prints a webhook signing secret (`whsec_...`) — put it in
   `.env.local` as `STRIPE_WEBHOOK_SECRET` and restart `npm run dev`.
4. Open a speech's preview page, agree to the consent checkbox, and click
   "Unlock". On Stripe's test checkout, pay with card `4242 4242 4242 4242`,
   any future expiry date, and any CVC. The `stripe listen` terminal shows
   the webhook firing; once it succeeds, the success page automatically
   moves on to the unlocked speech.
5. To test the webhook without a full checkout, run
   `stripe trigger checkout.session.completed`.

## Scripts

- `npm run dev` — start the dev server
- `npm run lint` — run ESLint
- `npm run build` — production build
