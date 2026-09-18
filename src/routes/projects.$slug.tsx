import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PROJECTS } from "@/components/portfolio/data";
import { Reveal } from "@/components/portfolio/Reveal";
import { PdfDemo } from "@/components/portfolio/demos/PdfDemo";
import { ElectricityDemo } from "@/components/portfolio/demos/ElectricityDemo";
import { CubeDemo } from "@/components/portfolio/demos/CubeDemo";
import { AttendanceDemo } from "@/components/portfolio/demos/AttendanceDemo";

const DEMOS: Record<string, { note: string; render: () => React.ReactNode }> = {
  askmypdf: {
    note: "A browser-side recreation of the C pipeline: paste any document, then extract stats, search passages, generate an extractive summary and ask questions answered from the text itself.",
    render: () => <PdfDemo />,
  },
  "electricity-management": {
    note: "The billing engine from the DBMS project, running live: edit the connected load and watch monthly units and slab-wise charges recompute the way the SQL logic does.",
    render: () => <ElectricityDemo />,
  },
  "rubiks-cube": {
    note: "The same cube state machine as the OpenGL build, rendered in CSS 3D. Turn any face, scramble it, and drag to orbit the camera.",
    render: () => <CubeDemo />,
  },
  "attendance-management": {
    note: "The teacher-facing flow from the Spring Boot project: mark the daily register, add students and watch monthly percentages and the 75% shortage flag update instantly.",
    render: () => <AttendanceDemo />,
  },
};

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.slug === params.slug);
    if (!project || !DEMOS[params.slug]) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project not found — Nivedita K Raikar" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.project.name} — Live Demo | Nivedita K Raikar`;
    const description = loaderData.project.summary;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectPage,
});

function ProjectNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl">This project does not exist</h1>
      <Link to="/" className="mt-6 rounded-full bg-pink/20 px-6 py-3 text-sm">
        Back to portfolio
      </Link>
    </main>
  );
}

function ProjectPage() {
  const { project } = Route.useLoaderData();
  const demo = DEMOS[project.slug]!;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
        <Link
          to="/"
          hash="projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to portfolio
        </Link>

        <Reveal>
          <header className="mt-8 max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-mauve">{project.tag}</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{project.name}</h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{project.detail}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="rounded-full border border-border px-3 py-1 text-xs text-foreground/80">
                  {s}
                </span>
              ))}
            </div>
          </header>
        </Reveal>

        <Reveal delay={100}>
          <section className="mt-14">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-mauve">Live demo</p>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-foreground/80">{demo.note}</p>
            {demo.render()}
          </section>
        </Reveal>

        <Reveal delay={150}>
          <nav className="mt-16 border-t border-border pt-8">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">Other demos</p>
            <div className="flex flex-wrap gap-3">
              {PROJECTS.filter((p) => p.slug !== project.slug).map((p) => (
                <Link
                  key={p.slug}
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="rounded-full bg-secondary px-4 py-2 text-sm transition-colors hover:bg-pink/25"
                >
                  {p.name.split("—")[0]!.trim()}
                </Link>
              ))}
            </div>
          </nav>
        </Reveal>
      </div>
    </main>
  );
}
