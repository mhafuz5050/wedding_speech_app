import "server-only";
import { PostHog } from "posthog-node";

// Never throws — a PostHog outage or missing key must never break the
// feature it's instrumenting (see Milestone 8 plan).
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) return;

  try {
    const client = new PostHog(apiKey, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    });
    // captureImmediate resolves once the event is actually sent — the
    // right choice for a short-lived serverless function invocation,
    // which won't stick around long enough for a background flush timer.
    await client.captureImmediate({ distinctId, event, properties });
    await client._shutdown();
  } catch (error) {
    console.error(`Failed to capture PostHog event "${event}"`, error);
  }
}
