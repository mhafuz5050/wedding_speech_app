import "server-only";
import type { SpeechSection } from "@/lib/ai/generateSpeech";

// CLAUDE.md §7: "the server stores the full text and returns only the
// preview portion" — this function is the boundary that enforces that.
// Locked sections get content: "" (never the real hidden text), so
// whatever calls this can safely pass its output anywhere, including
// across a Server → Client Component boundary, without leaking anything.
export interface PreviewSection {
  id: string;
  title: string;
  content: string;
  revealed: boolean;
}

const REVEAL_FRACTION = 0.3;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Just a number, safe to reveal in full even when the text itself isn't.
export function totalWordCount(sections: SpeechSection[]): number {
  return sections.reduce((sum, s) => sum + countWords(s.content), 0);
}

export function buildPreview(sections: SpeechSection[]): PreviewSection[] {
  const totalWords = sections.reduce((sum, s) => sum + countWords(s.content), 0);
  const targetWords = Math.round(totalWords * REVEAL_FRACTION);

  let revealedWords = 0;

  return sections.map((section) => {
    if (revealedWords >= targetWords) {
      return { id: section.id, title: section.title, content: "", revealed: false };
    }

    const words = section.content.trim().split(/\s+/).filter(Boolean);
    const remaining = targetWords - revealedWords;

    if (words.length <= remaining) {
      revealedWords += words.length;
      return {
        id: section.id,
        title: section.title,
        content: section.content,
        revealed: true,
      };
    }

    revealedWords = targetWords;
    return {
      id: section.id,
      title: section.title,
      content: words.slice(0, remaining).join(" "),
      revealed: true,
    };
  });
}
