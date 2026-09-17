import type { Metadata } from "next";
import { APP_NAME } from "@/lib/config";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: `Privacy Policy — ${APP_NAME}`,
  description: `How ${APP_NAME} collects, uses, and protects your data.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="[OWNER TO COMPLETE: date]">
      <p>
        This policy explains what personal data {APP_NAME} collects, why, and
        what your rights are. It&apos;s a template — <strong>[OWNER TO COMPLETE]</strong>{" "}
        markers show where you need to add your own details before this goes
        live, and you should have the wording checked by someone qualified
        before relying on it.
      </p>

      <h2>Who we are</h2>
      <p>
        {APP_NAME} is operated by <strong>[OWNER TO COMPLETE: legal business name]</strong>,
        registered at <strong>[OWNER TO COMPLETE: registered address]</strong>. Our
        ICO registration number is <strong>[OWNER TO COMPLETE]</strong>. You can
        contact us about privacy matters at{" "}
        <strong>[OWNER TO COMPLETE: privacy contact email]</strong>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Your email address, used to create your account and send you your speech.</li>
        <li>
          The names, dates, relationship details, and stories you enter in the
          questionnaire — this is used to write your speech and isn&apos;t
          shared beyond what&apos;s described below.
        </li>
        <li>The speech text generated for you, and any edits you make to it.</li>
        <li>
          Payment records (amount, plan, and payment status) — we never see
          or store your card details; Stripe handles that directly.
        </li>
        <li>
          Basic technical data (a hashed version of your IP address) used
          only to prevent abuse of free speech generation.
        </li>
        <li>
          Analytics data about how you use the site, but only if you accept
          cookies in the banner shown on your first visit.
        </li>
      </ul>

      <h2>Why we use it, and who we share it with</h2>
      <p>We use a small number of service providers to run {APP_NAME}:</p>
      <ul>
        <li><strong>Supabase</strong> — hosts our database and handles sign-in.</li>
        <li>
          <strong>Anthropic</strong> — your questionnaire answers are sent to
          Anthropic&apos;s API to generate your speech text.
        </li>
        <li><strong>Stripe</strong> — processes payments.</li>
        <li><strong>Resend</strong> — sends your receipt and account emails.</li>
        <li>
          <strong>PostHog</strong> — analytics, only active if you accept
          cookies.
        </li>
      </ul>
      <p>
        Some of these providers may process data outside the UK/EEA.{" "}
        <strong>
          [OWNER TO COMPLETE: confirm what safeguards apply, e.g. standard
          contractual clauses, for each provider used outside the UK/EEA]
        </strong>
      </p>

      <h2>How long we keep it</h2>
      <p>
        <strong>
          [OWNER TO COMPLETE: state your retention period, e.g. for as long as
          your account is active, plus how long after account deletion]
        </strong>
      </p>

      <h2>Your rights</h2>
      <p>
        Under UK GDPR you can ask us to access, correct, delete, or export
        your data, or object to how we use it. Contact{" "}
        <strong>[OWNER TO COMPLETE: privacy contact email]</strong> to do any
        of this. If you&apos;re unhappy with our response, you can complain to
        the{" "}
        <a
          href="https://ico.org.uk"
          className="text-rose-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Information Commissioner&apos;s Office (ICO)
        </a>
        .
      </p>

      <h2>Cookies</h2>
      <p>
        We use essential cookies to keep you signed in, and — only if you
        accept the cookie banner — analytics cookies from PostHog to
        understand how the site is used.
      </p>

      <h2>Children</h2>
      <p>{APP_NAME} is not intended for anyone under 18.</p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time; the &quot;last
        updated&quot; date at the top will always reflect the latest version.
      </p>
    </LegalPage>
  );
}
