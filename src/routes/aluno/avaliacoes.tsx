import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { ClipboardCheck, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/_aluno/avaliacoes")({
  component: AvaliacoesPage,
  head: () => ({ meta: [{ title: "Avaliações — Aegis Care Academy" }] }),
});

function AvaliacoesPage() {
  const { user } = useAuth();
  const { data: exams = [] } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data } = await supabase.from("exams").select("*, modules(title, order_index)").order("created_at");
      return data ?? [];
    },
  });
  const { data: attempts = [] } = useQuery({
    queryKey: ["attempts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("exam_attempts").select("*").eq("user_id", user!.id).order("attempted_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <AppShell title="Avaliações" subtitle="Nota mínima de aprovação: 7,0">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <span className="eyebrow">Provas oficiais</span>
          <h2 className="display text-4xl mt-3 max-w-2xl">Avaliações por módulo com correção automática.</h2>
        </header>

        <div className="space-y-3">
          {exams.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
              <ClipboardCheck className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p>Provas serão liberadas conforme você concluir os módulos.</p>
            </div>
          )}
          {exams.map((e: any) => {
            const best = attempts.filter((a: any) => a.exam_id === e.id).sort((a: any, b: any) => Number(b.score) - Number(a.score))[0];
            const passed = best?.passed;
            return (
              <div key={e.id} className="glass rounded-2xl p-6 flex items-center gap-5">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck className="h-5 w-5 text-mid" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mid">{e.modules?.title || "Geral"}</p>
                  <h3 className="text-[1rem] font-medium mt-1">{e.title}</h3>
                  <p className="text-[0.82rem] text-muted-foreground mt-1.5">Tentativas: {attempts.filter((a: any) => a.exam_id === e.id).length} / {e.max_attempts}</p>
                </div>
                {best ? (
                  <div className="flex items-center gap-3">
                    {passed ? <CheckCircle2 className="h-5 w-5 text-mid" /> : <XCircle className="h-5 w-5 text-destructive" />}
                    <span className="display text-2xl tabular-nums">{Number(best.score).toFixed(1)}</span>
                  </div>
                ) : (
                  <button className="btn-primary">Iniciar prova</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
