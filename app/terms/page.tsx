export const metadata = { title: "Terms of Use — AlgoLab" };

const H2 = "mt-6 text-lg font-semibold text-white";
const P = "mt-2 text-slate-300 leading-relaxed";

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="font-mono text-3xl font-bold text-white">Terms of Use</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: June 13, 2026</p>

      <p className={P}>
        By using AlgoLab you agree to these terms. If you don&apos;t agree, please don&apos;t
        use the service.
      </p>

      <h2 className={H2}>Educational use, no warranty</h2>
      <p className={P}>
        AlgoLab is provided free of charge for educational and personal study, on an
        &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without warranties of any
        kind. Question content, hints, explanations, and reference solutions are for learning
        and may contain errors or be incomplete — verify anything you rely on.
      </p>

      <h2 className={H2}>Code execution</h2>
      <p className={P}>
        The coding pad executes your code through{" "}
        <a
          href="https://wandbox.org"
          target="_blank"
          rel="noreferrer"
          className="text-cell-current hover:underline"
        >
          Wandbox
        </a>
        , a third-party service. We don&apos;t guarantee its availability, accuracy, or that
        any particular language or version will run. You agree not to use the Run feature to:
      </p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300">
        <li>execute malicious, illegal, or abusive code;</li>
        <li>attack, overload, or attempt to circumvent rate limits on this service or any third party;</li>
        <li>process sensitive or confidential data (see the Privacy Policy).</li>
      </ul>
      <p className={P}>
        We may rate-limit, throttle, or block requests to protect the service.
      </p>

      <h2 className={H2}>Trademarks &amp; affiliation</h2>
      <p className={P}>
        Company names and trademarks (including LeetCode and the companies referenced in
        question tags) belong to their respective owners. AlgoLab is an independent learning
        project and is not affiliated with, endorsed by, or sponsored by any of them. Question
        prompts are restatements for educational use; please refer to the original sources
        where linked.
      </p>

      <h2 className={H2}>Limitation of liability</h2>
      <p className={P}>
        To the maximum extent permitted by law, the maintainer is not liable for any damages
        arising from your use of AlgoLab or the third-party services it relies on.
      </p>

      <h2 className={H2}>Changes</h2>
      <p className={P}>
        We may update these terms; continued use after a change means you accept the current
        version.
      </p>
    </article>
  );
}
