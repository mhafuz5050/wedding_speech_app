import type { QuestionnaireAnswers } from "@/lib/schemas/questionnaire";

// CLAUDE.md §7: "about 130 spoken words per minute"
const TARGET_WORDS: Record<QuestionnaireAnswers["length"], number> = {
  "3": 400,
  "5": 650,
  "7": 900,
};

export function targetWordCount(length: QuestionnaireAnswers["length"]) {
  return TARGET_WORDS[length];
}

export function buildUserMessage(
  speechTypeLabel: string,
  answers: QuestionnaireAnswers,
): string {
  const words = targetWordCount(answers.length);
  const english = answers.englishVariant === "us" ? "US English" : "UK English";

  return `Speaker's role: ${speechTypeLabel}
Speaker's name: ${answers.speakerName}
Couple: ${answers.partnerAName} and ${answers.partnerBName}

How the speaker knows them: ${answers.howYouKnowThem}

How they met / their story: ${answers.coupleStory}

Stories and memories the speaker wants included:
${answers.stories}

What the partner has brought to their life: ${answers.partnerContribution}

Tone: ${answers.tone}
Target length: ${answers.length} minutes (~${words} words total across all sections)
Spelling and customs: ${english}
Things to avoid: ${answers.avoidTopics || "nothing specified"}
Audience notes: ${answers.audienceNotes || "nothing specified"}

Write the speech now, following your instructions exactly.`;
}
