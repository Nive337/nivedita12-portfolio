import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "./data";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const offsets = NAV_LINKS.map((l) => {
        const el = document.getElementById(l.id);
        return { id: l.id, top: el ? Math.abs(el.getBoundingClientRect().top - 120) : Infinity };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0]) setActive(offsets[0].id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}
      style={
        scrolled
          ? { backgroundColor: "oklch(0.163 0.056 320.5 / 0.72)", borderBottom: "1px solid var(--border)" }
          : undefined
      }
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button onClick={() => go("home")} className="font-display text-xl tracking-wide">
          <span className="text-gradient">Nivedita</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                active === link.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          className="rounded-full border border-border p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div
          className="border-t border-border px-6 pb-6 md:hidden"
          style={{ backgroundColor: "oklch(0.163 0.056 320.5 / 0.95)" }}
        >
          <div className="flex flex-col pt-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className="border-b border-border/60 py-3 text-left text-sm text-muted-foreground"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
