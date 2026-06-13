import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-navy-600">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>AlgoLab — a free, educational DSA interview-prep tool. No accounts, no tracking.</p>
        <nav className="flex gap-4">
          <Link href="/privacy" className="hover:text-slate-300">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-slate-300">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
