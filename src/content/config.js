// ---------------------------------------------------------------------------
// Site configuration: global settings, feature flags, and section layout.
// ---------------------------------------------------------------------------

export const site = {
  title: "Isa Mukaramov · Portfolio", // browser tab title
  description: "Portfolio of Isa Mukaramov, projects, experience, and more.",
};

// Feature flags. Flip to false to disable a feature everywhere.
export const features = {
  themeToggle: true, // light/dark switch in the nav
};

// Sections, in display order. This single list drives both the page layout
// and the nav links: remove (or comment out) a line to hide a section,
// reorder lines to reorder the page, edit `label` to rename it.
// Each `id` must match a key in the section registry (src/App.jsx).
export const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Education" },
  { id: "skills", label: "Skills" },
  // { id: "media", label: "Media" }, // hidden: nothing to put here yet
  { id: "contact", label: "Contact" },
];
