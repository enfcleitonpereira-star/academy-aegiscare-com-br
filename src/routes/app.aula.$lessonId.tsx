import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, FileText, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/app/aula/$lessonId")({ component: Aula });

function Aula() {
  const { lessonId } = Route.useParams();
  const { data: lesson } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("*, modules(title)").eq("id", lessonId).single();
      return data;
    },
  });

  if (!lesson) return <div className="text-muted-foreground">Carregando aula...</div>;

  return (
    <div className="space-y-8">
      <Link to="/app/formacao" className="text-sm text-mid flex items-center gap-1.5"><ArrowLeft className="w-4 h-4" /> Voltar à formação</Link>
      <div>
        <span className="eyebrow">{(lesson.modules as { title: string } | null)?.title}</span>
        <h1 className="display text-4xl mt-2">{lesson.title}</h1>
      </div>
      <div className="aspect-video rounded-2xl overflow-hidden bg-ink/90 flex items-center justify-center glass">
        {lesson.video_url ? (
          <video src={lesson.video_url} controls className="w-full h-full" />
        ) : (
          <div className="text-white/60 flex flex-col items-center gap-3"><PlayCircle className="w-12 h-12" /><span className="text-sm">Vídeo em preparação</span></div>
        )}
      </div>
      {lesson.summary && (
        <div className="glass rounded-2xl p-8">
          <h3 className="eyebrow mb-3">Resumo</h3>
          <p className="leading-relaxed text-foreground/80">{lesson.summary}</p>
        </div>
      )}
      {lesson.description && (
        <div>
          <h3 className="eyebrow mb-3">Sobre a aula</h3>
          <p className="leading-relaxed text-foreground/80">{lesson.description}</p>
        </div>
      )}
    </div>
  );
}
