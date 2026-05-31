import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollText } from "lucide-react";

export const Route = createFileRoute("/app/avaliacoes")({ component: Avaliacoes });

function Avaliacoes() {
  const { data } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data } = await supabase.from("exams").select("*, modules(title)").order("created_at");
      return data ?? [];
    },
  });
  return (
    <div className="space-y-10">
      <div><span className="eyebrow">Provas online</span><h1 className="display text-5xl mt-3">Avaliações</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">Nota mínima 7,0 para aprovação. Correção automática e histórico de desempenho.</p></div>
      {!data?.length ? <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Avaliações em preparação.</div> : (
        <div className="grid md:grid-cols-2 gap-4">
          {data.map((e) => (
            <div key={e.id} className="module-card">
              <ScrollText className="w-6 h-6 text-mid" />
              <h3 className="mt-4 font-medium">{e.title}</h3>
              <div className="mt-3 text-xs text-muted-foreground">Nota mínima: {e.passing_score} · {e.max_attempts} tentativas</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
