import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/admin/modulos")({
  component: AdminModules,
});

function AdminModules() {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", hours: 20, order_index: 1 });

  const { data: modules = [] } = useQuery({
    queryKey: ["admin-modules"],
    queryFn: async () => (await supabase.from("modules").select("*").order("order_index")).data ?? [],
  });

  const createModule = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("modules").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Módulo criado.");
      setForm({ title: "", description: "", hours: 20, order_index: (modules.length || 0) + 1 });
      qc.invalidateQueries({ queryKey: ["admin-modules"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const removeModule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Módulo removido."); qc.invalidateQueries({ queryKey: ["admin-modules"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-10">
      <header>
        <span className="eyebrow">Conteúdo</span>
        <h2 className="display text-3xl mt-3">Módulos & Aulas</h2>
      </header>

      <section className="glass rounded-2xl p-6">
        <h3 className="text-[0.95rem] font-medium mb-4">Novo módulo</h3>
        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-[0.75rem]">Ordem</Label>
            <Input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: +e.target.value })} className="h-10 bg-white" />
          </div>
          <div className="md:col-span-6 space-y-1.5">
            <Label className="text-[0.75rem]">Título</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10 bg-white" />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-[0.75rem]">Carga (h)</Label>
            <Input type="number" value={form.hours} onChange={(e) => setForm({ ...form, hours: +e.target.value })} className="h-10 bg-white" />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button onClick={() => createModule.mutate()} disabled={!form.title} className="btn-primary w-full justify-center !py-2.5 disabled:opacity-50">
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </button>
          </div>
          <div className="md:col-span-12 space-y-1.5">
            <Label className="text-[0.75rem]">Descrição</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white min-h-20" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {modules.map((m: any) => (
          <div key={m.id} className="glass rounded-2xl overflow-hidden">
            <div className="p-5 flex items-center gap-4">
              <button onClick={() => setOpenId(openId === m.id ? null : m.id)} className="p-1 hover:bg-muted rounded">
                {openId === m.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <div className="h-10 w-10 rounded-lg bg-ink text-white flex items-center justify-center text-[0.82rem]">
                {String(m.order_index).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">Módulo {m.order_index} · {m.hours}h</p>
                <p className="font-medium truncate">{m.title}</p>
              </div>
              <button onClick={() => confirm("Remover módulo e suas aulas?") && removeModule.mutate(m.id)} className="p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {openId === m.id && <LessonsPanel moduleId={m.id} />}
          </div>
        ))}
        {modules.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Nenhum módulo criado ainda.</div>
        )}
      </section>
    </div>
  );
}

function LessonsPanel({ moduleId }: { moduleId: string }) {
  const qc = useQueryClient();
  const [lf, setLf] = useState({ title: "", description: "", video_url: "", duration_minutes: 30, order_index: 1 });

  const { data: lessons = [] } = useQuery({
    queryKey: ["admin-lessons", moduleId],
    queryFn: async () => (await supabase.from("lessons").select("*").eq("module_id", moduleId).order("order_index")).data ?? [],
  });

  const addLesson = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("lessons").insert({ ...lf, module_id: moduleId });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Aula adicionada.");
      setLf({ title: "", description: "", video_url: "", duration_minutes: 30, order_index: (lessons.length || 0) + 1 });
      qc.invalidateQueries({ queryKey: ["admin-lessons", moduleId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const delLesson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-lessons", moduleId] }),
  });

  return (
    <div className="border-t border-border/40 bg-muted/20 p-5 space-y-4">
      <div className="space-y-2">
        {lessons.map((l: any) => (
          <div key={l.id} className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <span className="text-[0.75rem] text-muted-foreground tabular-nums w-8">{String(l.order_index).padStart(2, "0")}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[0.9rem] truncate">{l.title}</p>
              <p className="text-[0.74rem] text-muted-foreground truncate">{l.duration_minutes}min · {l.video_url || "sem vídeo"}</p>
            </div>
            <button onClick={() => delLesson.mutate(l.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {lessons.length === 0 && <p className="text-[0.82rem] text-muted-foreground text-center py-3">Nenhuma aula ainda.</p>}
      </div>

      <div className="grid grid-cols-12 gap-2 pt-3 border-t border-border/40">
        <Input placeholder="#" type="number" value={lf.order_index} onChange={(e) => setLf({ ...lf, order_index: +e.target.value })} className="col-span-1 h-9 bg-white text-sm" />
        <Input placeholder="Título da aula" value={lf.title} onChange={(e) => setLf({ ...lf, title: e.target.value })} className="col-span-4 h-9 bg-white text-sm" />
        <Input placeholder="URL do vídeo" value={lf.video_url} onChange={(e) => setLf({ ...lf, video_url: e.target.value })} className="col-span-4 h-9 bg-white text-sm" />
        <Input placeholder="min" type="number" value={lf.duration_minutes} onChange={(e) => setLf({ ...lf, duration_minutes: +e.target.value })} className="col-span-1 h-9 bg-white text-sm" />
        <button onClick={() => addLesson.mutate()} disabled={!lf.title} className="col-span-2 btn-primary justify-center !py-1.5 text-[0.8rem] disabled:opacity-50">
          <Plus className="h-3.5 w-3.5 mr-1" /> Aula
        </button>
      </div>
    </div>
  );
}
