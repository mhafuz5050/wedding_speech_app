export const SPEECH_TYPES = [
  {
    slug: "best-man",
    label: "Best Man",
    description: "For the groom's closest friend or brother.",
  },
  {
    slug: "maid-of-honour",
    label: "Maid of Honour",
    description: "For the bride's closest friend or sister.",
  },
  {
    slug: "father-of-the-bride",
    label: "Father of the Bride",
    description: "For the bride's father, welcoming everyone.",
  },
  {
    slug: "groom",
    label: "Groom",
    description: "For the groom, thanking everyone and toasting the bride.",
  },
] as const;

export type SpeechTypeSlug = (typeof SPEECH_TYPES)[number]["slug"];

export function getSpeechType(slug: string) {
  return SPEECH_TYPES.find((type) => type.slug === slug);
}
