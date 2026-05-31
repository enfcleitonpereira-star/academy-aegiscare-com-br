import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/app/apostilas")({ component: Apostilas });

function Apostilas() {
  const { data } = useQuery({
    queryKey: ["materials-pdf"],
    queryFn: async () => {
      const { data } = await supabase.from("materials").select("*, modules(title)").eq("type", "pdf").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <span className="eyebrow">Biblioteca digital</span>
        <h1 className="display text-5xl mt-3">Apostilas & materiais</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">Apostilas, checklists e guias rápidos da formação.</p>
      </div>
      {!data?.length ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Materiais serão disponibilizados em breve.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((m) => (
            <a key={m.id} href={m.file_url} target="_blank" rel="noreferrer" className="module-card group">
              <FileText className="w-7 h-7 text-mid" />
              <h3 className="mt-4 font-medium leading-snug">{m.title}</h3>
              {m.description && <p className="text-xs text-muted-foreground mt-2">{m.description}</p>}
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{(m.modules as { title: string } | null)?.title}</span>
                <span className="text-mid flex items-center gap-1 group-hover:text-gold"><Download className="w-3.5 h-3.5" /> Baixar</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
