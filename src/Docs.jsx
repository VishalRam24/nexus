import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icons, NexusMark } from "./components/ui.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { GUIDES } from "./generated/guides.js";

const BASE = import.meta.env.BASE_URL;

/** `?p=opt` selects the nexus-opt guide; anything else falls back to the first. */
function guideFromLocation() {
  const want = new URLSearchParams(window.location.search).get("p");
  return GUIDES.findIndex((g) => g.slug === want) >= 0
    ? GUIDES.findIndex((g) => g.slug === want)
    : 0;
}

/* ── Top bar ─────────────────────────────────────────────────────────── */

function DocsNav({ guide, onMenu }) {
  return (
    <nav className="top-0 fixed z-50 w-full flex items-center justify-between px-2 py-3 bg-white shadow">
      <div className="w-full px-4 mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden cursor-pointer px-2 py-1 rounded text-ink-700"
            type="button"
            aria-label="Toggle contents"
            onClick={onMenu}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <a
            href={BASE}
            className="text-ink-800 text-sm font-bold leading-relaxed inline-flex items-center gap-2 py-2 whitespace-nowrap uppercase tracking-widest"
          >
            <NexusMark className="w-5 h-5" />
            Nexus
          </a>
          <span className="hidden sm:inline text-ink-300">/</span>
          <span className="hidden sm:inline text-xs uppercase font-bold tracking-widest text-flux-600">
            Docs
          </span>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={BASE}
            className="text-ink-600 hover:text-flux-600 px-3 py-2 hidden md:flex items-center text-xs uppercase font-bold transition-colors"
          >
            Overview
          </a>
          <ThemeToggle />
          <a
            href={guide.repo}
            target="_blank"
            rel="noreferrer"
            className="bg-ink-800 text-white active:bg-ink-700 text-xs font-bold uppercase px-4 py-3 rounded shadow hover:shadow-lg ml-2 transition-all duration-150 inline-flex items-center gap-2"
          >
            {Icons.github} <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────────── */

function Sidebar({ index, setIndex, guide, activeId, open, close }) {
  return (
    <aside
      className={
        "fixed lg:sticky top-0 lg:top-20 left-0 z-40 h-screen lg:h-[calc(100vh-6rem)] w-72 shrink-0 " +
        "bg-white lg:bg-transparent border-r lg:border-r-0 border-ink-200 " +
        "overflow-y-auto px-5 pt-20 lg:pt-0 pb-10 transition-transform " +
        (open ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
      }
    >
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">
          Package
        </div>
        <div className="flex flex-col gap-1">
          {GUIDES.map((g, i) => (
            <button
              key={g.slug}
              onClick={() => {
                setIndex(i);
                close();
              }}
              className={
                "text-left rounded px-3 py-2 text-sm font-semibold transition-colors " +
                (i === index
                  ? "bg-flux-500 text-white"
                  : "text-ink-600 hover:bg-ink-100")
              }
            >
              {g.pkg}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">
        On this page
      </div>
      <ul className="list-none text-sm border-l border-ink-200">
        {guide.toc.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              onClick={close}
              className={
                "block py-1.5 -ml-px border-l-2 transition-colors " +
                (t.level === 3 ? "pl-6 text-xs" : "pl-4") +
                (activeId === t.id
                  ? " border-flux-500 text-flux-600 font-semibold"
                  : " border-transparent text-ink-500 hover:text-flux-600 hover:border-ink-300")
              }
            >
              {t.text}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-lg border border-ink-200 bg-ink-100 p-4">
        <div className="text-xs font-bold uppercase tracking-widest text-ink-500 mb-2">
          For LLMs &amp; agents
        </div>
        <p className="text-xs text-ink-500 leading-relaxed mb-3">
          This documentation is published as plain text too, so an agent can
          read it without scraping the page.
        </p>
        <a
          className="block text-xs font-mono font-semibold text-flux-600 hover:underline"
          href={`${BASE}llms.txt`}
        >
          /llms.txt
        </a>
        <a
          className="block text-xs font-mono font-semibold text-flux-600 hover:underline"
          href={`${BASE}llms-full.txt`}
        >
          /llms-full.txt
        </a>
      </div>
    </aside>
  );
}

/* ── Copy buttons ────────────────────────────────────────────────────── */

/**
 * The guide HTML is generated at build time, so the copy affordance is grafted
 * on afterwards rather than rendered as a component per block.
 */
function useCopyButtons(containerRef, html) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const cleanups = [];

    root.querySelectorAll(".code-wrap").forEach((wrap) => {
      if (wrap.querySelector(".copy-btn")) return;
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.type = "button";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code");

      let timer;
      const onClick = async () => {
        const code = wrap.querySelector("code")?.innerText ?? "";
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          // Clipboard API needs a secure context; fall back to a selection.
          const ta = document.createElement("textarea");
          ta.value = code;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
          } finally {
            document.body.removeChild(ta);
          }
        }
        btn.textContent = "Copied";
        btn.classList.add("copied");
        clearTimeout(timer);
        timer = setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 1800);
      };

      btn.addEventListener("click", onClick);
      wrap.appendChild(btn);
      cleanups.push(() => {
        clearTimeout(timer);
        btn.removeEventListener("click", onClick);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [containerRef, html]);
}

/* ── Scroll spy ──────────────────────────────────────────────────────── */

function useScrollSpy(containerRef, html) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll("h2[id], h3[id]"));
    if (!headings.length) return;

    // Pick the last heading whose top has passed the navbar. An
    // IntersectionObserver alone reports the wrong one whenever a section is
    // taller than the viewport and nothing is intersecting.
    //
    // The line sits below the navbar plus a heading's own top margin, so that
    // landing on `#7-storage` highlights section 7 rather than the tail of 6.
    const onScroll = () => {
      const line = 220;
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef, html]);

  return activeId;
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function Docs() {
  const [index, setIndexRaw] = useState(() => guideFromLocation());
  const [menuOpen, setMenuOpen] = useState(false);
  const guide = GUIDES[index];
  const contentRef = useRef(null);

  const setIndex = (i) => {
    setIndexRaw(i);
    const url = new URL(window.location.href);
    url.searchParams.set("p", GUIDES[i].slug);
    url.hash = "";
    window.history.pushState({}, "", url);
    window.scrollTo({ top: 0 });
  };

  // Keep the page in step with the back button.
  useEffect(() => {
    const onPop = () => setIndexRaw(guideFromLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // A deep link like ?p=opt#5-problem-classes lands before the HTML is in the
  // DOM, so the browser's own scroll-to-fragment misses. Redo it after mount.
  useEffect(() => {
    if (!window.location.hash) return;
    const el = document.getElementById(
      decodeURIComponent(window.location.hash.slice(1)),
    );
    if (el) el.scrollIntoView();
  }, [guide.slug]);

  useCopyButtons(contentRef, guide.html);
  const activeId = useScrollSpy(contentRef, guide.html);

  const other = useMemo(
    () => GUIDES[(index + 1) % GUIDES.length],
    [index],
  );

  return (
    <>
      <DocsNav guide={guide} onMenu={() => setMenuOpen((v) => !v)} />

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-900/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 pt-24 flex gap-8 items-start">
        <Sidebar
          index={index}
          setIndex={setIndex}
          guide={guide}
          activeId={activeId}
          open={menuOpen}
          close={() => setMenuOpen(false)}
        />

        <main className="min-w-0 flex-1 pb-24">
          <div className="mb-8 rounded-lg border border-ink-200 bg-ink-100 px-5 py-4">
            <p className="text-sm text-ink-600 leading-relaxed">
              {guide.blurb}{" "}
              <a
                className="font-semibold text-flux-600 hover:underline"
                href={guide.pypi}
                target="_blank"
                rel="noreferrer"
              >
                PyPI
              </a>{" "}
              ·{" "}
              <a
                className="font-semibold text-flux-600 hover:underline"
                href={guide.repo}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>{" "}
              · the same text ships as{" "}
              <code className="font-mono text-xs">WIKI.md</code> in the
              repository.
            </p>
          </div>

          <article
            ref={contentRef}
            className="prose"
            dangerouslySetInnerHTML={{ __html: guide.html }}
          />

          <hr className="my-12 border-ink-200" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setIndex(GUIDES.indexOf(other))}
              className="text-sm font-semibold text-flux-600 hover:underline"
            >
              Read the {other.pkg} guide →
            </button>
            <a
              href={BASE}
              className="text-sm font-semibold text-ink-500 hover:text-flux-600"
            >
              ← Back to the overview
            </a>
          </div>
        </main>
      </div>

      <footer className="bg-ink-100 py-8">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-ink-500">
            Nexus · MIT licensed · documentation also available as{" "}
            <a className="font-mono text-flux-600 hover:underline" href={`${BASE}llms.txt`}>
              llms.txt
            </a>
          </div>
          <div className="text-sm text-ink-400">
            Built by <span className="text-ink-600 font-semibold">Vishal Ram</span> · © 2026
          </div>
        </div>
      </footer>
    </>
  );
}
