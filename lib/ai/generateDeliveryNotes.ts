import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { SpeechSection } from "./generateSpeech";

const DELIVERY_NOTES_SYSTEM_PROMPT = `You write short, practical delivery
notes to help someone give a wedding speech well. Base every note on the
actual text you're given — pacing cues, where to pause for laughter or
effect, where to look up from notes and make eye contact with the room,
and timing guidance. Keep it concise and practical, not generic. Reply
only by calling the delivery_notes tool.`;

const deliveryNotesResultSchema = z.object({ notes: z.string() });

const DELIVERY_NOTES_TOOL: Anthropic.Tool = {
  name: "delivery_notes",
  description: "Return practical delivery notes for this speech.",
  input_schema: {
    type: "object",
    properties: {
      notes: { type: "string" },
    },
    required: ["notes"],
  },
};

export interface DeliveryNotesResult {
  notes: string;
  inputTokens: number;
  outputTokens: number;
}

export async function generateDeliveryNotes(params: {
  sections: SpeechSection[];
}): Promise<DeliveryNotesResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;

  if (!apiKey || !model) {
    throw new Error("Missing ANTHROPIC_API_KEY or ANTHROPIC_MODEL");
  }

  const client = new Anthropic({ apiKey });

  const speechText = params.sections
    .map((section) => `${section.title}\n${section.content}`)
    .join("\n\n");

  const message = await client.messages.create({
    model,
    max_tokens: 900,
    system: DELIVERY_NOTES_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is the full speech, section by section:\n\n${speechText}\n\nWrite delivery notes for it now.`,
      },
    ],
    tools: [DELIVERY_NOTES_TOOL],
    tool_choice: { type: "tool", name: "delivery_notes" },
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );

  if (!toolUse) {
    throw new Error("Anthropic did not return a tool_use block");
  }

  const parsed = deliveryNotesResultSchema.parse(toolUse.input);

  return {
    notes: parsed.notes,
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  };
}
