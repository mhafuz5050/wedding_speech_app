import { PRICING } from "@/lib/config";

const plans = [
  { key: "standard", ...PRICING.standard },
  { key: "premium", ...PRICING.premium },
] as const;

interface PaywallPanelProps {
  speechId: string;
}

export function PaywallPanel({ speechId }: PaywallPanelProps) {
  return (
    <form
      action="/api/checkout"
      method="POST"
      className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-rose-200 bg-rose-50 p-6"
    >
      <input type="hidden" name="speechId" value={speechId} />

      <div className="text-center">
        <h2 className="text-lg font-bold text-zinc-900">
          Unlock your full speech
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Pay once. No subscription. 14-day money-back guarantee.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5"
          >
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                {plan.label}
              </h3>
              <p className="mt-1 text-2xl font-bold text-zinc-900">
                £{plan.price}
              </p>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-zinc-600">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span aria-hidden className="text-rose-600">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="submit"
              name="plan"
              value={plan.key}
              className="rounded-xl bg-rose-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-rose-700"
            >
              Unlock for £{plan.price}
            </button>
          </div>
        ))}
      </div>

      <label className="flex items-start gap-3 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4 accent-rose-600"
        />
        <span>
          I agree to get immediate access to this digital content, and
          understand this means I give up my 14-day right to cancel once
          my speech is unlocked.
        </span>
      </label>
    </form>
  );
}
