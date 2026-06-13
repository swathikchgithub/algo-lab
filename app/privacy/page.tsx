export const metadata = { title: "Privacy Policy — AlgoLab" };

const H2 = "mt-6 text-lg font-semibold text-white";
const P = "mt-2 text-slate-300 leading-relaxed";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="font-mono text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: June 13, 2026</p>

      <p className={P}>
        AlgoLab is a free, educational tool for practicing data-structures &amp; algorithms
        interview questions. It has no user accounts and keeps no database of user
        information. This policy explains the little data that is involved.
      </p>

      <h2 className={H2}>Data stored in your browser</h2>
      <p className={P}>
        Your practice progress — question status, self-grades, coding-pad drafts, bookmarks,
        and your generated study plan — is saved only in your own browser using{" "}
        <code className="font-mono text-amber-200">localStorage</code>. It never leaves your
        device and is not transmitted to or stored on our servers. Clearing your browser
        storage removes it permanently.
      </p>

      <h2 className={H2}>Code execution (third-party processing)</h2>
      <p className={P}>
        When you use the coding pad&apos;s <strong>Run</strong> button, the code you write and
        any input you provide are sent to{" "}
        <a
          href="https://wandbox.org"
          target="_blank"
          rel="noreferrer"
          className="text-cell-current hover:underline"
        >
          Wandbox
        </a>
        , an independent third-party code-execution service, which compiles and runs it and
        returns the output. That code is transmitted to and processed by Wandbox and may be
        logged by them under their own policies. <strong>Please do not enter passwords,
        personal data, or other sensitive information into the coding pad.</strong> We do not
        store the code you run.
      </p>

      <h2 className={H2}>Abuse prevention</h2>
      <p className={P}>
        To keep the public &ldquo;Run&rdquo; endpoint from being abused, requests may be
        rate-limited using your IP address. When enabled, the IP address is used transiently
        to count requests and is not used to identify you or build a profile.
      </p>

      <h2 className={H2}>No tracking or advertising</h2>
      <p className={P}>
        AlgoLab does not use advertising or third-party tracking cookies, and does not
        currently use analytics. (If analytics are added later, this section will be updated
        to disclose them.)
      </p>

      <h2 className={H2}>Children</h2>
      <p className={P}>
        The service is intended for a general audience preparing for technical interviews and
        is not directed at children.
      </p>

      <h2 className={H2}>Changes</h2>
      <p className={P}>
        We may update this policy; the &ldquo;last updated&rdquo; date above reflects the
        latest version.
      </p>

      <h2 className={H2}>Contact</h2>
      <p className={P}>
        Questions about this policy? Reach the maintainer at{" "}
        <span className="text-slate-200">[add your contact email]</span>.
      </p>
    </article>
  );
}
