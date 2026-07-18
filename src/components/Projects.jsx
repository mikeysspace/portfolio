import { useMemo, useRef, useState } from "react";
import { projects } from "../content";
import Icon from "./Icon.jsx";
import ProjectCard from "./ProjectCard.jsx";
import Section from "./Section.jsx";

// --- Looping carousel -------------------------------------------------------
// How many cards are visible at once is set in CSS (--visible: 3 / 2 / 1 by
// breakpoint), so JS never needs to know it. The track always renders a fixed
// window of RENDERED slots — one parked off the left edge, up to three visible,
// and a buffer on the right — and slides exactly one slot per press.
//
// Looping is seamless: a press animates the track by one slot, then on
// transition-end we advance the logical index and snap the track back to its
// resting offset without animation. Because the slot at the resting offset now
// holds the next project, the snap is invisible. Both buffers mean there is
// always a card ready to slide in from either side, so it never runs out.
const RENDERED = 5; // 1 left buffer + up to 3 visible + 1 right buffer
const STEP = 100 / RENDERED; // one slot as a % of the track's own width (20%)
const REST = -1; // resting offset, in slots (one card parked off the left)
const SLOTS = [-1, 0, 1, 2, 3]; // slot positions relative to the logical index
const DURATION = 450;

const mod = (x, n) => ((x % n) + n) % n;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function Projects({ id, title }) {
  const sorted = useMemo(
    () =>
      [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)),
    []
  );
  const n = sorted.length;

  const [index, setIndex] = useState(0);
  const [frame, setFrame] = useState(REST); // -1 rest, -2 next target, 0 prev target
  const [animating, setAnimating] = useState(false);
  const lock = useRef(false); // ignore presses mid-slide
  const dir = useRef(0); // direction of the slide in progress
  const timer = useRef(null); // fallback if transitionend never fires

  if (n === 0) return null;

  // Advance the logical index and reset the track, without animation.
  function settle() {
    if (!lock.current) return;
    clearTimeout(timer.current);
    setAnimating(false);
    setIndex((i) => mod(i + dir.current, n));
    setFrame(REST);
    lock.current = false;
  }

  function go(step) {
    if (lock.current || n <= 1) return;
    if (prefersReducedMotion()) {
      setIndex((i) => mod(i + step, n));
      return;
    }
    lock.current = true;
    dir.current = step;
    setAnimating(true);
    setFrame(REST - step); // +1 -> -2 (slide left), -1 -> 0 (slide right)
    // transitionend is the primary trigger; this only fires if it doesn't.
    timer.current = setTimeout(settle, DURATION + 100);
  }

  const carousel = n > 1;
  const trackStyle = {
    transform: `translateX(${frame * STEP}%)`,
    transition: animating
      ? `transform ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
      : "none",
  };

  return (
    <Section id={id} title={title}>
      <div className={`projects-carousel${carousel ? "" : " is-static"}`}>
        {carousel && (
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => go(-1)}
            aria-label="Previous projects"
          >
            <Icon name="arrow-left" size={20} />
          </button>
        )}

        <div
          className="carousel-viewport"
          role="group"
          aria-roledescription="carousel"
          aria-label="Projects"
        >
          <ul
            className="carousel-track"
            style={trackStyle}
            onTransitionEnd={(e) => {
              if (e.propertyName === "transform") settle();
            }}
          >
            {carousel
              ? SLOTS.map((p) => {
                  const project = sorted[mod(index + p, n)];
                  return (
                    // Keyed by slot position, not project, so the DOM nodes
                    // persist across the snap and only their contents swap.
                    <li className="carousel-slot" key={p}>
                      <ProjectCard project={project} />
                    </li>
                  );
                })
              : sorted.map((project) => (
                  <li className="carousel-slot" key={project.slug}>
                    <ProjectCard project={project} />
                  </li>
                ))}
          </ul>
        </div>

        {carousel && (
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => go(1)}
            aria-label="Next projects"
          >
            <Icon name="arrow-right" size={20} />
          </button>
        )}
      </div>
    </Section>
  );
}
