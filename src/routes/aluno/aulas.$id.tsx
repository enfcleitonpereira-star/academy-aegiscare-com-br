import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, ArrowRight, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/aulas/$id")({
  component: LessonPage,
});

function LessonPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: lesson } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("*, modules(id, title, order_index)").eq("id", id).maybeSingle();
      return data as any;
    },
  });
  const { data: siblings = [] } = useQuery({
    queryKey: ["siblings", lesson?.module_id],
    enabled: !!lesson?.module_id,
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("id, order_index").eq("module_id", lesson!.module_id).order("order_index");
      return data ?? [];
    },
  });
  const { data: materials = [] } = useQuery({
    queryKey: ["mat-lesson", id],
    queryFn: async () => {
      const { data } = await supabase.from("materials").select("*").eq("lesson_id", id);
      return data ?? [];
    },
  });
  const { data: progress } = useQuery({
    queryKey: ["progress-lesson", id, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("lesson_progress").select("*").eq("user_id", user!.id).eq("lesson_id", id).maybeSingle();
      return data;
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      await supabase.from("lesson_progress").upsert({
        user_id: user!.id, lesson_id: id, completed: true, completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,lesson_id" });
    },
    onSuccess: () => { toast.success("Aula concluída."); qc.invalidateQueries(); },
  });

  if (!lesson) return <AppShell><div className="text-center text-muted-foreground py-20">Carregando...</div></AppShell>;

  const idx = siblings.findIndex((s: any) => s.id === id);
  const prev = siblings[idx - 1]; const next = siblings[idx + 1];

  return (
    <AppShell title={lesson.title} subtitle={lesson.modules?.title}>
      <div className="max-w-5xl mx-auto">
        <Link to="/aluno/modulos/$id" params={{ id: lesson.module_id }} className="inline-flex items-center gap-2 text-[0.82rem] text-muted-foreground hover:text-ink transition-colors mb-6">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao módulo
        </Link>

        <div className="aspect-video rounded-3xl overflow-hidden bg-ink relative shadow-[var(--shadow-elev)]">
          {lesson.video_url ? (
            <video src={lesson.video_url} controls className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60" style={{ background: "var(--grad-deep)" }}>
              <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-4">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <p className="text-[0.85rem]">Aula em produção</p>
            </div>
          )}
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="eyebrow">Aula {idx + 1}</span>
              <h1 className="display text-3xl mt-3">{lesson.title}</h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">{lesson.description}</p>
            </div>
            {lesson.summary && (
              <div>
                <h3 className="text-[0.95rem] font-medium mb-3">Resumo</h3>
                <p className="text-[0.92rem] text-muted-foreground leading-relaxed whitespace-pre-wrap">{lesson.summary}</p>
              </div>
            )}
            <button onClick={() => completeMutation.mutate()} disabled={progress?.completed} className="btn-primary">
              {progress?.completed ? <><CheckCircle2 className="h-4 w-4" /> Aula concluída</> : <>Marcar como concluída <span className="arrow">→</span></>}
            </button>
          </div>

          <aside className="space-y-4">
            <div>
              <h3 className="eyebrow mb-3">Materiais</h3>
              {materials.length === 0 && <p className="text-[0.82rem] text-muted-foreground">Nenhum material anexado.</p>}
              {materials.map((m: any) => (
                <a key={m.id} href={m.file_url} target="_blank" rel="noopener noreferrer" className="glass rounded-xl p-4 flex items-center gap-3 hover:border-gold/40 transition-all group mb-2">
                  <Download className="h-4 w-4 text-mid" />
                  <span className="text-[0.85rem] flex-1 truncate">{m.title}</span>
                </a>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex items-center justify-between">
          {prev ? (
            <Link to="/aluno/aulas/$id" params={{ id: prev.id }} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Aula anterior</Link>
          ) : <span />}
          {next ? (
            <Link to="/aluno/aulas/$id" params={{ id: next.id }} className="btn-primary">Próxima aula <span className="arrow">→</span></Link>
          ) : <span />}
        </div>
      </div>
    </AppShell>
  );
}
