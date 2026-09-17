import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { speechSectionSchema } from "@/lib/ai/generateSpeech";
import { questionnaireSchema } from "@/lib/schemas/questionnaire";
import { getSpeechType } from "@/lib/speechTypes";
import { joinSections } from "@/lib/speechContent";
import { canRevise } from "@/lib/revisionLimits";
import { rewriteSection } from "@/lib/ai/rewriteSection";
import { captureServerEvent } from "@/lib/posthog/server";

const sectionsSchema = z.array(speechSectionSchema);
const bodySchema = z.object({ instruction: z.string().trim().max(500).optional() });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> },
) {
  const { id, sectionId } = await params;

  const parsedBody = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: speech } = await admin
    .from("speeches")
    .select("user_id, speech_type, answers, sections, status, plan, revisions_used, paid_at")
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

  const revisionCheck = canRevise({
    plan: speech.plan,
    revisions_used: speech.revisions_used,
    paid_at: speech.paid_at,
  });
  if (!revisionCheck.allowed) {
    return NextResponse.json({ error: revisionCheck.reason }, { status: 403 });
  }

  const sections = sectionsSchema.parse(speech.sections);
  const index = sections.findIndex((section) => section.id === sectionId);
  if (index === -1) {
    return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  }

  const speechType = getSpeechType(speech.speech_type);
  const answers = questionnaireSchema.parse(speech.answers);

  let result;
  try {
    result = await rewriteSection({
      speechTypeLabel: speechType?.label ?? speech.speech_type,
      answers,
      sectionTitle: sections[index].title,
      currentContent: sections[index].content,
      instruction: parsedBody.data.instruction,
    });
  } catch (error) {
    console.error("Section rewrite failed", error);
    return NextResponse.json(
      { error: "Something went wrong rewriting that section. Please try again." },
      { status: 502 },
    );
  }

  sections[index] = { ...sections[index], content: result.content };
  const content = joinSections(sections);
  const revisionsUsed = speech.revisions_used + 1;

  const { error: updateError } = await admin
    .from("speeches")
    .update({ sections, content, revisions_used: revisionsUsed })
    .eq("id", id);

  if (updateError) {
    console.error("Failed to save rewritten section", updateError);
    return NextResponse.json(
      { error: "Couldn't save the rewrite. Please try again." },
      { status: 500 },
    );
  }

  await Promise.all([
    admin.from("generation_logs").insert({
      speech_id: id,
      input_tokens: result.inputTokens,
      output_tokens: result.outputTokens,
    }),
    captureServerEvent(speech.user_id, "revision_used", {
      speechId: id,
      sectionId,
      plan: speech.plan,
      revisionsUsed,
    }),
  ]);

  return NextResponse.json({
    section: sections[index],
    revisionsUsed,
  });
}
