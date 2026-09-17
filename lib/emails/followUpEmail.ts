import { APP_NAME } from "@/lib/config";
import { renderEmailLayout } from "./layout";

export interface FollowUpEmailParams {
  speechTypeLabel: string;
  coupleNames: string;
  speechUrl: string;
  unsubscribeUrl: string;
}

// Marketing — carries the unsubscribe link BUILD_PLAN.md's Milestone 7
// prompt requires (see Milestone 7 plan).
export function followUpEmail(params: FollowUpEmailParams): {
  subject: string;
  html: string;
} {
  const subject = "Your speech preview is waiting";

  const html = renderEmailLayout({
    previewText: `Pick up your ${params.speechTypeLabel} speech for ${params.coupleNames}.`,
    bodyHtml: `
      <h1 style="font-size:18px; margin:0 0 12px;">Still thinking it over?</h1>
      <p style="font-size:14px; line-height:1.6; margin:0 0 16px;">
        You started a ${params.speechTypeLabel} speech for ${params.coupleNames}
        but haven't unlocked the full version yet. It's still waiting for you.
      </p>
      <a href="${params.speechUrl}" style="display:inline-block; background-color:#e11d48; color:#ffffff; text-decoration:none; font-weight:600; font-size:14px; padding:12px 20px; border-radius:12px;">
        View your preview
      </a>
    `,
    footerHtml: `
      ${APP_NAME} &middot;
      <a href="${params.unsubscribeUrl}" style="color:#71717a;">Unsubscribe from these emails</a>
    `,
  });

  return { subject, html };
}
