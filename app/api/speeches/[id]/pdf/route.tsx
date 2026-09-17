import { NextResponse, type NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { speechSectionSchema } from "@/lib/ai/generateSpeech";
import { questionnaireSchema } from "@/lib/schemas/questionnaire";
import { getSpeechType } from "@/lib/speechTypes";
import { SpeechDocument } from "@/lib/pdf/SpeechDocument";

const sectionsSchema = z.array(speechSectionSchema);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { data: speech } = await admin
    .from("speeches")
    .select("speech_type, answers, sections, status")
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

  const sections = sectionsSchema.parse(speech.sections);
  const answers = questionnaireSchema.parse(speech.answers);
  const speechType = getSpeechType(speech.speech_type);

  const buffer = await renderToBuffer(
    <SpeechDocument
      title={`${speechType?.label ?? "Wedding"} speech`}
      subtitle={`For ${answers.partnerAName} & ${answers.partnerBName}`}
      sections={sections}
    />,
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="speech-${id}.pdf"`,
    },
  });
}
