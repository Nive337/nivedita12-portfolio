import { useMemo, useState } from "react";
import { Search, Sparkles, MessageCircleQuestion } from "lucide-react";

const SAMPLE = `Chapter 1 — Database Management Systems
A database management system is software that stores, retrieves and manages data. It provides concurrency control, recovery and integrity constraints so that many users can safely share the same data.

Chapter 2 — Normalisation
Normalisation removes redundancy by splitting tables. First normal form removes repeating groups, second normal form removes partial dependency on a composite key, and third normal form removes transitive dependency.

Chapter 3 — Indexing
An index is an auxiliary structure that speeds up lookups. B+ trees keep data sorted and allow logarithmic search, while hash indexes give constant time lookups for equality queries but cannot answer range queries.

Chapter 4 — Transactions
A transaction is atomic, consistent, isolated and durable. Write ahead logging records changes before they are applied so the system can recover after a crash.`;

function sentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}

const STOP = new Set([
  "what","is","a","the","of","and","how","does","do","in","to","for","are","with","that","this","it","on","an","why","can","be",
]);

export function PdfDemo() {
  const [text, setText] = useState(SAMPLE);
  const [query, setQuery] = useState("index");
  const [question, setQuestion] = useState("How does a transaction recover after a crash?");
  const [answer, setAnswer] = useState<string | null>(null);
  const [summary, setSummary] = useState<string[] | null>(null);

  const stats = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    return {
      words: words.length,
      chars: text.length,
      pages: Math.max(1, Math.ceil(words.length / 250)),
      sentences: sentences(text).length,
    };
  }, [text]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return sentences(text).filter((s) => s.toLowerCase().includes(q));
  }, [text, query]);

  const runSummary = () => {
    const sents = sentences(text);
    const freq = new Map<string, number>();
    sents.forEach((s) =>
      s
        .toLowerCase()
        .split(/[^a-z]+/)
        .forEach((w) => {
          if (w.length > 3 && !STOP.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
        }),
    );
    const scored = sents.map((s) => ({
      s,
      score:
        s
          .toLowerCase()
          .split(/[^a-z]+/)
          .reduce((acc, w) => acc + (freq.get(w) ?? 0), 0) / Math.sqrt(s.length),
    }));
    setSummary(
      scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((x) => x.s),
    );
  };

  const ask = () => {
    const terms = question
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((w) => w.length > 2 && !STOP.has(w));
    const best = sentences(text)
      .map((s) => ({
        s,
        score: terms.reduce((acc, t) => acc + (s.toLowerCase().includes(t) ? 1 : 0), 0),
      }))
      .sort((a, b) => b.score - a.score)[0];
    setAnswer(best && best.score > 0 ? best.s : "No passage in this document answers that yet.");
  };

  const highlight = (s: string) => {
    const q = query.trim();
    if (!q) return s;
    const parts = s.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
    return parts.map((p, i) =>
      p.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="rounded bg-pink/30 px-1 text-foreground">
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      ),
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="surface-card rounded-3xl p-6">
        <h3 className="mb-4 text-sm uppercase tracking-[0.25em] text-mauve">Document</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          className="w-full resize-y rounded-2xl border border-border bg-secondary/40 p-4 text-sm leading-relaxed text-foreground/90 outline-none focus:border-pink"
        />
        <div className="mt-4 grid grid-cols-4 gap-3 text-center">
          {[
            ["Pages", stats.pages],
            ["Words", stats.words],
            ["Sentences", stats.sentences],
            ["Chars", stats.chars],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-2xl bg-secondary px-2 py-3">
              <p className="font-display text-xl text-blush">{value}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="surface-card rounded-3xl p-6">
          <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-mauve">
            <Search className="size-4 text-pink" /> Keyword search
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the document…"
            className="w-full rounded-full border border-border bg-secondary/40 px-4 py-2.5 text-sm outline-none focus:border-pink"
          />
          <p className="mt-3 text-xs text-muted-foreground">{matches.length} matching passages</p>
          <ul className="mt-3 max-h-44 space-y-2 overflow-auto pr-1 text-sm leading-relaxed text-foreground/85">
            {matches.map((m, i) => (
              <li key={i} className="rounded-2xl bg-secondary/50 p-3">
                {highlight(m)}
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-card rounded-3xl p-6">
          <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-mauve">
            <Sparkles className="size-4 text-pink" /> Extractive summary
          </div>
          <button
            onClick={runSummary}
            className="rounded-full bg-pink/20 px-5 py-2 text-sm text-foreground transition-colors hover:bg-pink/30"
          >
            Summarise
          </button>
          {summary ? (
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/85">
              {summary.map((s, i) => (
                <li key={i} className="border-l-2 border-pink/50 pl-3">
                  {s}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="surface-card rounded-3xl p-6">
          <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-mauve">
            <MessageCircleQuestion className="size-4 text-pink" /> Ask the document
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 rounded-full border border-border bg-secondary/40 px-4 py-2.5 text-sm outline-none focus:border-pink"
            />
            <button
              onClick={ask}
              className="rounded-full bg-pink/20 px-5 py-2 text-sm transition-colors hover:bg-pink/30"
            >
              Ask
            </button>
          </div>
          {answer ? (
            <p className="mt-4 rounded-2xl bg-secondary/50 p-4 text-sm leading-relaxed text-foreground/85">
              {answer}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
