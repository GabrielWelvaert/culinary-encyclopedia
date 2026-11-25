import { queryOptions } from "@tanstack/react-query";
import type { Recipe } from "@culinary/shared";
import { getJson } from "../api/http";

export const recipeQueries = {
  list: () =>
    queryOptions({
      queryKey: ["recipes"],
      queryFn: ({ signal }) => getJson<Recipe[]>("/recipes", signal),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ["recipes", id],
      queryFn: ({ signal }) => getJson<Recipe>(`/recipes/${id}`, signal),
    }),
};
