import { sections } from "../content";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Experience from "../components/Experience.jsx";
import Projects from "../components/Projects.jsx";
import Achievements from "../components/Achievements.jsx";
import Skills from "../components/Skills.jsx";
import Media from "../components/Media.jsx";
import Contact from "../components/Contact.jsx";

// Section registry: maps a section id (see src/content/config.js) to the
// component that renders it. To add a new section: create a component,
// register it here, then add an entry to `sections` in the config.
const REGISTRY = {
  about: About,
  experience: Experience,
  projects: Projects,
  achievements: Achievements,
  skills: Skills,
  media: Media,
  contact: Contact,
};

export default function Home() {
  return (
    <>
      <Hero />
      {sections.map(({ id, label }) => {
        const SectionComponent = REGISTRY[id];
        return SectionComponent ? (
          <SectionComponent key={id} id={id} title={label} />
        ) : null;
      })}
    </>
  );
}
