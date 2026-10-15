import { Link } from "react-router";

import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-semibold">Show Ticket</h1>
      <Button asChild>
        <Link to="/login">Entrar</Link>
      </Button>
    </main>
  );
}
