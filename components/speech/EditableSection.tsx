"use client";

import { useState } from "react";
import { RewriteSectionForm } from "./RewriteSectionForm";

interface EditableSectionProps {
  speechId: string;
  sectionId: string;
  title: string;
  content: string;
  canRewrite: boolean;
  blockedReason: string | null;
  onSaved: (content: string) => void;
  onRewritten: (content: string, revisionsUsed: number) => void;
}

export function EditableSection({
  speechId,
  sectionId,
  title,
  content,
  canRewrite,
  blockedReason,
  onSaved,
  onRewritten,
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/speeches/${speechId}/sections/${sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Couldn't save. Please try again.");
        return;
      }
      onSaved(draft);
      setIsEditing(false);
    } catch {
      setError("Couldn't save. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setDraft(content);
    setIsEditing(false);
    setError(null);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-600">
          {title}
        </h3>
        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setDraft(content);
              setIsEditing(true);
            }}
            className="text-sm font-medium text-rose-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-3 flex flex-col gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          {error && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 whitespace-pre-wrap text-base text-zinc-800">{content}</p>
      )}

      <RewriteSectionForm
        speechId={speechId}
        sectionId={sectionId}
        canRewrite={canRewrite}
        blockedReason={blockedReason}
        onRewritten={onRewritten}
      />
    </div>
  );
}
