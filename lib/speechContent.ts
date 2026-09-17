import type { SpeechSection } from "@/lib/ai/generateSpeech";

export function joinSections(sections: SpeechSection[]): string {
  return sections.map((section) => `${section.title}\n\n${section.content}`).join("\n\n");
}
