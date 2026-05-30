import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_aluno")({
  component: AlunoLayout,
});

function AlunoLayout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login", replace: true });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-ink animate-pulse rounded-full" />
        </div>
      </div>
    );
  }
  return <Outlet />;
}
