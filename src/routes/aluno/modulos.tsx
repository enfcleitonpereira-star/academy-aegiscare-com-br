import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Lock } from "lucide-react";

export const Route = createFileRoute("/aluno/modulos")({
  component: ModulesPage,
  head: () => ({ meta: [{ title: "Módulos — Aegis Care Academy" }] }),
});

function ModulesPage() {
  const { profile } = useAuth();
  const isActive = profile?.access_status === "active";
  const { data: modules = [] } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const { data } = await supabase.from("modules").select("*").order("order_index");
      return data ?? [];
    },
  });

  return (
    <AppShell title="Módulos" subtitle="Formação em assistência domiciliar · 180h">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <span className="eyebrow">Formação completa</span>
          <h2 className="display text-4xl mt-3 max-w-2xl">8 módulos. 180 horas. Uma formação que respeita quem cuida.</h2>
        </header>

        <div className="grid md:grid-cols-2 gap-5">
          {modules.map((m: any) => {
            const locked = !isActive;
            const Card = locked ? "div" : Link;
            return (
              <Card
                key={m.id}
                {...(!locked && { to: "/aluno/modulos/$id" as any, params: { id: m.id } })}
                className={`module-card group block ${locked ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="h-12 w-12 rounded-xl bg-ink text-white flex items-center justify-center text-[0.92rem] font-light">
                    {String(m.order_index).padStart(2, "0")}
                  </div>
                  {locked ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-gold group-hover:rotate-12 transition-all" />
                  )}
                </div>
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mid">Módulo {m.order_index} · {m.hours}h</p>
                <h3 className="text-[1.15rem] font-medium mt-2 leading-snug">{m.title}</h3>
                <p className="text-[0.88rem] text-muted-foreground mt-3 leading-relaxed">{m.description}</p>
                <div className="mt-6 pt-5 border-t border-border/50 flex items-center gap-3">
                  <Progress value={0} className="h-1 flex-1" />
                  <span className="text-[0.72rem] text-muted-foreground tabular-nums">{locked ? "—" : "0%"}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
