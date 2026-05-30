import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/_aluno/apostilas")({
  component: ApostilasPage,
  head: () => ({ meta: [{ title: "Apostilas — Aegis Care Academy" }] }),
});

function ApostilasPage() {
  const { data: materials = [] } = useQuery({
    queryKey: ["all-materials"],
    queryFn: async () => {
      const { data } = await supabase.from("materials").select("*, modules(title, order_index)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <AppShell title="Apostilas" subtitle="Biblioteca digital da Academy">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <span className="eyebrow">Materiais oficiais</span>
          <h2 className="display text-4xl mt-3 max-w-2xl">Sua biblioteca de apostilas, guias e checklists.</h2>
          <p className="mt-4 text-muted-foreground max-w-xl">Todo o material complementar curado pela Academy, pronto para download.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          {materials.length === 0 && (
            <div className="md:col-span-2 glass rounded-2xl p-12 text-center text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-[0.92rem]">Materiais serão disponibilizados em breve.</p>
            </div>
          )}
          {materials.map((m: any) => (
            <a key={m.id} href={m.file_url} target="_blank" rel="noopener noreferrer" className="glass rounded-2xl p-6 flex items-start gap-4 hover:border-gold/40 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-mid" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mid">{m.modules?.title || "Geral"}</p>
                <h3 className="text-[0.98rem] font-medium mt-1 truncate">{m.title}</h3>
                {m.description && <p className="text-[0.82rem] text-muted-foreground mt-1.5 line-clamp-2">{m.description}</p>}
              </div>
              <Download className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors flex-shrink-0 mt-1" />
            </a>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
