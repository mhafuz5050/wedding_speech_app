import type { QuestionnaireFieldId } from "@/lib/schemas/questionnaire";

export type FieldKind = "text" | "textarea" | "radio";

export interface RadioOption {
  value: string;
  label: string;
}

export interface QuestionField {
  id: QuestionnaireFieldId;
  label: string;
  placeholder?: string;
  kind: FieldKind;
  options?: RadioOption[];
  required?: boolean;
}

export interface QuestionStepDef {
  title: string;
  helper?: string;
  fields: QuestionField[];
}

export const QUESTIONNAIRE_STEPS: QuestionStepDef[] = [
  {
    title: "What's your name?",
    helper: "This is how you'll be introduced in the speech.",
    fields: [
      {
        id: "speakerName",
        label: "Your name",
        placeholder: "e.g. Alex Turner",
        kind: "text",
      },
    ],
  },
  {
    title: "Who's getting married?",
    helper: "Both partners' names, as you'd introduce them.",
    fields: [
      {
        id: "partnerAName",
        label: "Partner 1's name",
        placeholder: "e.g. Sarah",
        kind: "text",
      },
      {
        id: "partnerBName",
        label: "Partner 2's name",
        placeholder: "e.g. James",
        kind: "text",
      },
    ],
  },
  {
    title: "How do you know them?",
    helper: "A line or two of context is enough.",
    fields: [
      {
        id: "howYouKnowThem",
        label: "How you know them",
        placeholder:
          "e.g. Known Tom since we were 11, played rugby together",
        kind: "textarea",
      },
    ],
  },
  {
    title: "How did they meet, and how long have they been together?",
    fields: [
      {
        id: "coupleStory",
        label: "Their story",
        placeholder:
          "e.g. They met at a mutual friend's birthday five years ago...",
        kind: "textarea",
      },
    ],
  },
  {
    title: "Share 2–3 stories or memories",
    helper:
      "Think of a time they made you laugh, a moment that shows who they are, or something that sums up their relationship.",
    fields: [
      {
        id: "stories",
        label: "Your stories",
        placeholder:
          "e.g. The time we got lost driving to his stag do and ended up two hours late...",
        kind: "textarea",
      },
    ],
  },
  {
    title: "What has their partner brought to their life?",
    fields: [
      {
        id: "partnerContribution",
        label: "What their partner has brought to their life",
        placeholder:
          "e.g. She's brought out his more relaxed, adventurous side",
        kind: "textarea",
      },
    ],
  },
  {
    title: "What tone are you going for?",
    fields: [
      {
        id: "tone",
        label: "Tone",
        kind: "radio",
        options: [
          { value: "funny", label: "Funny" },
          { value: "heartfelt", label: "Heartfelt" },
          { value: "balanced", label: "Balanced" },
        ],
      },
    ],
  },
  {
    title: "How long do you want to speak for?",
    fields: [
      {
        id: "length",
        label: "Length",
        kind: "radio",
        options: [
          { value: "3", label: "3 minutes" },
          { value: "5", label: "5 minutes" },
          { value: "7", label: "7 minutes" },
        ],
      },
    ],
  },
  {
    title: "Anything to avoid?",
    helper:
      "Exes, in-jokes that won't land, or sensitive family topics. Leave blank if nothing comes to mind.",
    fields: [
      {
        id: "avoidTopics",
        label: "Things to avoid",
        placeholder:
          "e.g. Please don't mention his ex, or the incident at the stag do",
        kind: "textarea",
        required: false,
      },
    ],
  },
  {
    title: "Anything about the audience we should know?",
    helper:
      "E.g. grandparents present, mostly close friends, a mixed-age crowd.",
    fields: [
      {
        id: "audienceNotes",
        label: "Audience notes",
        placeholder:
          "e.g. Both sets of grandparents will be there, plus a lot of university friends",
        kind: "textarea",
        required: false,
      },
    ],
  },
  {
    title: "UK or US English?",
    fields: [
      {
        id: "englishVariant",
        label: "Spelling and customs",
        kind: "radio",
        options: [
          { value: "uk", label: "UK English" },
          { value: "us", label: "US English" },
        ],
      },
    ],
  },
];
