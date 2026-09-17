import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { QuestionnaireAnswers } from "@/lib/schemas/questionnaire";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { buildUserMessage, targetWordCount } from "./buildUserMessage";

const SECTION_IDS = [
  "opening",
  "who_i_am",
  "stories",
  "tribute",
  "wishes",
  "toast",
] as const;

const speechSectionSchema = z.object({
  id: z.enum(SECTION_IDS),
  title: z.string(),
  content: z.string(),
});

const recordSpeechInputSchema = z.object({
  sections: z.array(speechSectionSchema).length(SECTION_IDS.length),
});

export type SpeechSection = z.infer<typeof speechSectionSchema>;

const RECORD_SPEECH_TOOL: Anthropic.Tool = {
  name: "record_speech",
  description:
    "Record the finished wedding speech, broken into its six sections.",
  input_schema: {
    type: "object",
    properties: {
      sections: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", enum: SECTION_IDS },
            title: { type: "string" },
            content: { type: "string" },
          },
          required: ["id", "title", "content"],
        },
        minItems: SECTION_IDS.length,
        maxItems: SECTION_IDS.length,
      },
    },
    required: ["sections"],
  },
};

export interface GenerateSpeechResult {
  sections: SpeechSection[];
  inputTokens: number;
  outputTokens: number;
}

export async function generateSpeech(params: {
  speechTypeLabel: string;
  answers: QuestionnaireAnswers;
}): Promise<GenerateSpeechResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;

  if (!apiKey || !model) {
    throw new Error("Missing ANTHROPIC_API_KEY or ANTHROPIC_MODEL");
  }

  const client = new Anthropic({ apiKey });

  // CLAUDE.md §7: "Cap output length in every API call" — scale the cap to
  // the requested speech length rather than using one fixed number always.
  const words = targetWordCount(params.answers.length);
  const maxTokens = Math.min(4000, Math.max(800, Math.ceil(words * 1.8) + 300));

  const message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserMessage(params.speechTypeLabel, params.answers),
      },
    ],
    tools: [RECORD_SPEECH_TOOL],
    tool_choice: { type: "tool", name: "record_speech" },
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );

  if (!toolUse) {
    throw new Error("Anthropic did not return a tool_use block");
  }

  const parsed = recordSpeechInputSchema.parse(toolUse.input);

  return {
    sections: parsed.sections,
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  };
}
