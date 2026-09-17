# CLAUDE.md — Wedding Speech Writer

Read this file at the start of every session. It describes what we are building, for whom, and the rules for building it. If a request conflicts with this file, ask before proceeding.

## 1. The product

**Working name:** Toastwise (placeholder — check domain availability before launch; keep the name in one config constant so it's easy to change).

**One-line pitch:** Answer a few questions about the couple and get a polished, personal wedding speech in minutes, ready to deliver.

**Who it's for:** UK adults (25–45) who have been asked to give a wedding speech, feel nervous, and don't know where to start. They are on their phone, short on time, and happy to pay once for something that works.

**The job the app does:** Turn the user's real memories and details into a finished speech with the right structure, length, and tone, plus help delivering it.

**What makes it better than a free chatbot:**
- A guided questionnaire that pulls out the stories that make a speech good
- Speech structures built for each role (best man, maid of honour, etc.)
- Exact length control based on speaking time
- Printable cue cards and delivery notes
- Section-by-section editing without starting over

## 2. MVP scope (build this, nothing more)

Speech types:
1. Best man
2. Maid of honour
3. Father of the bride
4. Groom

Out of scope for MVP (later): mother of the bride, bride, same-sex couple wording variants beyond neutral options, retirement/birthday toasts, voice coaching, mobile apps, multiple languages.

## 3. User flow

1. **Landing page** → clear promise, example speech snippet, pricing, "Start my speech" button
2. **Choose speech type**
3. **Questionnaire** (one question per screen, progress bar, can go back). No login required.
   - Names: speaker, couple, how speaker knows them
   - Relationship history: how long, how they met
   - 2–3 stories or memories (free text, with prompts like "a time they made you laugh")
   - What the partner brought to their life
   - Tone: funny / heartfelt / balanced
   - Length: 3, 5, or 7 minutes
   - Things to avoid (exes, in-jokes, sensitive family topics)
   - Audience notes (grandparents present, mostly friends, etc.)
   - UK or US English (default UK)
4. **Email capture** right before generating: "Where should we send your speech?" → magic-link account created in the background
5. **Generate** → stream the speech
6. **Preview** → first ~30% readable, the rest blurred, with the paywall
7. **Pay** (Stripe Checkout, one-time)
8. **Unlocked speech page** → full text, section editing, regenerate a section, download PDF cue cards, delivery notes

## 4. Pricing

| Plan | Price | Includes |
|---|---|---|
| Standard | £19 | Full speech, 3 section revisions, PDF download |
| Premium | £29 | Unlimited revisions for 30 days, 2 alternative openings, printable cue cards, delivery notes (pauses, timing, where to look up) |

- One-time payments only (no subscriptions in MVP)
- 14-day money-back guarantee, stated on the pricing page
- Store prices in a single config file, not scattered across components

## 5. Tech stack

- **Framework:** Next.js (latest stable, App Router), TypeScript in strict mode
- **Styling:** Tailwind CSS, mobile-first (most users are on phones)
- **Auth + database:** Supabase (magic-link email login, Postgres, Row Level Security ON for every table)
- **Payments:** Stripe Checkout (mode: payment) + webhooks
- **AI:** Anthropic API via the official TypeScript SDK. Model name comes from the `ANTHROPIC_MODEL` env var, never hard-coded
- **Email:** Resend (receipts, magic links if not using Supabase's, follow-ups)
- **PDF:** generate server-side (e.g. @react-pdf/renderer)
- **Analytics:** PostHog
- **Hosting:** Vercel, code on GitHub

Ask before adding any dependency not listed here.

## 6. Data model (Supabase)

- `profiles` — id (= auth user id), email, created_at
- `speeches` — id, user_id, speech_type, answers (jsonb), content (text), sections (jsonb), status (`draft` | `generated` | `paid`), plan (`none` | `standard` | `premium`), revisions_used (int), paid_at, created_at
- `payments` — id, user_id, speech_id, stripe_session_id (unique), amount_pence, currency, status, created_at
- `usage_limits` — user_id or ip_hash, date, generations_count

Every table has Row Level Security so users can only read their own rows.

## 7. Critical rules

### Security and the paywall
- **Never send the full unpaid speech to the browser.** The server stores the full text and returns only the preview portion until `status = 'paid'`. Blurring on the client alone is not a paywall.
- All API keys stay server-side. Never prefix secrets with `NEXT_PUBLIC_`.
- Never commit `.env` files. Keep `.env.example` up to date with variable names only.
- Mark a speech as paid **only** from the verified Stripe webhook (`checkout.session.completed`), never from the success-page redirect. Handle webhooks idempotently using `stripe_session_id`.

### Cost and abuse limits
- Max 2 free generations per email per day, and 5 per IP per day
- Cap output length in every API call
- Enforce revision limits server-side by plan
- Log token usage per generation so we can see cost per speech

### AI writing rules (the system prompt must enforce these)
- Use only facts and stories the user provided. Never invent names, events, or memories. Where a detail is missing, insert a clear placeholder like `[ADD: the name of the pub]`.
- Structure: opening hook → who I am → stories → tribute to the partner/marriage → wishes → toast
- Length: about 130 spoken words per minute (3 min ≈ 400 words, 5 min ≈ 650, 7 min ≈ 900)
- Keep humour warm, never cruel. No references to exes, sex, heavy drinking, or topics the user listed to avoid.
- UK English spelling and wedding customs by default
- Return structured output (JSON with named sections) so sections can be edited individually

### Code quality
- Small, focused components and server functions
- Validate all user input with Zod on the server
- Loading, error, and empty states for every screen
- Run `npm run lint` and `npm run build` before saying a task is done
- After each milestone, summarise what changed and what to test manually

## 8. Environment variables

```
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STANDARD=
STRIPE_PRICE_PREMIUM=
RESEND_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
```

## 9. Pages

- `/` — landing
- `/create` — choose speech type
- `/create/[type]` — questionnaire
- `/speech/[id]` — preview or unlocked speech
- `/account` — my speeches
- `/pricing`
- `/speeches/[slug]` — SEO guide pages (e.g. best-man-speech-guide)
- `/privacy`, `/terms`, `/refunds`

## 10. UK compliance basics

- Privacy policy and terms before taking payments
- Cookie consent banner if analytics sets non-essential cookies
- At checkout, a checkbox where the user agrees to immediate access to digital content (this affects cancellation rights under UK consumer law — the owner will get the wording checked)
- Clear refund policy matching the 14-day guarantee

## 11. Analytics events to track

`landing_viewed`, `speech_started`, `question_completed`, `email_captured`, `speech_generated`, `paywall_viewed`, `checkout_started`, `payment_completed`, `pdf_downloaded`, `revision_used`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
