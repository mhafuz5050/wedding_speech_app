import { notFound } from "next/navigation";
import { getSpeechType } from "@/lib/speechTypes";
import { QuestionnaireWizard } from "@/components/questionnaire/QuestionnaireWizard";

export default async function CreateTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const speechType = getSpeechType(type);

  if (!speechType) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <QuestionnaireWizard typeLabel={speechType.label} />
    </main>
  );
}
