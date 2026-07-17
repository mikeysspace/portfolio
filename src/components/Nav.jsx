import { Link } from "react-router-dom";
import { features, profile, sections } from "../content";
import { useTheme } from "../hooks/useTheme.js";
import Icon from "./Icon.jsx";

export default function Nav() {
  const [theme, toggle] = useTheme();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="nav-brand" to="/">
          {profile.name}
        </Link>
        <nav className="nav-links" aria-label="Sections">
          {/* Section links are absolute ("/#about") so they still work from a
              project page, where a bare "#about" would resolve against the
              project's URL and scroll nowhere. */}
          {sections.map(({ id, label }) => (
            <Link key={id} to={`/#${id}`}>
              {label}
            </Link>
          ))}
        </nav>
        {features.themeToggle && (
          <button
            className="icon-button"
            type="button"
            onClick={toggle}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
