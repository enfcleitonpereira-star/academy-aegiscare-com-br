import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Play, FileText, Clock } from "lucide-react";

export const Route = createFileRoute("/aluno/modulos/$id")({
  component: ModuleDetail,
});

function ModuleDetail() {
  const { id } = Route.useParams();
  const { data: mod } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      const { data } = await supabase.from("modules").select("*").eq("id", id).maybeSingle();
      return data;
    },
  });
  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", id],
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("*").eq("module_id", id).order("order_index");
      return data ?? [];
    },
  });

  if (!mod) return <AppShell><div className="text-center text-muted-foreground py-20">Carregando...</div></AppShell>;

  return (
    <AppShell title={mod.title} subtitle={`Módulo ${mod.order_index} · ${mod.hours}h`}>
      <div className="max-w-5xl mx-auto">
        <Link to="/aluno/modulos" className="inline-flex items-center gap-2 text-[0.82rem] text-muted-foreground hover:text-ink transition-colors mb-8">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar aos módulos
        </Link>

        <section className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-white mb-10" style={{ background: "var(--grad-deep)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 100% 0%, oklch(0.74 0.08 80 / 0.2), transparent 55%)" }} />
          <div className="relative z-10 max-w-2xl">
            <span className="text-[0.7rem] uppercase tracking-[0.28em] text-white/55">Módulo {mod.order_index}</span>
            <h1 className="display text-4xl md:text-5xl mt-4">{mod.title}</h1>
            <p className="mt-5 text-white/75 leading-relaxed">{mod.description}</p>
            <div className="mt-8 flex items-center gap-6 text-[0.82rem] text-white/65">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {mod.hours} horas</span>
              <span className="flex items-center gap-2"><Play className="h-4 w-4" /> {lessons.length} aulas</span>
            </div>
          </div>
        </section>

        <h2 className="display text-2xl mb-6">Aulas</h2>
        <div className="space-y-3">
          {lessons.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
              As aulas deste módulo serão publicadas em breve pelo administrador.
            </div>
          )}
          {lessons.map((l: any, idx: number) => (
            <Link key={l.id} to="/aluno/aulas/$id" params={{ id: l.id }} className="block glass rounded-2xl p-5 hover:border-gold/40 transition-all group">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-[0.85rem] tabular-nums text-mid">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[0.98rem] font-medium truncate">{l.title}</h3>
                  <p className="text-[0.82rem] text-muted-foreground mt-1 truncate">{l.description}</p>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="text-[0.78rem] tabular-nums">{l.duration_minutes || 0}min</span>
                  <Play className="h-4 w-4 group-hover:text-gold transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
