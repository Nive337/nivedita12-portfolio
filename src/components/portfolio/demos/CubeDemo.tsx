import { useEffect, useRef, useState } from "react";
import { RotateCcw, Shuffle } from "lucide-react";

type Face = "U" | "R" | "F" | "D" | "L" | "B";
type State = Record<Face, string[]>;

const COLORS: Record<Face, string> = {
  U: "#f6f2f7",
  R: "#e35d6a",
  F: "#5cc98c",
  D: "#f4d35e",
  L: "#f09a4e",
  B: "#5b8ff9",
};

const solved = (): State =>
  (Object.keys(COLORS) as Face[]).reduce((acc, f) => {
    acc[f] = Array(9).fill(COLORS[f]);
    return acc;
  }, {} as State);

const ROT = [6, 3, 0, 7, 4, 1, 8, 5, 2];

const SIDES: Record<Face, [Face, number][][]> = {
  U: [
    ["F", 0],
    ["R", 0],
    ["B", 0],
    ["L", 0],
  ].map(([f, o]) => [0, 1, 2].map((i) => [f as Face, (o as number) + i] as [Face, number])),
  D: [
    ["F", 6],
    ["L", 6],
    ["B", 6],
    ["R", 6],
  ].map(([f, o]) => [0, 1, 2].map((i) => [f as Face, (o as number) + i] as [Face, number])),
  R: [
    [["F", 2], ["F", 5], ["F", 8]],
    [["D", 2], ["D", 5], ["D", 8]],
    [["B", 6], ["B", 3], ["B", 0]],
    [["U", 2], ["U", 5], ["U", 8]],
  ] as [Face, number][][],
  L: [
    [["F", 0], ["F", 3], ["F", 6]],
    [["U", 0], ["U", 3], ["U", 6]],
    [["B", 8], ["B", 5], ["B", 2]],
    [["D", 0], ["D", 3], ["D", 6]],
  ] as [Face, number][][],
  F: [
    [["U", 6], ["U", 7], ["U", 8]],
    [["L", 8], ["L", 5], ["L", 2]],
    [["D", 2], ["D", 1], ["D", 0]],
    [["R", 0], ["R", 3], ["R", 6]],
  ] as [Face, number][][],
  B: [
    [["U", 0], ["U", 1], ["U", 2]],
    [["R", 2], ["R", 5], ["R", 8]],
    [["D", 8], ["D", 7], ["D", 6]],
    [["L", 0], ["L", 3], ["L", 6]],
  ] as [Face, number][][],
};

function turn(state: State, face: Face, prime = false): State {
  const next: State = (Object.keys(state) as Face[]).reduce((acc, f) => {
    acc[f] = [...state[f]];
    return acc;
  }, {} as State);

  // rotate the face itself
  for (let i = 0; i < 9; i++)
    next[face][i] = state[face][prime ? ROT.indexOf(i) : (ROT[i] as number)] as string;

  // cycle the adjacent strips
  const cycle = SIDES[face];
  for (let c = 0; c < 4; c++) {
    const from = cycle[prime ? (c + 1) % 4 : (c + 3) % 4]!;
    const to = cycle[c]!;
    for (let i = 0; i < 3; i++) {
      const [tf, ti] = to[i]!;
      const [ff, fi] = from[i]!;
      next[tf][ti] = state[ff][fi] as string;
    }
  }
  return next;
}

const FACE_TRANSFORM: Record<Face, string> = {
  U: "rotateX(90deg) translateZ(90px)",
  D: "rotateX(-90deg) translateZ(90px)",
  F: "translateZ(90px)",
  B: "rotateY(180deg) translateZ(90px)",
  L: "rotateY(-90deg) translateZ(90px)",
  R: "rotateY(90deg) translateZ(90px)",
};

const MOVES: Face[] = ["U", "D", "L", "R", "F", "B"];

export function CubeDemo() {
  const [state, setState] = useState<State>(solved);
  const [history, setHistory] = useState<string[]>([]);
  const [angle, setAngle] = useState({ x: -24, y: -32 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current = { x: e.clientX, y: e.clientY };
      setAngle((a) => ({ x: Math.max(-85, Math.min(85, a.x - dy * 0.4)), y: a.y + dx * 0.4 }));
    };
    const up = () => (drag.current = null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const apply = (f: Face, prime: boolean) => {
    setState((s) => turn(s, f, prime));
    setHistory((h) => [...h.slice(-19), `${f}${prime ? "'" : ""}`]);
  };

  const scramble = () => {
    let s = state;
    const moves: string[] = [];
    for (let i = 0; i < 20; i++) {
      const f = MOVES[Math.floor(Math.random() * 6)] as Face;
      const p = Math.random() > 0.5;
      s = turn(s, f, p);
      moves.push(`${f}${p ? "'" : ""}`);
    }
    setState(s);
    setHistory(moves.slice(-20));
  };

  const isSolved = (Object.keys(state) as Face[]).every((f) =>
    state[f].every((c) => c === state[f][4]),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div
        className="surface-card flex touch-none select-none items-center justify-center rounded-3xl p-6"
        style={{ minHeight: 380, perspective: "900px" }}
        onPointerDown={(e) => (drag.current = { x: e.clientX, y: e.clientY })}
      >
        <div
          style={{
            width: 180,
            height: 180,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(${angle.x}deg) rotateY(${angle.y}deg)`,
            transition: "transform 120ms linear",
          }}
        >
          {(Object.keys(COLORS) as Face[]).map((f) => (
            <div
              key={f}
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 4,
                padding: 4,
                borderRadius: 10,
                background: "#1a1020",
                transform: FACE_TRANSFORM[f],
                backfaceVisibility: "hidden",
              }}
            >
              {state[f].map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: c,
                    borderRadius: 6,
                    boxShadow: "inset 0 0 6px rgba(0,0,0,0.25)",
                    transition: "background 300ms ease",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="surface-card rounded-3xl p-6">
          <h3 className="mb-4 text-sm uppercase tracking-[0.25em] text-mauve">Moves</h3>
          <div className="grid grid-cols-3 gap-3">
            {MOVES.map((f) => (
              <div key={f} className="flex gap-1">
                <button
                  onClick={() => apply(f, false)}
                  className="flex-1 rounded-l-full bg-secondary py-2.5 text-sm transition-colors hover:bg-pink/25"
                >
                  {f}
                </button>
                <button
                  onClick={() => apply(f, true)}
                  className="flex-1 rounded-r-full bg-secondary py-2.5 text-sm transition-colors hover:bg-pink/25"
                >
                  {f}'
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <button
              onClick={scramble}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-pink/20 py-2.5 text-sm transition-colors hover:bg-pink/30"
            >
              <Shuffle className="size-4" /> Scramble
            </button>
            <button
              onClick={() => {
                setState(solved());
                setHistory([]);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-2.5 text-sm transition-colors hover:bg-secondary"
            >
              <RotateCcw className="size-4" /> Reset
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Drag the cube to orbit the camera. {isSolved ? "Cube is solved." : "Cube is scrambled."}
          </p>
        </div>

        <div className="surface-card rounded-3xl p-6">
          <h3 className="mb-3 text-sm uppercase tracking-[0.25em] text-mauve">Move log</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {history.length === 0 ? (
              <p className="text-muted-foreground">No moves yet.</p>
            ) : (
              history.map((m, i) => (
                <span key={i} className="rounded-full bg-secondary px-3 py-1 font-mono text-xs">
                  {m}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
