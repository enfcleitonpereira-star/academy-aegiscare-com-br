import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Clock, Award, Bell, BookOpen, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/aluno/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Início — Aegis Care Academy" }] }),
});

function Dashboard() {
  const { profile, user } = useAuth();
  const isActive = profile?.access_status === "active";

  const { data: modules = [] } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const { data } = await supabase.from("modules").select("*").order("order_index");
      return data ?? [];
    },
    enabled: isActive,
  });
  const { data: progress = [] } = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("lesson_progress").select("*").eq("user_id", user!.id);
      return data ?? [];
    },
    enabled: !!user && isActive,
  });
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(3);
      return data ?? [];
    },
  });

  const completed = progress.filter((p: any) => p.completed).length;
  const totalLessons = Math.max(modules.length * 6, 1);
  const pct = Math.round((completed / totalLessons) * 100);
  const firstName = (profile?.full_name || "").split(" ")[0] || "Aluno";

  return (
    <AppShell title="Início" subtitle="Sua jornada de formação">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-white" style={{ background: "var(--grad-deep)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 90% 0%, oklch(0.74 0.08 80 / 0.22), transparent 55%)" }} />
          <div className="relative z-10 max-w-2xl">
            <span className="text-[0.7rem] uppercase tracking-[0.28em] text-white/60">Aegis Care Academy</span>
            <h2 className="display text-4xl md:text-5xl mt-4">Bom dia, {firstName}.</h2>
            <p className="mt-4 text-white/75 text-[1.02rem] leading-relaxed max-w-lg">
              {isActive
                ? "Continue de onde parou. Sua próxima aula está pronta."
                : "Sua conta está aguardando aprovação do administrador. Em breve você terá acesso completo aos módulos."}
            </p>
            {isActive && (
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/50">Progresso</p>
                  <p className="display text-3xl mt-1">{pct}<span className="text-white/50 text-2xl">%</span></p>
                </div>
                <span className="h-12 w-px bg-white/15" />
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/50">Aulas concluídas</p>
                  <p className="display text-3xl mt-1">{completed}</p>
                </div>
                <span className="h-12 w-px bg-white/15" />
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/50">Carga total</p>
                  <p className="display text-3xl mt-1">180h</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {!isActive && (
          <div className="glass rounded-2xl p-6 flex items-start gap-4 border-gold/30">
            <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-medium text-[0.98rem] mb-1">Aguardando confirmação</h3>
              <p className="text-[0.88rem] text-muted-foreground">Sua matrícula está em análise. Assim que o pagamento for confirmado pelo administrador, todos os módulos serão liberados automaticamente.</p>
            </div>
          </div>
        )}

        <section className="grid md:grid-cols-3 gap-5">
          <StatCard icon={<BookOpen className="h-4 w-4" />} label="Módulos" value={`${modules.length}`} caption="formação completa" />
          <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Desempenho" value={isActive ? `${pct}%` : "—"} caption="conclusão geral" />
          <StatCard icon={<Award className="h-4 w-4" />} label="Certificado" value={pct >= 100 ? "Pronto" : "Em andamento"} caption="180h reconhecidas" />
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="eyebrow">Continue assistindo</span>
                <h3 className="display text-2xl mt-2">Seus módulos</h3>
              </div>
              <Link to="/aluno/modulos" className="text-[0.82rem] text-mid hover:text-ink transition-colors flex items-center gap-1">
                Ver todos <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {modules.slice(0, 4).map((m: any) => (
                <Link key={m.id} to="/aluno/modulos/$id" params={{ id: m.id }} className="block glass rounded-2xl p-5 hover:border-gold/40 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-xl bg-ink text-white flex items-center justify-center font-light text-lg">
                      {String(m.order_index).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">Módulo {m.order_index} · {m.hours}h</p>
                      <h4 className="text-[1rem] font-medium mt-0.5 truncate">{m.title}</h4>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={isActive ? Math.random() * 100 : 0} className="h-1 flex-1" />
                        <span className="text-[0.72rem] text-muted-foreground tabular-nums">0%</span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
              {modules.length === 0 && (
                <div className="glass rounded-2xl p-8 text-center text-muted-foreground text-[0.92rem]">
                  Conteúdo será liberado após aprovação.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="eyebrow">Avisos</span>
              <h3 className="display text-2xl mt-2">Da Academy</h3>
            </div>
            <div className="space-y-3">
              {announcements.length === 0 && (
                <div className="glass rounded-2xl p-5 flex items-start gap-3">
                  <Bell className="h-4 w-4 text-mid mt-1" />
                  <div>
                    <p className="text-[0.92rem] font-medium">Bem-vindo à Academy</p>
                    <p className="text-[0.82rem] text-muted-foreground mt-1">Em breve, novos avisos aparecerão aqui.</p>
                  </div>
                </div>
              )}
              {announcements.map((a: any) => (
                <div key={a.id} className="glass rounded-2xl p-5">
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mid">{new Date(a.created_at).toLocaleDateString("pt-BR")}</p>
                  <p className="text-[0.96rem] font-medium mt-2">{a.title}</p>
                  <p className="text-[0.85rem] text-muted-foreground mt-1.5 leading-relaxed">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function StatCard({ icon, label, value, caption }: { icon: React.ReactNode; label: string; value: string; caption: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[0.72rem] uppercase tracking-[0.22em]">{label}</span>
      </div>
      <p className="display text-3xl mt-3 text-ink">{value}</p>
      <p className="text-[0.78rem] text-muted-foreground mt-1">{caption}</p>
    </div>
  );
}
