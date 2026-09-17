import Link from "next/link";
import { createSupabaseSessionClient } from "@/lib/supabase/session";
import { LoginForm } from "@/components/account/LoginForm";
import { getSpeechType } from "@/lib/speechTypes";
import { questionnaireSchema } from "@/lib/schemas/questionnaire";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createSupabaseSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center gap-6 px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Enter the email you used when creating your speech and we&apos;ll send
            you a sign-in link.
          </p>
        </div>
        {error === "auth_failed" && (
          <p
            role="alert"
            className="w-full max-w-sm rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            That sign-in link didn&apos;t work. Please request a new one.
          </p>
        )}
        <LoginForm />
      </main>
    );
  }

  // Session client, not the admin client — this is enforced by the
  // "users can read their own speeches" RLS policy (auth.uid() = user_id),
  // not by an explicit filter here.
  const { data: speeches } = await supabase
    .from("speeches")
    .select("id, speech_type, answers, status, plan, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-4 py-10">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Your speeches</h1>
        <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
      </div>

      {!speeches || speeches.length === 0 ? (
        <p className="text-sm text-zinc-600">You haven&apos;t started a speech yet.</p>
      ) : (
        <div className="flex w-full max-w-md flex-col gap-3">
          {speeches.map((speech) => {
            const speechType = getSpeechType(speech.speech_type);
            const parsedAnswers = questionnaireSchema.safeParse(speech.answers);
            const coupleNames = parsedAnswers.success
              ? `${parsedAnswers.data.partnerAName} & ${parsedAnswers.data.partnerBName}`
              : "";

            return (
              <Link
                key={speech.id}
                href={`/speech/${speech.id}`}
                className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-rose-300 hover:bg-rose-50"
              >
                <span className="text-base font-semibold text-zinc-900">
                  {speechType?.label ?? "Wedding"} speech
                  {coupleNames ? ` — ${coupleNames}` : ""}
                </span>
                <span className="text-sm text-zinc-600">
                  {speech.status === "paid"
                    ? `Unlocked (${speech.plan})`
                    : "Preview only — not yet unlocked"}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
