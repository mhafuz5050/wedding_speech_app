import { z } from "zod";

const shortAnswer = (message: string) =>
  z.string().trim().min(1, message);

const longAnswer = (min: number, message: string) =>
  z.string().trim().min(min, message);

export const questionnaireFieldSchemas = {
  speakerName: shortAnswer("Tell us your name."),
  partnerAName: shortAnswer("Enter their name."),
  partnerBName: shortAnswer("Enter their name."),
  howYouKnowThem: longAnswer(10, "A sentence or two is plenty."),
  coupleStory: longAnswer(10, "A sentence or two is plenty."),
  stories: longAnswer(20, "Try to share at least one full story."),
  partnerContribution: longAnswer(10, "A sentence or two is plenty."),
  tone: z.enum(["funny", "heartfelt", "balanced"], {
    error: "Pick a tone.",
  }),
  length: z.enum(["3", "5", "7"], { error: "Pick a length." }),
  avoidTopics: z.string().trim().optional().default(""),
  audienceNotes: z.string().trim().optional().default(""),
  englishVariant: z.enum(["uk", "us"]).default("uk"),
} satisfies Record<string, z.ZodTypeAny>;

export const questionnaireSchema = z.object(questionnaireFieldSchemas);

export type QuestionnaireAnswers = z.infer<typeof questionnaireSchema>;
export type QuestionnaireFieldId = keyof typeof questionnaireFieldSchemas;
