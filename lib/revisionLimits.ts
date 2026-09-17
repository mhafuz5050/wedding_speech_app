const STANDARD_REVISION_LIMIT = 3;
const PREMIUM_WINDOW_DAYS = 30;

export type RevisionCheckResult =
  | { allowed: true }
  | { allowed: false; reason: string };

// CLAUDE.md §4/§7: Standard gets 3 total revisions; Premium gets
// unlimited revisions for 30 days from paid_at. Only AI "rewrite this
// section" calls are checked here — manual edits are free (see
// Milestone 6 plan).
export function canRevise(speech: {
  plan: string;
  revisions_used: number;
  paid_at: string | null;
}): RevisionCheckResult {
  if (speech.plan === "standard") {
    if (speech.revisions_used < STANDARD_REVISION_LIMIT) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason:
        "You've used all 3 revisions included with Standard. Upgrade to Premium for unlimited revisions.",
    };
  }

  if (speech.plan === "premium") {
    if (!speech.paid_at) {
      return { allowed: false, reason: "This speech hasn't been unlocked yet." };
    }
    const windowEnd = new Date(speech.paid_at);
    windowEnd.setDate(windowEnd.getDate() + PREMIUM_WINDOW_DAYS);
    if (new Date() <= windowEnd) {
      return { allowed: true };
    }
    return { allowed: false, reason: "Your 30-day revision window has ended." };
  }

  return { allowed: false, reason: "This speech hasn't been unlocked yet." };
}
