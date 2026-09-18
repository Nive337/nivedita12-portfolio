import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus } from "lucide-react";

const DAYS = 20;
const THRESHOLD = 75;

type Student = { id: number; name: string; usn: string; days: boolean[] };

const NAMES: [string, string][] = [
  ["Aarav Shetty", "1PE24CD001"],
  ["Diya Kulkarni", "1PE24CD012"],
  ["Rohit Patil", "1PE24CD023"],
  ["Meera Nair", "1PE24CD034"],
  ["Kiran Gowda", "1PE24CD045"],
];

let nextId = 100;

function seed(i: number): boolean[] {
  return Array.from({ length: DAYS }, (_, d) => (d * 7 + i * 5) % 10 > (i === 2 ? 4 : 1));
}

export function AttendanceDemo() {
  const [students, setStudents] = useState<Student[]>(
    NAMES.map(([name, usn], i) => ({ id: i + 1, name, usn, days: seed(i) })),
  );
  const [draft, setDraft] = useState({ name: "", usn: "" });
  const [day, setDay] = useState(DAYS - 1);

  const rows = useMemo(
    () =>
      students.map((s) => {
        const present = s.days.filter(Boolean).length;
        return { ...s, present, pct: (present / DAYS) * 100 };
      }),
    [students],
  );

  const classAvg = rows.length ? rows.reduce((a, r) => a + r.pct, 0) / rows.length : 0;
  const flagged = rows.filter((r) => r.pct < THRESHOLD);

  const toggle = (id: number, d: number) =>
    setStudents((ss) =>
      ss.map((s) =>
        s.id === id ? { ...s, days: s.days.map((v, i) => (i === d ? !v : v)) } : s,
      ),
    );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Students", rows.length.toString()],
          ["Class average", `${classAvg.toFixed(1)}%`],
          ["Below 75%", flagged.length.toString()],
        ].map(([label, value]) => (
          <div key={label} className="surface-card rounded-3xl p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-3xl text-blush">{value}</p>
          </div>
        ))}
      </div>

      <div className="surface-card rounded-3xl p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-sm uppercase tracking-[0.25em] text-mauve">Daily register</h3>
          <label className="flex items-center gap-3 text-xs text-muted-foreground">
            Day {day + 1}
            <input
              type="range"
              min={0}
              max={DAYS - 1}
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="accent-pink"
            />
          </label>
        </div>

        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl bg-secondary/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.usn}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggle(r.id, day)}
                    className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                      r.days[day]
                        ? "bg-pink/25 text-foreground"
                        : "border border-border text-muted-foreground"
                    }`}
                  >
                    {r.days[day] ? "Present" : "Absent"}
                  </button>
                  <span
                    className={`inline-flex items-center gap-1.5 font-display text-lg ${
                      r.pct < THRESHOLD ? "text-pink" : "text-blush"
                    }`}
                  >
                    {r.pct < THRESHOLD ? (
                      <AlertTriangle className="size-4" />
                    ) : (
                      <CheckCircle2 className="size-4" />
                    )}
                    {r.pct.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {r.days.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => toggle(r.id, i)}
                    aria-label={`Day ${i + 1} for ${r.name}`}
                    className="size-3.5 rounded-[4px] transition-colors"
                    style={{
                      backgroundColor: v ? "var(--pink)" : "oklch(1 0 0 / 0.08)",
                      outline: i === day ? "1.5px solid var(--blush)" : "none",
                      outlineOffset: 1,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 rounded-2xl border border-dashed border-border p-4">
          <input
            placeholder="Student name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="min-w-36 flex-1 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm outline-none focus:border-pink"
          />
          <input
            placeholder="USN"
            value={draft.usn}
            onChange={(e) => setDraft({ ...draft, usn: e.target.value })}
            className="w-36 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm outline-none focus:border-pink"
          />
          <button
            onClick={() => {
              if (!draft.name.trim()) return;
              setStudents((s) => [
                ...s,
                {
                  id: nextId++,
                  name: draft.name.trim(),
                  usn: draft.usn.trim() || "—",
                  days: Array(DAYS).fill(true),
                },
              ]);
              setDraft({ name: "", usn: "" });
            }}
            className="inline-flex items-center gap-2 rounded-full bg-pink/20 px-4 py-2 text-sm transition-colors hover:bg-pink/30"
          >
            <Plus className="size-4" /> Add student
          </button>
        </div>
      </div>
    </div>
  );
}
