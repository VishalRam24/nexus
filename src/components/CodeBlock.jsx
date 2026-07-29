import React, { useState } from "react";

/** Code panel with a copy-to-clipboard button. */
export default function CodeBlock({ code, label, tone = "dark" }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard API needs a secure context; fall back to a temp selection.
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing else to try — leave the button state unchanged */
        document.body.removeChild(ta);
        return;
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const dark = tone === "dark";

  return (
    <div className="relative group text-left">
      {label && (
        <div className="text-xs uppercase tracking-widest font-bold text-ink-400 mb-2">
          {label}
        </div>
      )}
      <pre
        className={
          "rounded-lg p-5 pr-14 overflow-x-auto text-sm font-mono leading-relaxed " +
          (dark
            ? "bg-ink-900 text-ink-200 border border-ink-700"
            : "bg-ink-100 text-ink-700 border border-ink-200")
        }
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={
          "absolute top-0 right-0 m-2 px-2.5 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1.5 transition-all " +
          (label ? "mt-8 " : "") +
          (copied
            ? "bg-flux-500 text-white"
            : dark
            ? "bg-ink-700 text-ink-200 hover:bg-ink-600"
            : "bg-white text-ink-600 hover:bg-ink-200 border border-ink-200")
        }
      >
        {copied ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15V5a2 2 0 012-2h10" />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  );
}
