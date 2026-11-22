import { useEffect, useState } from "react";

interface Recipe {
  id: number;
  name: string;
}

export function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then(setRecipes)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main>
      <h1>Culinary Encyclopedia</h1>
      {error && <p>Could not load recipes: {error}</p>}
      <ul>
        {recipes.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </main>
  );
}
