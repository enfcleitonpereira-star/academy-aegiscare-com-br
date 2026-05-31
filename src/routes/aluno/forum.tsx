import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessagesSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/forum")({
  component: ForumPage,
  head: () => ({ meta: [{ title: "Fórum — Aegis Care Academy" }] }),
});

function ForumPage() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState(""); const [content, setContent] = useState("");

  const { data: posts = [] } = useQuery({
    queryKey: ["forum-posts"],
    queryFn: async () => {
      const { data } = await supabase.from("forum_posts").select("*, profiles!forum_posts_user_id_fkey(full_name, avatar_url)").is("parent_id", null).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      await supabase.from("forum_posts").insert({ user_id: user!.id, title, content });
    },
    onSuccess: () => { setTitle(""); setContent(""); toast.success("Publicado."); qc.invalidateQueries({ queryKey: ["forum-posts"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <AppShell title="Fórum" subtitle="Avaliativo · 0 a 10 pontos">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <span className="eyebrow">Comunidade Aegis</span>
          <h2 className="display text-4xl mt-3 max-w-2xl">Troque experiências com outros cuidadores em formação.</h2>
          <p className="mt-4 text-muted-foreground">A participação no fórum compõe sua nota institucional (até 10 pontos).</p>
        </header>

        {profile?.access_status === "active" && (
          <div className="glass rounded-2xl p-6 mb-8 space-y-3">
            <Input placeholder="Título da sua pergunta ou reflexão" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 bg-white border-border/60" />
            <Textarea placeholder="Compartilhe sua experiência..." value={content} onChange={(e) => setContent(e.target.value)} rows={3} className="bg-white border-border/60" />
            <div className="flex justify-end">
              <button onClick={() => create.mutate()} disabled={!content || create.isPending} className="btn-primary disabled:opacity-60">Publicar</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {posts.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
              <MessagesSquare className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p>Seja o primeiro a iniciar uma conversa.</p>
            </div>
          )}
          {posts.map((p: any) => (
            <article key={p.id} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-ink text-white flex items-center justify-center text-[0.72rem]">
                  {(p.profiles?.full_name || "A").split(" ").map((s: string) => s[0]).slice(0,2).join("")}
                </div>
                <div>
                  <p className="text-[0.85rem] font-medium">{p.profiles?.full_name || "Aluno"}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              {p.title && <h3 className="text-[1rem] font-medium mb-2">{p.title}</h3>}
              <p className="text-[0.92rem] text-muted-foreground leading-relaxed whitespace-pre-wrap">{p.content}</p>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
