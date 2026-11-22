import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { getPool } from "../shared/database";
import { createRecipeRepository } from "./recipe-repository";
import { createRecipeService } from "./recipe-service";

const json = (statusCode: number, body: unknown): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

/** Lambda entry point: translate HTTP <-> service calls. */
export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> {
  const service = createRecipeService(createRecipeRepository(getPool()));

  switch (event.routeKey) {
    case "GET /recipes":
      return json(200, await service.listRecipes());

    case "GET /recipes/{id}": {
      const id = Number(event.pathParameters?.id);
      if (!Number.isInteger(id)) return json(400, { message: "id must be an integer" });
      const recipe = await service.getRecipe(id);
      return recipe ? json(200, recipe) : json(404, { message: "Recipe not found" });
    }

    default:
      return json(404, { message: "Not found" });
  }
}
