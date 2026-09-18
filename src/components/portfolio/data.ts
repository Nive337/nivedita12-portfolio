export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "creative", label: "Creative" },
  { id: "contact", label: "Contact" },
];

export const EDUCATION = [
  {
    period: "2024 — Present",
    title: "B.E. Computer Science and Design (CSD)",
    place: "PES Institute of Technology and Management, VTU",
    score: "CGPA 8.94 / 10",
  },
  {
    period: "PUC / 12th",
    title: "Pre-University",
    place: "DVS College, Karnataka",
    score: "86.16%",
  },
  {
    period: "SSLC / 10th",
    title: "Secondary School",
    place: "Ananda Sai Shikshan Samaste",
    score: "86.24%",
  },
];

export const SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["Java", "Python", "C", "C++", "SQL", "HTML", "CSS"],
  },
  {
    title: "Backend & Data",
    items: ["Spring Boot", "Maven", "JDBC", "MySQL", "REST APIs", "Database Management"],
  },
  {
    title: "Graphics & Creative Tech",
    items: ["OpenGL", "FreeGLUT", "Blender", "3D Modelling", "Animation Basics"],
  },
  {
    title: "Practice & Tooling",
    items: [
      "Object-Oriented Programming",
      "Data Structures & Algorithms",
      "GUI / Application Development",
      "API Integration",
      "Web Development",
    ],
  },
];

export const PROJECTS = [
  {
    name: "AskMyPdf — AI-Powered PDF Assistant",
    slug: "askmypdf",
    tag: "AI · Desktop",
    summary:
      "A desktop PDF assistant that extracts text, searches keywords, summarises content and answers questions about a document through an AI model.",
    detail:
      "Built the text-extraction pipeline with pdftotext, wired HTTP requests through libcurl and integrated the OpenAI API. It taught me file processing, API design and how traditional C programming can sit alongside AI services.",
    stack: ["C", "pdftotext", "libcurl", "OpenAI API"],
  },
  {
    name: "Electricity Management System",
    slug: "electricity-management",
    tag: "Full Stack · DBMS",
    summary:
      "A database-driven electricity usage and monitoring system covering consumption tracking, device-level calculations and slab-based billing.",
    detail:
      "Structured the app in an MVC style with Servlets and JSP, used JDBC for database access and modelled slab billing logic in SQL, with a plain HTML/CSS/JavaScript frontend.",
    stack: ["Java", "JSP", "Servlets", "JDBC", "MySQL", "JavaScript"],
  },
  {
    name: "Rubik's Cube Simulator",
    slug: "rubiks-cube",
    tag: "Graphics · 3D",
    summary:
      "A 3D Rubik's Cube simulator rendering an interactive cube with real-time rotations, built while exploring graphics programming.",
    detail:
      "Handled cube geometry, loading and rendering with OpenGL and FreeGLUT, and used Blender for the 3D model. Next steps: manual cube manipulation, colour selection and an automatic solver.",
    stack: ["C++", "OpenGL", "FreeGLUT", "Blender"],
  },
  {
    name: "Attendance Management System",
    slug: "attendance-management",
    tag: "Spring Boot · REST",
    summary:
      "A teacher-facing attendance system that records daily attendance, computes monthly percentages and flags students below the required threshold.",
    detail:
      "Designed entities, repositories and controllers in Spring Boot, exposed REST APIs, connected MySQL through JPA and built report pages on the frontend.",
    stack: ["Java", "Spring Boot", "Maven", "MySQL", "HTML", "CSS", "JavaScript"],
  },
];

export const CERTIFICATIONS = [
  { name: "Database Management System", issuer: "NPTEL" },
  { name: "Introduction to C Programming", issuer: "NPTEL" },
  { name: "Programming in Java", issuer: "Infosys Springboard" },
  { name: "Data Structures and Algorithms", issuer: "Infosys Springboard" },
  { name: "C Programming Course", issuer: "Infosys Springboard" },
  { name: "TechBytes Quiz Competition — Participant", issuer: "TCS" },
];

export const CREATIVE = [
  {
    title: "Digital Art & Sketching",
    body: "Drawing is where I think visually. It keeps my sense of composition, colour and detail sharp — the same instincts I bring to interfaces.",
  },
  {
    title: "Animation & Blender",
    body: "Experimenting with 3D work and animation principles like squash and stretch, and connecting that curiosity back to graphics programming.",
  },
  {
    title: "Video Editing & YouTube",
    body: "I run a YouTube channel focused on BTS edits and short-form content, where I study pacing, rhythm and what makes a short video actually land.",
  },
  {
    title: "Game Design & Creative Coding",
    body: "Long-term, I want to combine programming, art and animation — interactive applications, graphics and game development.",
  },
];

export const FOCUS_AREAS = [
  "Java",
  "Python",
  "DSA",
  "SQL & DBMS",
  "OOP",
  "Spring Boot",
  "APIs",
  "Git / GitHub",
  "Problem Solving",
];
