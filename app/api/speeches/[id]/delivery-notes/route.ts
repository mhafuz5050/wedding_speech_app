import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { speechSectionSchema } from "@/lib/ai/generateSpeech";
import { generateDeliveryNotes } from "@/lib/ai/generateDeliveryNotes";

const sectionsSchema = z.array(speechSectionSchema);

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { data: speech } = await admin
    .from("speeches")
    .select("sections, status, plan, delivery_notes")
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
      { error: "Delivery notes are a Premium feature." },
      { status: 403 },
    );
  }

  if (speech.delivery_notes) {
    return NextResponse.json({ notes: speech.delivery_notes });
  }

  const sections = sectionsSchema.parse(speech.sections);

  let result;
  try {
    result = await generateDeliveryNotes({ sections });
  } catch (error) {
    console.error("Delivery notes generation failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }

  const { error: updateError } = await admin
    .from("speeches")
    .update({ delivery_notes: result.notes })
    .eq("id", id);

  if (updateError) {
    console.error("Failed to save delivery notes", updateError);
  }

  await admin.from("generation_logs").insert({
    speech_id: id,
    input_tokens: result.inputTokens,
    output_tokens: result.outputTokens,
  });

  return NextResponse.json({ notes: result.notes });
}
