import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Clock, ArrowUpRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/modulos")({ component: Modulos });

function Modulos() {
  const { profile } = useAuth();

  const { data: modules } = useQuery({
    queryKey: ["modules-full"],
    queryFn: async () => {
      const { data } = await supabase
        .from("modules")
        .select("*, lessons(id)")
        .order("order_index");
      return data ?? [];
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["progress", profile?.user_id],
    enabled: !!profile?.user_id,
    queryFn: async () => {
      const { data } = await supabase.from("lesson_progress").select("*").eq("user_id", profile!.user_id);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <span className="eyebrow">Formação 180h</span>
        <h1 className="display text-5xl mt-3">Módulos da formação</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Trilha completa e progressiva. Conclua cada módulo, realize as avaliações e avance para o próximo.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {modules?.map((m) => {
          const lessonIds = (m.lessons as { id: string }[] | null)?.map((l) => l.id) ?? [];
          const completed = progress?.filter((p) => p.completed && lessonIds.includes(p.lesson_id)).length ?? 0;
          const pct = lessonIds.length ? Math.round((completed / lessonIds.length) * 100) : 0;
          return (
            <article key={m.id} className="module-card group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs text-mid tracking-[0.2em] uppercase">Módulo {String(m.order_index).padStart(2, "0")}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {m.hours}h</span>
              </div>
              <h3 className="text-xl font-light leading-snug">{m.title}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-3">{m.description}</p>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="text-ink font-medium">{pct}%</span>
                </div>
                <div className="h-1 bg-accent/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-mid to-aqua transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {lessonIds.length === 0 ? "Em preparação" : `${completed}/${lessonIds.length} aulas`}
                </span>
                {lessonIds.length > 0 ? (
                  <Link to="/app/formacao" className="text-sm text-ink hover:text-gold flex items-center gap-1.5 font-medium">
                    {pct === 100 ? <><CheckCircle2 className="w-4 h-4 text-gold" /> Concluído</> : <>Continuar <ArrowUpRight className="w-4 h-4 arrow" /></>}
                  </Link>
                ) : (
                  <span className="text-xs text-mid">Em breve</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
