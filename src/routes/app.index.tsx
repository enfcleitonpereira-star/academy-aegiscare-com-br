import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, BookOpen, Clock, Award, Activity } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { profile } = useAuth();

  const { data: modules } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const { data } = await supabase.from("modules").select("*").order("order_index");
      return data ?? [];
    },
  });

  const { data: announcements } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(3);
      return data ?? [];
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["lesson_progress", profile?.user_id],
    enabled: !!profile?.user_id,
    queryFn: async () => {
      const { data } = await supabase.from("lesson_progress").select("*").eq("user_id", profile!.user_id);
      return data ?? [];
    },
  });

  const totalHours = modules?.reduce((s, m) => s + (m.hours || 0), 0) ?? 0;
  const completedCount = progress?.filter((p) => p.completed).length ?? 0;
  const pct = modules?.length ? Math.round((completedCount / Math.max(modules.length * 5, 1)) * 100) : 0;

  return (
    <div className="space-y-12">
      <div>
        <span className="eyebrow">Bem-vindo(a)</span>
        <h1 className="display text-5xl md:text-6xl mt-3">
          Olá, <em className="not-italic font-normal">{(profile?.full_name || "aluno(a)").split(" ")[0]}</em>.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl">
          Sua jornada de formação continuada em assistência domiciliar.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Módulos" value={`${modules?.length ?? 0}`} sub="estruturados" />
        <StatCard icon={Clock} label="Carga horária" value={`${totalHours}h`} sub="formação completa" />
        <StatCard icon={Activity} label="Progresso" value={`${pct}%`} sub="da jornada" />
        <StatCard icon={Award} label="Certificação" value="180h" sub="ao concluir" />
      </div>

      {/* Próximos módulos */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="eyebrow">Continue</span>
            <h2 className="display text-3xl mt-2">Sua formação</h2>
          </div>
          <Link to="/app/modulos" className="text-sm text-mid hover:text-ink flex items-center gap-1">
            Ver todos <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {modules?.slice(0, 4).map((m) => (
            <Link key={m.id} to="/app/modulos" className="module-card group block">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-mid tracking-[0.18em] uppercase">Módulo {String(m.order_index).padStart(2, "0")}</div>
                  <h3 className="text-lg font-light mt-2 leading-snug">{m.title}</h3>
                  <div className="text-xs text-muted-foreground mt-3">{m.hours}h</div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-mid opacity-50 group-hover:opacity-100 group-hover:text-gold transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Avisos */}
      {announcements && announcements.length > 0 && (
        <section>
          <span className="eyebrow">Da Academy</span>
          <h2 className="display text-3xl mt-2 mb-6">Avisos</h2>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="glass rounded-2xl p-6">
                <h4 className="font-medium">{a.title}</h4>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <Icon className="w-5 h-5 text-mid" />
      <div className="text-3xl font-light mt-4 tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-[0.18em] text-mid mt-1">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
