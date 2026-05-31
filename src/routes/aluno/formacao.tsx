import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/aluno/formacao")({
  component: FormacaoPage,
  head: () => ({ meta: [{ title: "Minha Formação — Aegis Care Academy" }] }),
});

function FormacaoPage() {
  const { user, profile } = useAuth();
  const { data: modules = [] } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => (await supabase.from("modules").select("*").order("order_index")).data ?? [],
  });
  const { data: progress = [] } = useQuery({
    queryKey: ["progress-all", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("lesson_progress").select("*").eq("user_id", user!.id)).data ?? [],
  });

  const completed = progress.filter((p: any) => p.completed).length;
  const totalHours = modules.reduce((s: number, m: any) => s + (m.hours || 0), 0) || 180;

  return (
    <AppShell title="Minha Formação" subtitle="Trajeto completo">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <span className="eyebrow">Sua trajetória</span>
          <h2 className="display text-4xl mt-3 max-w-2xl">Formação em Cuidados ao Idoso no Domicílio.</h2>
        </header>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          <Stat label="Aluno" value={profile?.full_name?.split(" ")[0] || "—"} />
          <Stat label="Carga total" value={`${totalHours}h`} />
          <Stat label="Aulas concluídas" value={String(completed)} />
        </div>

        <div className="relative pl-8 border-l border-border/60 space-y-8">
          {modules.map((m: any) => (
            <div key={m.id} className="relative">
              <div className="absolute -left-[37px] top-1 h-3.5 w-3.5 rounded-full bg-background border-2 border-mid" />
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mid">Módulo {m.order_index} · {m.hours}h</p>
              <h3 className="text-[1.05rem] font-medium mt-1">{m.title}</h3>
              <p className="text-[0.88rem] text-muted-foreground mt-2 leading-relaxed">{m.description}</p>
            </div>
          ))}
          <div className="relative">
            <div className="absolute -left-[37px] top-1 h-3.5 w-3.5 rounded-full bg-gold flex items-center justify-center">
              <GraduationCap className="h-2 w-2 text-white" />
            </div>
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-gold">Conclusão</p>
            <h3 className="text-[1.05rem] font-medium mt-1">Certificado de 180 horas</h3>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="display text-2xl mt-2 text-ink truncate">{value}</p>
    </div>
  );
}
