import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  GraduationCap,
  Mail,
  Github,
  Linkedin,
  Youtube,
  ChevronDown,
  PlayCircle,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import {
  CERTIFICATIONS,
  CREATIVE,
  EDUCATION,
  FOCUS_AREAS,
  PROJECTS,
  SKILL_GROUPS,
} from "./data";

function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto max-w-6xl px-6 py-24 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About Me"
        title="A student turning scattered curiosity into real, explainable skill."
      />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              I am pursuing my B.E. in Computer Science and Design at PES Institute of Technology and
              Management, affiliated with VTU, which I started in 2024. My work so far spans desktop
              applications in C, database-driven Java systems, Spring Boot REST APIs and 3D graphics
              with OpenGL.
            </p>
            <p>
              I am introverted and analytical — an INTP — so I would rather understand why something
              works than memorise that it does. I learn best step by step, visually, and when the
              concept is tied to something I am actually building.
            </p>
            <p>
              Right now my focus is depth: writing better Java, getting comfortable with data
              structures and algorithms, and being able to explain every technical decision in my
              projects clearly instead of reciting definitions.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {FOCUS_AREAS.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-border px-3 py-1 text-xs text-foreground/80"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="space-y-4">
          {EDUCATION.map((e, i) => (
            <Reveal key={e.title} delay={i * 100}>
              <div className="surface-card rounded-3xl p-6">
                <div className="mb-3 flex items-center gap-3">
                  <GraduationCap className="size-4 text-pink" />
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {e.period}
                  </p>
                </div>
                <h3 className="text-lg font-medium">{e.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{e.place}</p>
                <p className="mt-3 font-display text-xl text-blush">{e.score}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Skills"
        title="What I build with"
        note="Grouped by how I actually use them — from language fundamentals to backend services and graphics work."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {SKILL_GROUPS.map((group, i) => (
          <Reveal key={group.title} delay={i * 90}>
            <div className="surface-card h-full rounded-3xl p-7">
              <h3 className="mb-5 text-sm uppercase tracking-[0.25em] text-mauve">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-secondary px-3.5 py-1.5 text-sm text-foreground/90"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Projects() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects"
        title="Things I have built, broken and fixed"
        note="Each of these started as a question I wanted answered. Open one to see how it was put together."
      />
      <div className="grid gap-5">
        {PROJECTS.map((p, i) => {
          const open = openIndex === i;
          return (
            <Reveal key={p.name} delay={i * 80}>
              <article className="surface-card overflow-hidden rounded-3xl">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-start justify-between gap-6 p-7 text-left"
                >
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.25em] text-mauve">{p.tag}</p>
                    <h3 className="text-xl font-medium sm:text-2xl">{p.name}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {p.summary}
                    </p>
                  </div>
                  <ChevronDown
                    className={`mt-1 size-5 shrink-0 text-pink transition-transform duration-500 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className="grid transition-all duration-500 ease-out"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-border px-7 py-6">
                      <p className="max-w-2xl text-sm leading-relaxed text-foreground/85">
                        {p.detail}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <Link
                        to="/projects/$slug"
                        params={{ slug: p.slug }}
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-pink/20 px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-pink/30"
                      >
                        <PlayCircle className="size-4" /> Open live demo
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

export function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeading
        eyebrow="Certifications"
        title="Courses and competitions"
        note="Certificates are a starting point, not the proof — but these are where a lot of my fundamentals were shaped."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((c, i) => (
          <Reveal key={c.name} delay={i * 70}>
            <div className="surface-card h-full rounded-3xl p-6">
              <Award className="mb-4 size-5 text-pink" />
              <h3 className="text-base font-medium leading-snug">{c.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {c.issuer}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Creative() {
  return (
    <Section id="creative">
      <SectionHeading
        eyebrow="Creative Interests"
        title="The other half of how I think"
        note="I do not separate programming from art. The creative side is where a lot of my problem solving comes from."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {CREATIVE.map((c, i) => (
          <Reveal key={c.title} delay={i * 90}>
            <div className="surface-card h-full rounded-3xl p-7">
              <h3 className="font-display text-2xl text-blush">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200}>
        <p className="font-script mt-10 text-center text-2xl text-pink">
          programming, art and animation belong in the same sketchbook
        </p>
      </Reveal>
    </Section>
  );
}

export function Contact() {
  return (
    <Section id="contact">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center sm:px-16"
          style={{ backgroundImage: "var(--gradient-aurora)", boxShadow: "var(--shadow-soft)" }}
        >
          <div className="relative mx-auto max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-plum/80">Contact</p>
            <h2 className="font-display text-4xl leading-tight text-plum sm:text-5xl">
              Let's build something thoughtful together
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-plum/80 sm:text-base">
              I am looking for software development internships where I can learn seriously, ship
              real work and keep growing as an engineer. I would love to hear from you.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:niveditakraikar@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3 text-sm font-medium text-blush transition-transform duration-300 hover:-translate-y-0.5"
              >
                <Mail className="size-4" />
                Email me
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-plum/30 px-6 py-3 text-sm font-medium text-plum transition-colors duration-300 hover:bg-plum/10"
              >
                <Github className="size-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-plum/30 px-6 py-3 text-sm font-medium text-plum transition-colors duration-300 hover:bg-plum/10"
              >
                <Linkedin className="size-4" />
                LinkedIn
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-plum/30 px-6 py-3 text-sm font-medium text-plum transition-colors duration-300 hover:bg-plum/10"
              >
                <Youtube className="size-4" />
                YouTube
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      <footer className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Nivedita K Raikar — Karnataka, India</p>
        <p className="font-script text-base text-mauve">made with curiosity</p>
      </footer>
    </Section>
  );
}
