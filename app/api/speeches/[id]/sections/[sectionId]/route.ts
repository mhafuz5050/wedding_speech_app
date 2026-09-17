import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { speechSectionSchema } from "@/lib/ai/generateSpeech";
import { joinSections } from "@/lib/speechContent";

const sectionsSchema = z.array(speechSectionSchema);
const bodySchema = z.object({ content: z.string().trim().min(1) });

// Manual edits — free, no revision-limit check (see Milestone 6 plan:
// only AI "rewrite this section" counts against revisions_used).
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> },
) {
  const { id, sectionId } = await params;

  const parsedBody = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Section content can't be empty." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: speech } = await admin
    .from("speeches")
    .select("sections, status")
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
  const index = sections.findIndex((section) => section.id === sectionId);
  if (index === -1) {
    return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  }

  sections[index] = { ...sections[index], content: parsedBody.data.content };
  const content = joinSections(sections);

  const { error: updateError } = await admin
    .from("speeches")
    .update({ sections, content })
    .eq("id", id);

  if (updateError) {
    console.error("Failed to save section edit", updateError);
    return NextResponse.json({ error: "Couldn't save your edit. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ section: sections[index] });
}
