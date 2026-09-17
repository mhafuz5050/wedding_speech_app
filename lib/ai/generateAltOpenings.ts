import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { QuestionnaireAnswers } from "@/lib/schemas/questionnaire";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { buildUserMessage } from "./buildUserMessage";

const ALT_OPENINGS_SYSTEM_PROMPT = `${SYSTEM_PROMPT}

You are now writing exactly 2 alternative opening sections for a speech
that has already been written — different hooks the speaker could use
instead of their current opening, still following every rule above.
Reply only by calling the alt_openings tool.`;

const altOpeningsResultSchema = z.object({
  openings: z.array(z.string()).length(2),
});

const ALT_OPENINGS_TOOL: Anthropic.Tool = {
  name: "alt_openings",
  description: "Return exactly 2 alternative opening paragraphs.",
  input_schema: {
    type: "object",
    properties: {
      openings: {
        type: "array",
        items: { type: "string" },
        minItems: 2,
        maxItems: 2,
      },
    },
    required: ["openings"],
  },
};

export interface AltOpeningsResult {
  openings: [string, string];
  inputTokens: number;
  outputTokens: number;
}

export async function generateAltOpenings(params: {
  speechTypeLabel: string;
  answers: QuestionnaireAnswers;
}): Promise<AltOpeningsResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;

  if (!apiKey || !model) {
    throw new Error("Missing ANTHROPIC_API_KEY or ANTHROPIC_MODEL");
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model,
    max_tokens: 900,
    system: ALT_OPENINGS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserMessage(params.speechTypeLabel, params.answers),
      },
    ],
    tools: [ALT_OPENINGS_TOOL],
    tool_choice: { type: "tool", name: "alt_openings" },
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );

  if (!toolUse) {
    throw new Error("Anthropic did not return a tool_use block");
  }

  const parsed = altOpeningsResultSchema.parse(toolUse.input);

  return {
    openings: [parsed.openings[0], parsed.openings[1]],
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  };
}
