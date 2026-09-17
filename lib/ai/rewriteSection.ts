import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { QuestionnaireAnswers } from "@/lib/schemas/questionnaire";
import { SYSTEM_PROMPT } from "./systemPrompt";

const REWRITE_SYSTEM_PROMPT = `${SYSTEM_PROMPT}

You are now rewriting ONE existing section of an already-written speech,
not writing from scratch. Keep it consistent with the rest of the
speech's facts and tone. Follow any specific instruction you're given
for this rewrite (e.g. "make it funnier") while still obeying every
rule above. Reply only by calling the rewrite_section tool with the
new content for this section.`;

const rewriteResultSchema = z.object({ content: z.string() });

const REWRITE_SECTION_TOOL: Anthropic.Tool = {
  name: "rewrite_section",
  description: "Return the rewritten content for this one section only.",
  input_schema: {
    type: "object",
    properties: {
      content: { type: "string" },
    },
    required: ["content"],
  },
};

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export interface RewriteSectionResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
}

export async function rewriteSection(params: {
  speechTypeLabel: string;
  answers: QuestionnaireAnswers;
  sectionTitle: string;
  currentContent: string;
  instruction?: string;
}): Promise<RewriteSectionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;

  if (!apiKey || !model) {
    throw new Error("Missing ANTHROPIC_API_KEY or ANTHROPIC_MODEL");
  }

  const client = new Anthropic({ apiKey });

  const currentWords = countWords(params.currentContent);
  const maxTokens = Math.min(2000, Math.max(400, Math.ceil(currentWords * 2.5) + 200));

  const userMessage = `Speaker's role: ${params.speechTypeLabel}
Couple: ${params.answers.partnerAName} and ${params.answers.partnerBName}
Tone: ${params.answers.tone}
Things to avoid: ${params.answers.avoidTopics || "nothing specified"}
Spelling and customs: ${params.answers.englishVariant === "us" ? "US English" : "UK English"}

Section: ${params.sectionTitle}
Current content:
${params.currentContent}

${
  params.instruction
    ? `Rewrite instruction: ${params.instruction}`
    : "Rewrite instruction: none given — just improve it while keeping the same meaning and roughly the same length."
}`;

  const message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: REWRITE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
    tools: [REWRITE_SECTION_TOOL],
    tool_choice: { type: "tool", name: "rewrite_section" },
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );

  if (!toolUse) {
    throw new Error("Anthropic did not return a tool_use block");
  }

  const parsed = rewriteResultSchema.parse(toolUse.input);

  return {
    content: parsed.content,
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  };
}
