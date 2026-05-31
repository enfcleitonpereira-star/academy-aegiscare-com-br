import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, Pause, Play } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/aluno/admin/alunos")({
  component: AdminStudents,
});

type Profile = {
  id: string; user_id: string; full_name: string; email: string;
  phone: string | null; city: string | null; state: string | null;
  access_status: "pending" | "active" | "suspended";
  created_at: string;
};

function AdminStudents() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: students = [] } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      return (data ?? []) as Profile[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Profile["access_status"] }) => {
      const { error } = await supabase.from("profiles").update({ access_status: status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-students"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Status atualizado.");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = students.filter((s) =>
    !q || s.full_name?.toLowerCase().includes(q.toLowerCase()) || s.email?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Matrículas</span>
          <h2 className="display text-3xl mt-3">Alunos</h2>
        </div>
        <Input
          placeholder="Buscar por nome ou e-mail"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs h-10 bg-white"
        />
      </header>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-[0.88rem]">
          <thead className="bg-muted/40 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="text-left p-4 font-medium">Aluno</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Contato</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-border/40">
                <td className="p-4">
                  <p className="font-medium">{s.full_name || "—"}</p>
                  <p className="text-muted-foreground text-[0.78rem]">{s.email}</p>
                </td>
                <td className="p-4 hidden md:table-cell text-muted-foreground">
                  <p>{s.phone || "—"}</p>
                  <p className="text-[0.78rem]">{[s.city, s.state].filter(Boolean).join(" · ") || "—"}</p>
                </td>
                <td className="p-4">
                  {s.access_status === "active" && <Badge className="bg-aqua/15 text-mid border-aqua/40 font-normal">Ativo</Badge>}
                  {s.access_status === "pending" && <Badge className="bg-gold/15 text-gold border-gold/40 font-normal">Pendente</Badge>}
                  {s.access_status === "suspended" && <Badge variant="destructive" className="font-normal">Suspenso</Badge>}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {s.access_status !== "active" && (
                      <button onClick={() => setStatus.mutate({ id: s.id, status: "active" })} className="btn-ghost !py-1.5 !px-3 text-[0.78rem]">
                        <Check className="h-3.5 w-3.5 mr-1.5" /> Liberar
                      </button>
                    )}
                    {s.access_status === "active" && (
                      <button onClick={() => setStatus.mutate({ id: s.id, status: "suspended" })} className="btn-ghost !py-1.5 !px-3 text-[0.78rem]">
                        <Pause className="h-3.5 w-3.5 mr-1.5" /> Suspender
                      </button>
                    )}
                    {s.access_status === "suspended" && (
                      <button onClick={() => setStatus.mutate({ id: s.id, status: "active" })} className="btn-ghost !py-1.5 !px-3 text-[0.78rem]">
                        <Play className="h-3.5 w-3.5 mr-1.5" /> Reativar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">Nenhum aluno encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
