import Link from "next/link";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/questions", label: "Questions" },
  { href: "/visualize", label: "Visualize" },
  { href: "/plan", label: "Plan" },
  { href: "/patterns/two-pointers", label: "Patterns" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-navy-600 bg-navy/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center gap-1 px-4 py-3 sm:px-6">
        <Link href="/" className="mr-4 font-mono text-lg font-bold text-white">
          Algo<span className="text-cell-current">Lab</span>
        </Link>
        <div className="flex flex-wrap gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm text-slate-300 transition hover:bg-navy-700 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
