import { useMemo, useState } from "react";
import {
  CheckCircle2,
  LogIn,
  LogOut,
  Lock,
  Plus,
  Receipt,
  User,
  Users,
  Zap,
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  address: string;
  meterNo: string;
  units: number;
};

type BillLine = { label: string; rate: number; units: number; amount: number };

type Bill = {
  customerId: string;
  customerName: string;
  meterNo: string;
  month: string;
  units: number;
  lines: BillLine[];
  energy: number;
  fixed: number;
  total: number;
};

const SLABS = [
  { upto: 100, rate: 5, label: "0 – 100" },
  { upto: 200, rate: 7, label: "101 – 200" },
  { upto: 300, rate: 8.5, label: "201 – 300" },
  { upto: Infinity, rate: 10, label: "300 +" },
];
const FIXED_CHARGE = 50;

const SAMPLE_CUSTOMERS: Customer[] = [
  { id: "C-1042", name: "Rahul Sharma", address: "12, MG Road, Bengaluru", meterNo: "MTR-88291", units: 185 },
  { id: "C-1043", name: "Ananya Iyer", address: "45, Church Street, Bengaluru", meterNo: "MTR-88292", units: 240 },
  { id: "C-1044", name: "Vikram Nair", address: "9, Residency Road, Bengaluru", meterNo: "MTR-88293", units: 95 },
];

let nextCustomerNum = 1045;

function computeSlabs(units: number) {
  let remaining = units;
  let prev = 0;
  const lines: BillLine[] = SLABS.map((s) => {
    const width = s.upto - prev;
    const u = Math.max(0, Math.min(remaining, width));
    remaining -= u;
    prev = s.upto;
    return { label: s.label, rate: s.rate, units: u, amount: u * s.rate };
  }).filter((l) => l.units > 0);
  const energy = lines.reduce((a, l) => a + l.amount, 0);
  return { lines, energy, fixed: FIXED_CHARGE, total: energy + FIXED_CHARGE };
}

