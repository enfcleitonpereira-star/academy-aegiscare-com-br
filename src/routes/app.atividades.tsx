import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/app/atividades")({ component: Atividades });

function Atividades() {
  const { data } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data } = await supabase.from("activities").select("*, modules(title)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <div className="space-y-10">
      <div><span className="eyebrow">Fixação</span><h1 className="display text-5xl mt-3">Atividades práticas</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">Exercícios e questionários para consolidar o aprendizado.</p></div>
      {!data?.length ? <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Atividades em preparação.</div> : (
        <div className="grid md:grid-cols-2 gap-4">
          {data.map((a) => (
            <div key={a.id} className="module-card">
              <ClipboardCheck className="w-6 h-6 text-mid" />
              <h3 className="mt-4 font-medium">{a.title}</h3>
              <p className="text-xs text-muted-foreground mt-2">{(a.modules as { title: string } | null)?.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
