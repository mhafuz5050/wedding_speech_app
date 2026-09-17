import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ExampleSnippet } from "@/components/landing/ExampleSnippet";
import { PricingPreview } from "@/components/landing/PricingPreview";
import { FAQ } from "@/components/landing/FAQ";
import { TrackEvent } from "@/components/analytics/TrackEvent";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <TrackEvent event="landing_viewed" />
      <Hero />
      <HowItWorks />
      <ExampleSnippet />
      <PricingPreview />
      <FAQ />
    </main>
  );
}