export function ElectricityDemo() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [customers, setCustomers] = useState<Customer[]>(SAMPLE_CUSTOMERS);
  const [selectedId, setSelectedId] = useState<string | null>(SAMPLE_CUSTOMERS[0]?.id ?? null);
  const [unitsInput, setUnitsInput] = useState(String(SAMPLE_CUSTOMERS[0]?.units ?? ""));
  const [savedBills, setSavedBills] = useState<Record<string, Bill>>({});
  const [generatedBill, setGeneratedBill] = useState<Bill | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const [draft, setDraft] = useState({ name: "", address: "", meterNo: "", units: "" });

  const billingMonth = useMemo(
    () => new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    [],
  );

  const selectedCustomer = customers.find((c) => c.id === selectedId) ?? null;

  const parsedUnits = Number(unitsInput);
  const unitsValid = unitsInput.trim() !== "" && Number.isFinite(parsedUnits) && parsedUnits >= 0;
  const preview = unitsValid ? computeSlabs(parsedUnits) : null;

  function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setLoginError("Enter a username and password to continue.");
      return;
    }
    setLoginError("");
    setLoggedIn(true);
  }

  function selectCustomer(customer: Customer) {
    setSelectedId(customer.id);
    const saved = savedBills[customer.id];
    setUnitsInput(String(saved?.units ?? customer.units));
    setGeneratedBill(saved ?? null);
    setIsSaved(Boolean(saved));
  }

  function handleGenerateBill() {
    if (!selectedCustomer || !unitsValid) return;
    const calc = computeSlabs(parsedUnits);
    const bill: Bill = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      meterNo: selectedCustomer.meterNo,
      month: billingMonth,
      units: parsedUnits,
      ...calc,
    };
    setGeneratedBill(bill);
    setIsSaved(false);
    setCustomers((cs) =>
      cs.map((c) => (c.id === selectedCustomer.id ? { ...c, units: parsedUnits } : c)),
    );
  }

  function handleSaveBill() {
    if (!generatedBill) return;
    setSavedBills((b) => ({ ...b, [generatedBill.customerId]: generatedBill }));
    setIsSaved(true);
  }

  function addCustomer() {
    if (!draft.name.trim()) return;
    const units = Number(draft.units);
    const customer: Customer = {
      id: `C-${nextCustomerNum++}`,
      name: draft.name.trim(),
      address: draft.address.trim() || "Address not provided",
      meterNo: draft.meterNo.trim() || `MTR-${Math.floor(10000 + Math.random() * 89999)}`,
      units: Number.isFinite(units) && units >= 0 ? units : 0,
    };
    setCustomers((cs) => [...cs, customer]);
    setDraft({ name: "", address: "", meterNo: "", units: "" });
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md">
        <div className="surface-card rounded-3xl p-8">
          <div className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mauve">
            <Lock className="size-4 text-pink" /> Admin Login
          </div>
          <h3 className="font-display text-2xl">Electricity Management System</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage customers and generate bills.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="mt-6 space-y-4"
          >
            <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="mt-1 w-full rounded-full border border-border bg-secondary/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-pink"
              />
            </label>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-full border border-border bg-secondary/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-pink"
              />
            </label>
            {loginError ? <p className="text-xs text-destructive">{loginError}</p> : null}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-pink/20 px-5 py-2.5 text-sm transition-colors hover:bg-pink/30"
            >
              <LogIn className="size-4" /> Login
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo only — any username and password will do.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mauve">
          <Users className="size-4 text-pink" /> Admin Dashboard
        </div>
        <button
          onClick={() => setLoggedIn(false)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs transition-colors hover:bg-secondary"
        >
          <LogOut className="size-3.5" /> Log out
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card rounded-3xl p-6">
          <h3 className="mb-5 text-sm uppercase tracking-[0.25em] text-mauve">Customers</h3>
          <div className="space-y-3">
            {customers.map((c) => (
              <button
                key={c.id}
                onClick={() => selectCustomer(c)}
                className={`w-full rounded-2xl p-4 text-left transition-colors ${
                  c.id === selectedId
                    ? "bg-pink/15 ring-1 ring-pink/50"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.id} · {c.meterNo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-blush">{c.units} kWh</p>
                    {savedBills[c.id] ? (
                      <p className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        <CheckCircle2 className="size-3 text-pink" /> Bill saved
                      </p>
                    ) : null}
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{c.address}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl border border-dashed border-border p-4">
            <input
              placeholder="Customer name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="min-w-32 flex-1 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm outline-none focus:border-pink"
            />
            <input
              placeholder="Address"
              value={draft.address}
              onChange={(e) => setDraft({ ...draft, address: e.target.value })}
              className="min-w-32 flex-1 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm outline-none focus:border-pink"
            />
            <input
              placeholder="Meter no."
              value={draft.meterNo}
              onChange={(e) => setDraft({ ...draft, meterNo: e.target.value })}
              className="w-28 rounded-full border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-pink"
            />
            <input
              type="number"
              min={0}
              placeholder="Units"
              value={draft.units}
              onChange={(e) => setDraft({ ...draft, units: e.target.value })}
              className="w-20 rounded-full border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-pink"
            />
            <button
              onClick={addCustomer}
              className="inline-flex items-center gap-2 rounded-full bg-pink/20 px-4 py-2 text-sm transition-colors hover:bg-pink/30"
            >
              <Plus className="size-4" /> Add
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {selectedCustomer ? (
            <>
              <div className="surface-card rounded-3xl p-6">
                <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-mauve">
                  <User className="size-4 text-pink" /> {selectedCustomer.name}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedCustomer.id} · {selectedCustomer.meterNo}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{selectedCustomer.address}</p>

                <label className="mt-4 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Monthly units (kWh)
                  <input
                    type="number"
                    min={0}
                    value={unitsInput}
                    onChange={(e) => setUnitsInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm text-foreground outline-none focus:border-pink"
                  />
                </label>
                {!unitsValid ? (
                  <p className="mt-2 text-xs text-destructive">
                    Enter a valid number of units to calculate the bill.
                  </p>
                ) : null}

                {preview ? (
                  <table className="mt-4 w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        <th className="pb-2">Slab (kWh)</th>
                        <th className="pb-2">Units</th>
                        <th className="pb-2">Rate</th>
                        <th className="pb-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="text-foreground/85">
                      {preview.lines.map((l) => (
                        <tr key={l.label} className="border-t border-border">
                          <td className="py-2">{l.label}</td>
                          <td className="py-2">{l.units}</td>
                          <td className="py-2">₹{l.rate.toFixed(2)}</td>
                          <td className="py-2 text-right">₹{l.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-border">
                        <td className="py-2" colSpan={3}>
                          Fixed charges
                        </td>
                        <td className="py-2 text-right">₹{preview.fixed.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : null}

                <button
                  onClick={handleGenerateBill}
                  disabled={!unitsValid}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pink/20 px-4 py-2.5 text-sm transition-colors hover:bg-pink/30 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Zap className="size-4" /> Generate Bill
                </button>
              </div>

              {generatedBill ? (
                <div className="surface-card rounded-3xl p-6">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-mauve">
                      <Receipt className="size-4 text-pink" /> {isSaved ? "Saved Bill" : "Bill Generated"}
                    </div>
                    <span className="text-xs text-muted-foreground">{generatedBill.month}</span>
                  </div>

                  <div
                    className="rounded-3xl p-6 text-plum"
                    style={{ backgroundImage: "var(--gradient-aurora)", boxShadow: "var(--shadow-soft)" }}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-plum/80">
                      {generatedBill.customerName} · {generatedBill.meterNo}
                    </p>
                    <p className="mt-2 font-display text-4xl">₹{generatedBill.total.toFixed(2)}</p>
                    <p className="mt-2 text-sm text-plum/80">
                      {generatedBill.units} units consumed this month
                    </p>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-foreground/85">
                    {generatedBill.lines.map((l) => (
                      <div key={l.label} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {l.label} kWh × ₹{l.rate.toFixed(2)}
                        </span>
                        <span>₹{l.amount.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fixed charge</span>
                      <span>₹{generatedBill.fixed.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleSaveBill}
                      disabled={isSaved}
                      className="inline-flex items-center gap-2 rounded-full bg-pink/20 px-4 py-2 text-sm transition-colors hover:bg-pink/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 className="size-4" /> {isSaved ? "Bill saved" : "Save Bill"}
                    </button>
                    {isSaved ? (
                      <p className="text-xs text-muted-foreground">Bill saved successfully.</p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="surface-card rounded-3xl p-6 text-sm text-muted-foreground">
              Select a customer to generate their bill.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}