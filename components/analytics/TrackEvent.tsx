"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/posthog/client";

interface TrackEventProps {
  event: string;
  properties?: Record<string, unknown>;
}

// Fires `event` once on mount. Renders nothing.
export function TrackEvent({ event, properties }: TrackEventProps) {
  useEffect(() => {
    trackEvent(event, properties);
    // Only ever fire once per mount, regardless of prop identity churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
