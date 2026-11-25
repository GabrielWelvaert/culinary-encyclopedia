import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { recipeQueries } from "./recipe-queries";

export function RecipeListPage() {
  const { data: recipes, isPending, error } = useQuery(recipeQueries.list());

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl">Recipes</h1>

      {isPending && <p className="text-muted">Loading…</p>}
      {error && <p>Could not load recipes: {error.message}</p>}

      {recipes && recipes.length === 0 && <p className="text-muted">No recipes yet.</p>}

      {recipes && recipes.length > 0 && (
        <ul className="flex flex-col gap-2">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link
                to={`/recipes/${recipe.id}`}
                className="transition-colors duration-200 hover:text-accent"
              >
                {recipe.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
