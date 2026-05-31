import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, BookOpen, GraduationCap, Clock } from "lucide-react";

export const Route = createFileRoute("/aluno/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profiles, modules, lessons, pending] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("modules").select("id", { count: "exact", head: true }),
        supabase.from("lessons").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("access_status", "pending"),
      ]);
      return {
        students: profiles.count ?? 0,
        modules: modules.count ?? 0,
        lessons: lessons.count ?? 0,
        pending: pending.count ?? 0,
      };
    },
  });

  return (
    <div>
      <header className="mb-10">
        <span className="eyebrow">Painel</span>
        <h2 className="display text-3xl mt-3">Visão geral institucional</h2>
        <p className="text-muted-foreground text-[0.92rem] mt-2 max-w-xl">
          Acompanhe matrículas, conteúdo publicado e aprovações pendentes.
        </p>
      </header>

      <div className="grid md:grid-cols-4 gap-5">
        <StatCard icon={<Users className="h-4 w-4" />} label="Alunos" value={stats?.students} />
        <StatCard icon={<Clock className="h-4 w-4" />} label="Pendentes" value={stats?.pending} highlight={!!stats?.pending} />
        <StatCard icon={<BookOpen className="h-4 w-4" />} label="Módulos" value={stats?.modules} />
        <StatCard icon={<GraduationCap className="h-4 w-4" />} label="Aulas" value={stats?.lessons} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value?: number; highlight?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-6 ${highlight ? "border-gold/40" : ""}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[0.7rem] uppercase tracking-[0.22em]">{label}</span>
      </div>
      <p className={`display text-3xl mt-3 ${highlight ? "text-gold" : "text-ink"}`}>{value ?? "—"}</p>
    </div>
  );
}
