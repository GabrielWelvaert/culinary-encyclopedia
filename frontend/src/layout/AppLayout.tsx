import { Link, Outlet } from "react-router";
import { ThemeToggle } from "../theme/ThemeToggle";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 z-40 w-full border-b border-border bg-bg shadow-lg">
        <div className="mx-auto flex h-16 max-w-page items-center gap-5 px-4">
          <ThemeToggle />
          <Link
            to="/"
            className="text-2xl text-muted transition-colors duration-200 select-none hover:text-accent"
          >
            Culinary Encyclopedia
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-page flex-1 px-4 pt-24 pb-8">
        <Outlet />
      </main>
    </div>
  );
}
