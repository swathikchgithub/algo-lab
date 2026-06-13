import Link from "next/link";
import { notFound } from "next/navigation";
import { QUESTIONS, getQuestion } from "@/data/questions";
import { QuestionDetail } from "@/components/questions/QuestionDetail";

export function generateStaticParams() {
  return QUESTIONS.map((q) => ({ id: q.id }));
}

export default function QuestionPage({ params }: { params: { id: string } }) {
  const question = getQuestion(params.id);
  if (!question) notFound();

  return (
    <div>
      <Link href="/questions" className="text-sm text-slate-400 hover:text-white">
        ← Back to questions
      </Link>
      <div className="mt-3">
        <QuestionDetail question={question} />
      </div>
    </div>
  );
}
