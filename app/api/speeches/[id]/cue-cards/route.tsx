import { NextResponse, type NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { speechSectionSchema } from "@/lib/ai/generateSpeech";
import { CueCardsDocument } from "@/lib/pdf/CueCardsDocument";
import { captureServerEvent } from "@/lib/posthog/server";

const sectionsSchema = z.array(speechSectionSchema);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { data: speech } = await admin
    .from("speeches")
    .select("user_id, sections, status, plan")
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
      { error: "Cue cards are a Premium feature." },
      { status: 403 },
    );
  }

  const sections = sectionsSchema.parse(speech.sections);

  const buffer = await renderToBuffer(<CueCardsDocument sections={sections} />);

  await captureServerEvent(speech.user_id, "pdf_downloaded", {
    speechId: id,
    type: "cue_cards",
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cue-cards-${id}.pdf"`,
    },
  });
}
