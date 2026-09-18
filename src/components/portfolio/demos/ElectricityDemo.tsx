import { useMemo, useState } from "react";
import { Plus, Trash2, Zap } from "lucide-react";

type Device = { id: number; name: string; watts: number; hours: number; qty: number };

const SLABS = [
  { upto: 50, rate: 3.75, label: "0 – 50" },
  { upto: 100, rate: 5.2, label: "51 – 100" },
  { upto: 200, rate: 6.85, label: "101 – 200" },
  { upto: Infinity, rate: 8.1, label: "200 +" },
];
const FIXED = 90;

let nextId = 5;

export function ElectricityDemo() {
  const [devices, setDevices] = useState<Device[]>([
    { id: 1, name: "LED bulbs", watts: 9, hours: 6, qty: 8 },
    { id: 2, name: "Ceiling fan", watts: 75, hours: 10, qty: 3 },
    { id: 3, name: "Refrigerator", watts: 150, hours: 24, qty: 1 },
    { id: 4, name: "Laptop", watts: 65, hours: 8, qty: 2 },
  ]);
  const [draft, setDraft] = useState({ name: "", watts: 100, hours: 4, qty: 1 });

  const rows = useMemo(
    () =>
      devices.map((d) => ({
        ...d,
        units: (d.watts * d.hours * d.qty * 30) / 1000,
      })),
    [devices],
  );

  const total = rows.reduce((a, r) => a + r.units, 0);

  const bill = useMemo(() => {
    let remaining = total;
    let prev = 0;
    const lines = SLABS.map((s) => {
      const width = s.upto - prev;
      const units = Math.max(0, Math.min(remaining, width));
      remaining -= units;
      prev = s.upto;
      return { label: s.label, rate: s.rate, units, amount: units * s.rate };
    }).filter((l) => l.units > 0);
    const energy = lines.reduce((a, l) => a + l.amount, 0);
    return { lines, energy, fixed: FIXED, total: energy + FIXED };
  }, [total]);

  const max = Math.max(...rows.map((r) => r.units), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="surface-card rounded-3xl p-6">
        <h3 className="mb-5 text-sm uppercase tracking-[0.25em] text-mauve">Connected load</h3>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl bg-secondary/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">
                  {r.name} <span className="text-muted-foreground">× {r.qty}</span>
                </p>
                <div className="flex items-center gap-3">
                  <p className="font-display text-lg text-blush">{r.units.toFixed(1)} kWh</p>
                  <button
                    onClick={() => setDevices((d) => d.filter((x) => x.id !== r.id))}
                    aria-label={`Remove ${r.name}`}
                    className="text-muted-foreground transition-colors hover:text-pink"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background/60">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(r.units / max) * 100}%`, backgroundImage: "var(--gradient-aurora)" }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {(["watts", "hours", "qty"] as const).map((field) => (
                  <label key={field} className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {field === "watts" ? "Watts" : field === "hours" ? "Hrs/day" : "Qty"}
                    <input
                      type="number"
                      min={0}
                      value={r[field]}
                      onChange={(e) =>
                        setDevices((ds) =>
                          ds.map((x) =>
                            x.id === r.id ? { ...x, [field]: Number(e.target.value) || 0 } : x,
                          ),
                        )
                      }
                      className="mt-1 w-full rounded-xl border border-border bg-background/40 px-2 py-1.5 text-sm text-foreground outline-none focus:border-pink"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl border border-dashed border-border p-4">
          <input
            placeholder="Device name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="min-w-32 flex-1 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm outline-none focus:border-pink"
          />
          <input
            type="number"
            value={draft.watts}
            onChange={(e) => setDraft({ ...draft, watts: Number(e.target.value) })}
            className="w-20 rounded-full border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-pink"
            aria-label="Watts"
          />
          <input
            type="number"
            value={draft.hours}
            onChange={(e) => setDraft({ ...draft, hours: Number(e.target.value) })}
            className="w-20 rounded-full border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-pink"
            aria-label="Hours per day"
          />
          <button
            onClick={() => {
              if (!draft.name.trim()) return;
              setDevices((d) => [...d, { id: nextId++, ...draft, name: draft.name.trim() }]);
              setDraft({ name: "", watts: 100, hours: 4, qty: 1 });
            }}
            className="inline-flex items-center gap-2 rounded-full bg-pink/20 px-4 py-2 text-sm transition-colors hover:bg-pink/30"
          >
            <Plus className="size-4" /> Add
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div
          className="rounded-3xl p-7 text-plum"
          style={{ backgroundImage: "var(--gradient-aurora)", boxShadow: "var(--shadow-soft)" }}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-plum/80">
            <Zap className="size-4" /> Monthly bill
          </div>
          <p className="mt-3 font-display text-5xl">₹{bill.total.toFixed(2)}</p>
          <p className="mt-2 text-sm text-plum/80">{total.toFixed(1)} kWh consumed this month</p>
        </div>

        <div className="surface-card rounded-3xl p-6">
          <h3 className="mb-4 text-sm uppercase tracking-[0.25em] text-mauve">Slab breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <th className="pb-2">Slab (kWh)</th>
                <th className="pb-2">Units</th>
                <th className="pb-2">Rate</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-foreground/85">
              {bill.lines.map((l) => (
                <tr key={l.label} className="border-t border-border">
                  <td className="py-2">{l.label}</td>
                  <td className="py-2">{l.units.toFixed(1)}</td>
                  <td className="py-2">₹{l.rate.toFixed(2)}</td>
                  <td className="py-2 text-right">₹{l.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t border-border">
                <td className="py-2" colSpan={3}>
                  Fixed charges
                </td>
                <td className="py-2 text-right">₹{bill.fixed.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
