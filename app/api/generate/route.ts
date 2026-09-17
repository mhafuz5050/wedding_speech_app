import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSpeechType } from "@/lib/speechTypes";
import { questionnaireSchema } from "@/lib/schemas/questionnaire";
import { getOrCreateUserByEmail } from "@/lib/auth/getOrCreateUserByEmail";
import { checkUsageLimit, recordUsage, hashIp } from "@/lib/usageLimits";
import { generateSpeech } from "@/lib/ai/generateSpeech";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { joinSections } from "@/lib/speechContent";
import { captureServerEvent } from "@/lib/posthog/server";

const requestSchema = z.object({
  speechType: z.string(),
  email: z.string().trim().toLowerCase().email(),
  answers: questionnaireSchema,
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { speechType: speechTypeSlug, email, answers } = parsed.data;
  const speechType = getSpeechType(speechTypeSlug);
  if (!speechType) {
    return NextResponse.json({ error: "Unknown speech type." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = hashIp(ip);

  let userId: string;
  try {
    userId = await getOrCreateUserByEmail(email);
  } catch (error) {
    console.error("Failed to resolve user for email", error);
    return NextResponse.json(
      { error: "We couldn't process that email address. Please try again." },
      { status: 500 },
    );
  }

  await captureServerEvent(userId, "email_captured", { speechType: speechTypeSlug });

  const usage = await checkUsageLimit({ userId, ipHash });
  if (!usage.allowed) {
    const message =
      usage.reason === "email"
        ? "You've reached today's free limit for this email address. Please try again tomorrow."
        : "Too many speeches have been generated from this network today. Please try again tomorrow.";
    return NextResponse.json({ error: message }, { status: 429 });
  }

  let result;
  try {
    result = await generateSpeech({ speechTypeLabel: speechType.label, answers });
  } catch (error) {
    console.error("Anthropic generation failed", error);
    return NextResponse.json(
      { error: "Something went wrong writing your speech. Please try again." },
      { status: 502 },
    );
  }

  const content = joinSections(result.sections);

  const admin = createSupabaseAdminClient();
  const { data: speech, error: insertError } = await admin
    .from("speeches")
    .insert({
      user_id: userId,
      speech_type: speechTypeSlug,
      answers,
      content,
      sections: result.sections,
      status: "generated",
      plan: "none",
    })
    .select("id")
    .single();

  if (insertError || !speech) {
    console.error("Failed to save speech", insertError);
    return NextResponse.json(
      { error: "Your speech was written but couldn't be saved. Please try again." },
      { status: 500 },
    );
  }

  await admin.from("generation_logs").insert({
    speech_id: speech.id,
    input_tokens: result.inputTokens,
    output_tokens: result.outputTokens,
  });

  await recordUsage({ userId, ipHash });

  await captureServerEvent(userId, "speech_generated", {
    speechId: speech.id,
    speechType: speechTypeSlug,
  });

  return NextResponse.json({ speechId: speech.id, sections: result.sections });
}
