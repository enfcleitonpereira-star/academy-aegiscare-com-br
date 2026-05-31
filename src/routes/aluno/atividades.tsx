import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { ListChecks, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/aluno/atividades")({
  component: AtividadesPage,
  head: () => ({ meta: [{ title: "Atividades — Aegis Care Academy" }] }),
});

function AtividadesPage() {
  const { user } = useAuth();
  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data } = await supabase.from("activities").select("*, modules(title, order_index)").order("created_at");
      return data ?? [];
    },
  });
  const { data: subs = [] } = useQuery({
    queryKey: ["subs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("activity_submissions").select("*").eq("user_id", user!.id);
      return data ?? [];
    },
  });

  return (
    <AppShell title="Atividades" subtitle="Fixação do conhecimento">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <span className="eyebrow">Aprendizagem ativa</span>
          <h2 className="display text-4xl mt-3 max-w-2xl">Atividades de fixação cuidadosamente preparadas.</h2>
        </header>

        <div className="space-y-3">
          {activities.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
              <ListChecks className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p>Atividades serão publicadas conforme os módulos avançam.</p>
            </div>
          )}
          {activities.map((a: any) => {
            const sub = subs.find((s: any) => s.activity_id === a.id);
            return (
              <div key={a.id} className="glass rounded-2xl p-6 flex items-center gap-5">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <ListChecks className="h-5 w-5 text-mid" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mid">{a.modules?.title}</p>
                  <h3 className="text-[1rem] font-medium mt-1">{a.title}</h3>
                  <p className="text-[0.85rem] text-muted-foreground mt-1.5">{a.description}</p>
                </div>
                {sub ? (
                  <div className="flex items-center gap-2 text-mid">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-[0.85rem] font-medium tabular-nums">{Number(sub.score ?? 0).toFixed(1)}</span>
                  </div>
                ) : (
                  <button className="btn-ghost text-[0.82rem] py-2 px-4">Iniciar</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
