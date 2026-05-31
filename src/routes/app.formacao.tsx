import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/app/formacao")({ component: Formacao });

function Formacao() {
  const { profile } = useAuth();

  const { data } = useQuery({
    queryKey: ["formacao", profile?.user_id],
    enabled: !!profile?.user_id,
    queryFn: async () => {
      const [{ data: mods }, { data: prog }] = await Promise.all([
        supabase.from("modules").select("*, lessons(id, title, order_index, duration_minutes)").order("order_index"),
        supabase.from("lesson_progress").select("*").eq("user_id", profile!.user_id),
      ]);
      return { modules: mods ?? [], progress: prog ?? [] };
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <span className="eyebrow">Trilha completa</span>
        <h1 className="display text-5xl mt-3">Minha formação</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">Acompanhe seu progresso em cada módulo da trilha de 180h.</p>
      </div>

      <div className="space-y-12">
        {data?.modules.map((m) => {
          const lessons = ((m.lessons as { id: string; title: string; order_index: number; duration_minutes: number | null }[] | null) ?? [])
            .sort((a, b) => a.order_index - b.order_index);
          return (
            <section key={m.id} className="relative">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="display text-5xl text-gold/30 font-extralight">{String(m.order_index).padStart(2, "0")}</span>
                <div>
                  <h2 className="display text-2xl">{m.title}</h2>
                  <div className="text-xs text-muted-foreground mt-1">{m.hours}h · {lessons.length} aulas</div>
                </div>
              </div>
              <div className="glass rounded-2xl divide-y divide-border/40">
                {lessons.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground">Aulas serão liberadas em breve.</div>
                ) : lessons.map((l) => {
                  const done = data.progress.some((p) => p.lesson_id === l.id && p.completed);
                  return (
                    <a key={l.id} href={`/app/aula/${l.id}`} className="flex items-center justify-between p-5 hover:bg-accent/40 transition">
                      <div className="flex items-center gap-4">
                        {done ? <CheckCircle2 className="w-5 h-5 text-gold" /> : <Circle className="w-5 h-5 text-muted-foreground/40" />}
                        <div>
                          <div className="font-medium text-sm">{l.title}</div>
                          {l.duration_minutes ? <div className="text-xs text-muted-foreground">{l.duration_minutes} min</div> : null}
                        </div>
                      </div>
                      <span className="text-xs text-mid">Assistir →</span>
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
