import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, BookOpen, Megaphone, Award, Shield, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: () => {
    const { role, loading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => { if (!loading && role !== "admin") navigate({ to: "/app" }); }, [role, loading, navigate]);
    return <AppShell><AdminInner /></AppShell>;
  },
});

function AdminInner() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profiles, certs] = await Promise.all([
        supabase.from("profiles").select("access_status"),
        supabase.from("certificates").select("id"),
      ]);
      const all = profiles.data ?? [];
      return {
        total: all.length,
        active: all.filter((p) => p.access_status === "active").length,
        pending: all.filter((p) => p.access_status === "pending").length,
        certs: certs.data?.length ?? 0,
      };
    },
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-gold" />
        <div>
          <span className="eyebrow">Administração</span>
          <h1 className="display text-5xl mt-2">Painel da Academy</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="Alunos totais" value={stats?.total ?? 0} />
        <Stat icon={CheckCircle2} label="Ativos" value={stats?.active ?? 0} />
        <Stat icon={XCircle} label="Pendentes" value={stats?.pending ?? 0} />
        <Stat icon={Award} label="Certificados" value={stats?.certs ?? 0} />
      </div>

      <Students />
      <Announcements />

      <Outlet />
      <div className="text-xs text-muted-foreground">{path}</div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-6">
      <Icon className="w-5 h-5 text-mid" />
      <div className="text-3xl font-light mt-4">{value}</div>
      <div className="text-xs uppercase tracking-[0.18em] text-mid mt-1">{label}</div>
    </div>
  );
}

function Students() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const setStatus = async (id: string, status: "active" | "pending" | "blocked") => {
    const { error } = await supabase.from("profiles").update({ access_status: status }).eq("user_id", id);
    if (error) toast.error(error.message);
    else { toast.success("Atualizado."); qc.invalidateQueries({ queryKey: ["admin-students"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); }
  };

  return (
    <section>
      <h2 className="display text-3xl mb-4">Alunos</h2>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="divide-y divide-border/40">
          {data?.map((p) => (
            <div key={p.id} className="p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium truncate">{p.full_name || "—"}</div>
                <div className="text-xs text-muted-foreground truncate">{p.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  p.access_status === "active" ? "bg-aqua/20 text-deep" : p.access_status === "pending" ? "bg-gold/20 text-ink" : "bg-destructive/20 text-destructive"
                }`}>{p.access_status}</span>
                {p.access_status !== "active" && <button onClick={() => setStatus(p.user_id, "active")} className="text-xs px-3 py-1.5 rounded-full bg-ink text-white hover:bg-deep">Aprovar</button>}
                {p.access_status !== "blocked" && <button onClick={() => setStatus(p.user_id, "blocked")} className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-destructive hover:text-destructive">Bloquear</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Announcements() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("announcements").insert({ title, body, pinned: true });
    if (error) toast.error(error.message);
    else { toast.success("Aviso publicado."); setTitle(""); setBody(""); qc.invalidateQueries({ queryKey: ["announcements"] }); }
  };
  return (
    <section>
      <h2 className="display text-3xl mb-4">Publicar aviso</h2>
      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" required className="w-full px-4 py-3 rounded-xl border border-input bg-card text-sm" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Mensagem" required rows={3} className="w-full px-4 py-3 rounded-xl border border-input bg-card text-sm" />
        <button className="btn-primary">Publicar</button>
      </form>
    </section>
  );
}

import { useState } from "react";
