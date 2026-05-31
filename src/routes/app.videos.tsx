import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlayCircle } from "lucide-react";

export const Route = createFileRoute("/app/videos")({ component: Videos });

function Videos() {
  const { data } = useQuery({
    queryKey: ["lessons-videos"],
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("id, title, video_url, modules(title)").not("video_url", "is", null).order("order_index");
      return data ?? [];
    },
  });
  return (
    <div className="space-y-10">
      <div><span className="eyebrow">Galeria</span><h1 className="display text-5xl mt-3">Vídeos da formação</h1></div>
      {!data?.length ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Vídeos serão liberados pelos administradores.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((l) => (
            <a key={l.id} href={`/app/aula/${l.id}`} className="module-card group">
              <div className="aspect-video bg-ink/90 rounded-xl flex items-center justify-center mb-4"><PlayCircle className="w-10 h-10 text-white/70" /></div>
              <div className="text-xs text-mid uppercase tracking-[0.18em]">{(l.modules as { title: string } | null)?.title}</div>
              <h3 className="mt-2 font-medium leading-snug">{l.title}</h3>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
