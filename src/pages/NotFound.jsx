import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";

export default function NotFound() {
  return (
    <section className="notfound">
      <p className="hero-kicker">404</p>
      <h1 className="hero-name">Page not found</h1>
      <p className="hero-tagline">
        That page doesn't exist — it may have moved or the link may be out of
        date.
      </p>
      <Link className="button primary" to="/">
        <Icon name="arrow-left" size={16} />
        Back home
      </Link>
    </section>
  );
}
