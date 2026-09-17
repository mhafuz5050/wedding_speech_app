import { notFound, redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PaymentConfirming } from "@/components/speech/PaymentConfirming";

export default async function SpeechSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { data: speech } = await admin
    .from("speeches")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (!speech) {
    notFound();
  }

  // The webhook can easily beat the browser back from Stripe. We only
  // ever trust the DB's status here — never the redirect itself.
  if (speech.status === "paid") {
    redirect(`/speech/${id}`);
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <PaymentConfirming speechId={id} />
    </main>
  );
}
