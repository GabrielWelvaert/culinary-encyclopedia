import type { Pool } from "pg";

export interface Recipe {
  id: number;
  name: string;
  createdAt: Date;
}

export interface RecipeRepository {
  findAll(): Promise<Recipe[]>;
  findById(id: number): Promise<Recipe | undefined>;
}

interface RecipeRow {
  id: number;
  name: string;
  created_at: Date;
}

const toRecipe = (row: RecipeRow): Recipe => ({
  id: row.id,
  name: row.name,
  createdAt: row.created_at,
});

export function createRecipeRepository(pool: Pool): RecipeRepository {
  return {
    async findAll() {
      const { rows } = await pool.query<RecipeRow>(
        "SELECT id, name, created_at FROM recipes ORDER BY name",
      );
      return rows.map(toRecipe);
    },

    async findById(id) {
      const { rows } = await pool.query<RecipeRow>(
        "SELECT id, name, created_at FROM recipes WHERE id = $1",
        [id],
      );
      return rows[0] ? toRecipe(rows[0]) : undefined;
    },
  };
}
