// API contract shared by frontend and backend.
// Types only: consumers use `import type`, so nothing here exists at runtime
// and no build step is needed. Adding runtime code (e.g. validation schemas)
// would require bundling this package into the Lambda and the frontend.
export type { Recipe } from "./recipes";
