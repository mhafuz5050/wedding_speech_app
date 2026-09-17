# Build Plan — Wedding Speech Writer

Follow the milestones in order. Each has: what to do yourself, the prompt to paste into Claude Code, and how to check it works. Don't move on until the check passes.

**Golden rules for working with Claude Code**
- Start each milestone in a fresh session (`/clear`) so it re-reads CLAUDE.md.
- Ask it to **plan first**, read the plan, then say "go".
- Commit to GitHub after every milestone that passes its check.
- If something breaks, paste the exact error message back to Claude Code rather than describing it.

---

## Milestone 0 — Set up accounts and tools (1–2 hours)

**You do this:**
1. Install Node.js (LTS version) and Git.
2. Install Claude Code following the official guide: https://docs.claude.com/en/docs/claude-code/overview
3. Create free accounts: GitHub, Vercel, Supabase, Stripe, Resend, PostHog, Anthropic Console (add £10–20 API credit).
4. Check domain availability for your app name and buy it (don't point it anywhere yet).
5. Create a folder called `toastwise`, put `CLAUDE.md` inside it, open a terminal in that folder, and run `claude`.

---

## Milestone 1 — Landing page + waitlist, deployed (Day 1–2)

The goal is to start collecting interest and posting videos while you build the rest.

**Prompt:**
> Read CLAUDE.md. Scaffold the Next.js project with TypeScript and Tailwind as described. Build only the mobile-first landing page and a waitlist form that saves emails to a Supabase `waitlist` table (with RLS). Include: headline, how it works in 3 steps, an example speech snippet, pricing preview, and FAQ. Create `.env.example`. Plan first and show me the plan before writing code.

**You do this after:**
- Push to GitHub, import the repo into Vercel, add env variables, connect your domain.
- Post 3 short videos pointing to the waitlist.

**Check:** You can sign up on your phone and see the email appear in Supabase.

---

## Milestone 2 — Questionnaire flow (Day 3–4)

**Prompt:**
> Read CLAUDE.md. Build `/create` (choose one of the 4 speech types) and `/create/[type]` (the questionnaire from section 3). One question per screen, progress bar, back button, answers saved in local component state and validated with Zod. Question wording should be friendly and include example answers. No AI and no login yet — at the end, show a summary screen of the answers. Plan first.

**Check:** Complete the flow for all 4 speech types on your phone; the summary shows every answer correctly.

---

## Milestone 3 — Email capture + AI generation (Day 5–7)

**Prompt:**
> Read CLAUDE.md. Add email capture before generation using Supabase magic-link auth, creating the user in the background. Create the `speeches` and `usage_limits` tables with RLS. Build a server route that: checks usage limits, builds the prompt following the AI writing rules in section 7, calls the Anthropic API using `ANTHROPIC_MODEL`, returns structured JSON sections, saves the full speech server-side, and logs token usage. Write the system prompt in its own file so I can edit it easily. Plan first.

**Check:**
- Generate 5 speeches with different tones and lengths. Read them out loud with a timer — are they the right length?
- Leave a detail out on purpose. Does it insert a `[ADD: ...]` placeholder instead of inventing something?
- Try a 3rd generation in one day with the same email — it should be blocked.

**Tip:** Spend real time improving the system prompt here. Speech quality is the whole product.

---

## Milestone 4 — Preview and paywall (Day 8)

**Prompt:**
> Read CLAUDE.md. Build `/speech/[id]`. For unpaid speeches, the server returns only the first ~30% of the text plus section titles; the rest shows as a blurred placeholder (not the real text). Show the two plans from section 4 with a clear call to action. Confirm in your summary that the full text never reaches the browser before payment. Plan first.

**Check:** Open the preview, then open browser developer tools → Network tab. Search the responses for a sentence from the end of the speech. It must not be there.

---

## Milestone 5 — Stripe payments (Day 9–10)

**You do this first:** In Stripe (test mode), create two products — Standard £19 and Premium £29 — and copy their price IDs into your env variables.

**Prompt:**
> Read CLAUDE.md. Add Stripe Checkout for both plans, including the digital-content consent checkbox from section 10. Create the `payments` table. Build the webhook route that verifies the Stripe signature, handles `checkout.session.completed` idempotently, and marks the speech as paid with the correct plan. The success page should show a "confirming payment" state until the webhook has updated the speech. Explain how to test webhooks locally with the Stripe CLI. Plan first.

**Check:**
- Pay with Stripe's test card; the speech unlocks.
- Refresh the success page several times; only one payment row exists.
- Cancel at checkout; the speech stays locked.

---

## Milestone 6 — Unlocked speech: editing, revisions, PDF (Day 11–13)

**Prompt:**
> Read CLAUDE.md. For paid speeches, show the full text by section. Add: edit a section manually, "rewrite this section" with an optional instruction (e.g. "make it funnier"), revision limits enforced server-side by plan, and a PDF download. Premium also gets 2 alternative openings, cue cards (large text, one section per card), and delivery notes. Add `/account` listing the user's speeches. Plan first.

**Check:** Use all 3 Standard revisions — the 4th is blocked with an upgrade message. Print a PDF and check it's readable on paper.

---

## Milestone 7 — Emails (Day 14)

**Prompt:**
> Read CLAUDE.md. Using Resend, send: (1) a payment receipt with a link to the speech, (2) a follow-up email 24 hours after a preview was generated but not paid, with a link back to the preview. Keep emails short, plain, and mobile-friendly. Add an unsubscribe link to marketing emails. Plan first.

**Check:** Trigger both emails to your own address and read them on your phone.

---

## Milestone 8 — Legal pages, SEO pages, analytics (Day 15–16)

**Prompt:**
> Read CLAUDE.md. Add `/privacy`, `/terms`, and `/refunds` page templates with clear placeholders where I must add my details (mark them [OWNER TO COMPLETE]). Add a cookie banner if needed. Add PostHog and track the events in section 11. Build `/speeches/[slug]` with 4 genuinely helpful guide pages, one per speech type (structure, timing, mistakes to avoid, example lines), each ending with a call to action. Add metadata, sitemap, and Open Graph images. Plan first.

**Check:** Every event appears in PostHog after you do a full test purchase. Guide pages look good when shared in WhatsApp.

---

## Milestone 9 — Launch checklist (Day 17)

**You do this:**
- [ ] Register as a sole trader with HMRC (if not already)
- [ ] Pay the ICO data protection fee
- [ ] Complete the privacy policy, terms, and refund pages with your details
- [ ] Upgrade Vercel to Pro (required once the site takes payments)
- [ ] Switch Stripe to live mode; update price IDs, keys, and the webhook secret in Vercel
- [ ] Make one real £19 purchase yourself, then refund it
- [ ] Set a monthly spending limit in the Anthropic Console
- [ ] Email your waitlist with a launch discount code

**Final prompt:**
> Read CLAUDE.md. Do a pre-launch review of the whole codebase: security (secrets, RLS, paywall leak, webhook verification), usage limits, error handling, mobile layout, and page speed. List any problems by severity and fix the critical ones. Plan first.

---

## After launch — first 30 days

- **Daily:** one short video showing the app writing a speech (read out the best line).
- **Weekly:** check PostHog — where do people drop off? Fix the biggest drop-off first.
- **Watch these numbers:** preview → payment rate, cost per speech in API credits, refund rate.
- **Read every speech complaint.** Improving the system prompt is usually the fastest way to raise sales.
