import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl">Not found</h1>
      <p className="text-muted">That page doesn't exist.</p>
      <Link to="/" className="transition-colors duration-200 hover:text-accent">
        ← All recipes
      </Link>
    </section>
  );
}
