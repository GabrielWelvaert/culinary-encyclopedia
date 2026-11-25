import { describe, expect, it } from "vitest";
import type { Recipe } from "@culinary/shared";
import type { RecipeRepository } from "./recipe-repository";
import { createRecipeService } from "./recipe-service";

const stew: Recipe = { id: 1, name: "Beef Stew" };

const fakeRepo: RecipeRepository = {
  findAll: async () => [stew],
  findById: async (id) => (id === stew.id ? stew : undefined),
};

describe("recipe service", () => {
  const service = createRecipeService(fakeRepo);

  it("lists recipes", async () => {
    expect(await service.listRecipes()).toEqual([stew]);
  });

  it("returns undefined for a missing recipe", async () => {
    expect(await service.getRecipe(999)).toBeUndefined();
  });
});
