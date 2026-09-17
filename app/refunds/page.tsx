import type { Metadata } from "next";
import { APP_NAME } from "@/lib/config";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: `Refund Policy — ${APP_NAME}`,
  description: `Our 14-day money-back guarantee, explained.`,
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy" lastUpdated="[OWNER TO COMPLETE: date]">
      <p>
        This is a template — <strong>[OWNER TO COMPLETE]</strong> markers
        show where you need to add your own details before this goes live.
      </p>

      <h2>Our 14-day guarantee</h2>
      <p>
        If you&apos;re not happy with your speech for any reason, email us
        within 14 days of your purchase and we&apos;ll refund you in full —
        no questions asked.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Email <strong>[OWNER TO COMPLETE: refunds contact email]</strong> with
        the email address you used to purchase, and which speech it was for.
        We aim to respond within <strong>[OWNER TO COMPLETE: e.g. 2 business days]</strong>.
      </p>

      <h2>How you&apos;re refunded</h2>
      <p>
        Refunds are returned to the original payment method via Stripe, and
        typically appear within{" "}
        <strong>[OWNER TO COMPLETE: e.g. 5–10 business days]</strong>,
        depending on your bank.
      </p>

      <h2>About your statutory cancellation right</h2>
      <p>
        Because your speech is digital content delivered immediately, UK
        consumer law lets us ask you to give up the standard 14-day statutory
        cancellation right in exchange for instant access — which is what the
        consent checkbox at checkout does. This guarantee is separate from
        that right: it&apos;s a promise we&apos;re making voluntarily, and it
        applies regardless.
      </p>

      <h2>Exceptions</h2>
      <p>
        <strong>
          [OWNER TO COMPLETE: note any circumstances where a refund won&apos;t
          be given, e.g. evidence the guarantee is being used repeatedly to
          get free speeches]
        </strong>
      </p>

      <h2>Contact</h2>
      <p>
        Questions about refunds: <strong>[OWNER TO COMPLETE: contact email]</strong>.
      </p>
    </LegalPage>
  );
}
