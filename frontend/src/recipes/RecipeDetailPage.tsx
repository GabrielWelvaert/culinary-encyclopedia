import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { HttpError } from "../api/http";
import { NotFoundPage } from "../layout/NotFoundPage";
import { recipeQueries } from "./recipe-queries";

export function RecipeDetailPage() {
  const id = Number(useParams().id);
  const validId = Number.isInteger(id) && id > 0;

  const { data: recipe, isPending, error } = useQuery({
    ...recipeQueries.detail(id),
    enabled: validId,
  });

  if (!validId || (error instanceof HttpError && error.status === 404)) {
    return <NotFoundPage />;
  }

  return (
    <section className="flex flex-col gap-4">
      <Link to="/" className="text-muted transition-colors duration-200 hover:text-accent">
        ← All recipes
      </Link>

      {isPending && <p className="text-muted">Loading…</p>}
      {error && <p>Could not load recipe: {error.message}</p>}
      {recipe && <h1 className="text-2xl">{recipe.name}</h1>}
    </section>
  );
}
