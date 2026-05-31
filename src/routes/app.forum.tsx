import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/app/forum")({ component: Forum });

function Forum() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data } = useQuery({
    queryKey: ["forum"],
    queryFn: async () => {
      const { data } = await supabase.from("forum_posts").select("*").is("parent_id", null).order("created_at", { ascending: false }).limit(50);
      return data ?? [];
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const { error } = await supabase.from("forum_posts").insert({ user_id: profile.user_id, title, content });
    if (error) toast.error(error.message);
    else { toast.success("Publicado."); setTitle(""); setContent(""); qc.invalidateQueries({ queryKey: ["forum"] }); }
  };

  return (
    <div className="space-y-10">
      <div><span className="eyebrow">Comunidade</span><h1 className="display text-5xl mt-3">Fórum dos alunos</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">Participação avaliada de 0 a 10 pontos. Troque experiências, faça perguntas, contribua.</p></div>

      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" required className="w-full px-4 py-3 rounded-xl border border-input bg-card text-sm" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Sua pergunta ou contribuição..." required rows={3} className="w-full px-4 py-3 rounded-xl border border-input bg-card text-sm" />
        <button className="btn-primary">Publicar</button>
      </form>

      <div className="space-y-3">
        {data?.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs text-mid"><MessageSquare className="w-3.5 h-3.5" /> {new Date(p.created_at).toLocaleDateString("pt-BR")}</div>
            {p.title && <h3 className="font-medium mt-2">{p.title}</h3>}
            <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{p.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
