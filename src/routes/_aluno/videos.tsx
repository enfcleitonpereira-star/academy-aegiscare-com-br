import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Play } from "lucide-react";

export const Route = createFileRoute("/_aluno/videos")({
  component: VideosPage,
  head: () => ({ meta: [{ title: "Vídeos — Aegis Care Academy" }] }),
});

function VideosPage() {
  const { data: lessons = [] } = useQuery({
    queryKey: ["all-lessons"],
    queryFn: async () => (await supabase.from("lessons").select("*, modules(title, order_index)").order("created_at", { ascending: false })).data ?? [],
  });

  return (
    <AppShell title="Vídeos" subtitle="Biblioteca de aulas">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <span className="eyebrow">Aulas em vídeo</span>
          <h2 className="display text-4xl mt-3">Toda a videoteca da Academy.</h2>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lessons.length === 0 && (
            <div className="md:col-span-3 glass rounded-2xl p-12 text-center text-muted-foreground">
              <Play className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p>Vídeos serão disponibilizados pelo administrador.</p>
            </div>
          )}
          {lessons.map((l: any) => (
            <Link key={l.id} to="/aluno/aulas/$id" params={{ id: l.id }} className="group">
              <div className="aspect-video rounded-2xl overflow-hidden bg-ink relative" style={{ background: "var(--grad-deep)" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 text-[0.7rem] text-white/80 bg-black/30 backdrop-blur px-2 py-0.5 rounded">
                  {l.duration_minutes || 0}min
                </div>
              </div>
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mid mt-3">{l.modules?.title}</p>
              <h3 className="text-[0.95rem] font-medium mt-1 line-clamp-2 group-hover:text-mid transition-colors">{l.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
