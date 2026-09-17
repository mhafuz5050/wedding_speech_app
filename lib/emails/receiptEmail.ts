import { APP_NAME } from "@/lib/config";
import { renderEmailLayout } from "./layout";

export interface ReceiptEmailParams {
  speechTypeLabel: string;
  coupleNames: string;
  speechUrl: string;
  planLabel: string;
  amountFormatted: string;
}

// Transactional — always sent regardless of marketing_opt_out, no
// unsubscribe link (see Milestone 7 plan).
export function receiptEmail(params: ReceiptEmailParams): {
  subject: string;
  html: string;
} {
  const subject = `Your ${params.speechTypeLabel} speech is ready`;

  const html = renderEmailLayout({
    previewText: `Your ${params.speechTypeLabel} speech for ${params.coupleNames} is unlocked.`,
    bodyHtml: `
      <h1 style="font-size:18px; margin:0 0 12px;">Thanks for your purchase!</h1>
      <p style="font-size:14px; line-height:1.6; margin:0 0 16px;">
        You paid ${params.amountFormatted} for the ${params.planLabel} plan.
        Your ${params.speechTypeLabel} speech for ${params.coupleNames} is
        fully unlocked — edit any section, download a PDF, and more.
      </p>
      <a href="${params.speechUrl}" style="display:inline-block; background-color:#e11d48; color:#ffffff; text-decoration:none; font-weight:600; font-size:14px; padding:12px 20px; border-radius:12px;">
        View your speech
      </a>
      <p style="font-size:12px; line-height:1.6; color:#71717a; margin:20px 0 0;">
        ${APP_NAME}
      </p>
    `,
  });

  return { subject, html };
}
