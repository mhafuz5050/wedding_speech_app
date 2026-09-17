import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME, PRICING } from "@/lib/config";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: `Terms of Service — ${APP_NAME}`,
  description: `The terms that apply when you use ${APP_NAME}.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="[OWNER TO COMPLETE: date]">
      <p>
        These terms govern your use of {APP_NAME}. This is a template —{" "}
        <strong>[OWNER TO COMPLETE]</strong> markers show where you need to
        add your own details, and you should have the wording checked by
        someone qualified before relying on it, especially the liability
        section.
      </p>

      <h2>The service</h2>
      <p>
        {APP_NAME} turns the answers you give in our questionnaire into a
        written wedding speech, using AI. You can preview part of your
        speech for free; paying unlocks the full text, editing, and
        (depending on plan) extra features.
      </p>

      <h2>Accounts</h2>
      <p>
        We create an account for you automatically using the email address
        you provide — there&apos;s no password. You sign in later via a
        one-time link sent to that email.
      </p>

      <h2>Pricing and payment</h2>
      <p>
        We charge a one-time fee, not a subscription: {PRICING.standard.label}{" "}
        is £{PRICING.standard.price}, {PRICING.premium.label} is £
        {PRICING.premium.price}. Payments are processed by Stripe. Prices may
        change for future purchases; what you paid for a speech you&apos;ve
        already unlocked never changes.
      </p>

      <h2>AI-generated content</h2>
      <p>
        Your speech is written by an AI model based only on what you tell us.
        It can still contain mistakes, so <strong>read it carefully before
        you deliver it</strong> — check every name, date, and detail. We
        don&apos;t guarantee the speech will be free of errors or perfectly
        suited to your event; you&apos;re responsible for reviewing and, if
        needed, editing it before use.
      </p>

      <h2>Your content</h2>
      <p>
        You&apos;re responsible for the accuracy and appropriateness of what
        you submit to us and of the final speech you deliver.{" "}
        <strong>
          [OWNER TO COMPLETE: confirm the ownership/licence terms for the
          generated speech text]
        </strong>
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Don&apos;t submit unlawful, harassing, or defamatory content.</li>
        <li>Don&apos;t try to reverse engineer or resell access to the service.</li>
        <li>Don&apos;t attempt to circumvent the usage or revision limits described on our pricing page.</li>
      </ul>

      <h2>Revisions and cancellation rights</h2>
      <p>
        Revision limits for each plan are described on the pricing section
        of our landing page. At checkout, you&apos;re asked to confirm you
        want immediate access to your digital speech — under the Consumer
        Contracts Regulations, this means you give up the standard 14-day
        right to cancel once that content is unlocked. We still choose to
        offer a voluntary 14-day money-back guarantee regardless — see our{" "}
        <Link href="/refunds" className="text-rose-600 underline">
          Refunds
        </Link>{" "}
        page.
      </p>

      <h2>Liability</h2>
      <p>
        <strong>
          [OWNER TO COMPLETE: add a liability limitation clause appropriate
          for your business, reviewed by a solicitor]
        </strong>
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or close an account that misuses the service, at our
        discretion.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of{" "}
        <strong>[OWNER TO COMPLETE: e.g. England and Wales]</strong>.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time; the &quot;last
        updated&quot; date at the top will always reflect the latest version.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <strong>[OWNER TO COMPLETE: contact email]</strong>.
      </p>
    </LegalPage>
  );
}
