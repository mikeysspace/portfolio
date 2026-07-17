import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { site } from "./content";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import NotFound from "./pages/NotFound.jsx";

// Navigating to a new page should start at the top, but a link carrying a
// hash (e.g. "/#projects") should land on that section instead. Without this,
// React Router preserves the previous scroll position on every navigation.
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // The target section may mount in the same tick as this effect, so
      // defer the lookup by a frame to make sure it's in the DOM.
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  useEffect(() => {
    document.title = site.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", site.description);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
