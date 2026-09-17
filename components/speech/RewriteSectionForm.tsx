"use client";

import { useState } from "react";

interface RewriteSectionFormProps {
  speechId: string;
  sectionId: string;
  canRewrite: boolean;
  blockedReason: string | null;
  onRewritten: (content: string, revisionsUsed: number) => void;
}

export function RewriteSectionForm({
  speechId,
  sectionId,
  canRewrite,
  blockedReason,
  onRewritten,
}: RewriteSectionFormProps) {
  const [instruction, setInstruction] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleRewrite() {
    setIsRewriting(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/speeches/${speechId}/sections/${sectionId}/rewrite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instruction: instruction.trim() || undefined }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Couldn't rewrite that section. Please try again.");
        return;
      }
      onRewritten(data.section.content, data.revisionsUsed);
      setInstruction("");
      setShowForm(false);
    } catch {
      setError("Couldn't rewrite that section. Please check your connection.");
    } finally {
      setIsRewriting(false);
    }
  }

  if (!canRewrite) {
    return <p className="mt-3 text-xs text-zinc-500">{blockedReason}</p>;
  }

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="mt-3 text-sm font-medium text-rose-600 hover:underline"
      >
        Rewrite with AI
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-zinc-100 pt-3">
      <label className="text-xs font-medium text-zinc-600">
        Optional instruction (e.g. &ldquo;make it funnier&rdquo;)
      </label>
      <input
        type="text"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="Leave blank to just improve it"
        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
      />
      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          disabled={isRewriting}
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleRewrite}
          disabled={isRewriting}
          className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
        >
          {isRewriting ? "Rewriting…" : "Rewrite this section"}
        </button>
      </div>
    </div>
  );
}
