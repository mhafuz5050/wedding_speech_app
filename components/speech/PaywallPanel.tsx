import { PRICING } from "@/lib/config";

const plans = [PRICING.standard, PRICING.premium];

export function PaywallPanel() {
  return (
    <section className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-rose-200 bg-rose-50 p-6">
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
            key={plan.label}
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
              type="button"
              disabled
              title="Payments are wired up in the next milestone"
              className="rounded-xl bg-rose-600 px-5 py-3 text-base font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              Unlock for £{plan.price}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
