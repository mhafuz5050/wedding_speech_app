import { PRICING } from "@/lib/config";

const plans = [PRICING.standard, PRICING.premium];

export function PricingPreview() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          Simple, one-time pricing
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Pay once. No subscription. 14-day money-back guarantee.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.label}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">
                {plan.label}
              </h3>
              <p className="mt-1 text-3xl font-bold text-zinc-900">
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
          </div>
        ))}
      </div>
    </section>
  );
}
