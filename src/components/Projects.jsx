import { Link } from "react-router-dom";
import { projects } from "../content";
import { asset } from "../lib/asset.js";
import Icon from "./Icon.jsx";
import Section from "./Section.jsx";

export default function Projects({ id, title }) {
  if (!projects.length) return null;
  const sorted = [...projects].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

  return (
    <Section id={id} title={title}>
      <div className="card-grid">
        {sorted.map((project) => (
          <article className="card" key={project.slug}>
            {project.image && (
              <Link to={`/projects/${project.slug}`} tabIndex={-1} aria-hidden="true">
                <img
                  className="card-image"
                  src={asset(project.image)}
                  alt={project.name}
                  loading="lazy"
                />
              </Link>
            )}
            <div className="card-body">
              <h3 className="card-title">
                <Link to={`/projects/${project.slug}`}>{project.name}</Link>
                {project.featured && <span className="badge">Featured</span>}
              </h3>
              <p className="card-text">{project.description}</p>
              {project.tags?.length > 0 && (
                <ul className="chips">
                  {project.tags.map((tag) => (
                    <li className="chip" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              <div className="card-links">
                <Link className="card-cta" to={`/projects/${project.slug}`}>
                  View project
                  <Icon name="arrow-right" size={15} />
                </Link>
                {project.links?.demo && (
                  <a href={project.links.demo} target="_blank" rel="noreferrer">
                    <Icon name="external" size={15} />
                    Live
                  </a>
                )}
                {project.links?.source && (
                  <a
                    href={project.links.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="github" size={15} />
                    Code
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
