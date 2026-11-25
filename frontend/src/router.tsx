import { createBrowserRouter } from "react-router";
import { AppLayout } from "./layout/AppLayout";
import { NotFoundPage } from "./layout/NotFoundPage";
import { RecipeDetailPage } from "./recipes/RecipeDetailPage";
import { RecipeListPage } from "./recipes/RecipeListPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <RecipeListPage /> },
      { path: "recipes/:id", element: <RecipeDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
