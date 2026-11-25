import type { Recipe } from "@culinary/shared";
import type { RecipeRepository } from "./recipe-repository";

export interface RecipeService {
  listRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
}

/** Business logic lives here. No HTTP, no SQL. The repository is injected so tests can fake it. */
export function createRecipeService(repo: RecipeRepository): RecipeService {
  return {
    listRecipes: () => repo.findAll(),
    getRecipe: (id) => repo.findById(id),
  };
}
