import { ArrowDownRight, Sparkles } from "lucide-react";
import heroAura from "@/assets/hero-aura.jpg";

const STATS = [
  { value: "8.94", label: "CGPA / 10" },
  { value: "4+", label: "Built projects" },
  { value: "6", label: "Certifications" },
];

export function Hero() {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div
        className="aurora-blob animate-float-slow -left-32 top-0 size-[28rem]"
        style={{ background: "#837ab6" }}
      />
      <div
        className="aurora-blob animate-float-slow -right-24 top-40 size-[24rem]"
        style={{ background: "#f6a5c0", animationDelay: "3s" }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-mauve">
            <Sparkles className="size-3.5" />
            CSD Engineering Student
          </p>

          <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Nivedita
            <br />
            <span className="text-gradient">K Raikar</span>
          </h1>

          <p className="font-script mt-4 text-2xl text-pink">an analytical mind with a creative pulse</p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            I’m a Computer Science and Design student at PES Institute of Technology and Management, 
            and I enjoy working where technology meets creativity. I like building things that combine 
            software, databases, and problem-solving with my interests in graphics, animation, and 3D. 
            More than just making something work, I’m curious about how it works, why it works, 
            and how I can make it better.

          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={() => go("projects")}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              style={{ backgroundImage: "var(--gradient-text)", boxShadow: "var(--shadow-glow)" }}
            >
              View my projects
              <ArrowDownRight className="size-4" />
            </button>
            <button
              onClick={() => go("contact")}
              className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors duration-300 hover:border-pink"
            >
              Get in touch
            </button>
          </div>

          <div className="mt-12 flex flex-wrap gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl text-blush">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            className="overflow-hidden rounded-[2.5rem] border border-border"
            style={{ boxShadow: "var(--shadow-soft), var(--shadow-glow)" }}
          >
            <img
              src={heroAura}
              alt="Soft plum and pink gradient artwork representing a creative technology portfolio"
              width={1440}
              height={1088}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="surface-card mt-[-3rem] ml-6 mr-[-1rem] rounded-3xl p-5 backdrop-blur-xl sm:mr-6">
            <p className="text-xs uppercase tracking-[0.25em] text-mauve">Currently</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              Currently building and improving my skills through real-world projects, 
              web development, Java, and backend development, while preparing for internships 
              and campus placements.

            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
