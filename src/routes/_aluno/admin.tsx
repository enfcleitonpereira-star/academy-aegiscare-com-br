import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { LayoutDashboard, Users, BookOpen, Megaphone } from "lucide-react";

export const Route = createFileRoute("/_aluno/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Administração — Aegis Care Academy" }] }),
});

const tabs = [
  { to: "/aluno/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/aluno/admin/alunos", label: "Alunos", icon: Users },
  { to: "/aluno/admin/modulos", label: "Módulos & Aulas", icon: BookOpen },
  { to: "/aluno/admin/avisos", label: "Avisos", icon: Megaphone },
];

function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/aluno", replace: true });
  }, [loading, isAdmin, navigate]);

  if (loading || !isAdmin) return null;

  return (
    <AppShell title="Administração" subtitle="Gestão da Academy">
      <div className="max-w-6xl mx-auto">
        <nav className="flex flex-wrap gap-1 mb-10 border-b border-border/60">
          {tabs.map((t) => {
            const active = t.exact ? path === t.to : path.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex items-center gap-2 px-4 py-3 text-[0.86rem] border-b-2 transition-colors -mb-px ${
                  active
                    ? "border-ink text-ink font-medium"
                    : "border-transparent text-muted-foreground hover:text-ink"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </Link>
            );
          })}
        </nav>
        <Outlet />
      </div>
    </AppShell>
  );
}
