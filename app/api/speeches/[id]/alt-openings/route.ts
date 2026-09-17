import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { questionnaireSchema } from "@/lib/schemas/questionnaire";
import { getSpeechType } from "@/lib/speechTypes";
import { generateAltOpenings } from "@/lib/ai/generateAltOpenings";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { data: speech } = await admin
    .from("speeches")
    .select("speech_type, answers, status, plan, alt_openings")
    .eq("id", id)
    .maybeSingle();

  if (!speech) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (speech.status !== "paid") {
    return NextResponse.json(
      { error: "This speech hasn't been unlocked yet." },
      { status: 403 },
    );
  }
  if (speech.plan !== "premium") {
    return NextResponse.json(
      { error: "Alternative openings are a Premium feature." },
      { status: 403 },
    );
  }

  // Already generated — return the cached result rather than spending
  // more tokens on the same request.
  if (speech.alt_openings) {
    return NextResponse.json({ openings: speech.alt_openings });
  }

  const speechType = getSpeechType(speech.speech_type);
  const answers = questionnaireSchema.parse(speech.answers);

  let result;
  try {
    result = await generateAltOpenings({
      speechTypeLabel: speechType?.label ?? speech.speech_type,
      answers,
    });
  } catch (error) {
    console.error("Alt openings generation failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }

  const { error: updateError } = await admin
    .from("speeches")
    .update({ alt_openings: result.openings })
    .eq("id", id);

  if (updateError) {
    console.error("Failed to save alt openings", updateError);
  }

  await admin.from("generation_logs").insert({
    speech_id: id,
    input_tokens: result.inputTokens,
    output_tokens: result.outputTokens,
  });

  return NextResponse.json({ openings: result.openings });
}
