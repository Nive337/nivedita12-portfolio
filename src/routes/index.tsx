import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import {
  About,
  Certifications,
  Contact,
  Creative,
  Projects,
  Skills,
} from "@/components/portfolio/Sections";

const title = "Nivedita K Raikar — CSD Student & Creative Developer";
const description =
  "Portfolio of Nivedita K Raikar, a Computer Science and Design student building Java, Spring Boot, database and 3D graphics projects with a creative, artistic edge.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <Creative />
      <Contact />
    </main>
  );
}
