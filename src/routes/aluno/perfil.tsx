import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/perfil")({
  component: PerfilPage,
  head: () => ({ meta: [{ title: "Perfil — Aegis Care Academy" }] }),
});

function PerfilPage() {
  const { profile, refresh } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", city: "", state: "", avatar_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({
      full_name: profile.full_name || "", phone: profile.phone || "",
      city: profile.city || "", state: profile.state || "", avatar_url: profile.avatar_url || "",
    });
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("user_id", profile.user_id);
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("Perfil atualizado."); refresh(); }
  };

  return (
    <AppShell title="Perfil" subtitle="Seus dados pessoais">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <span className="eyebrow">Identidade</span>
          <h2 className="display text-4xl mt-3">Seu perfil na Academy.</h2>
        </header>

        <form onSubmit={save} className="glass rounded-2xl p-8 space-y-5">
          <div className="space-y-2">
            <Label className="text-[0.78rem] font-medium">Nome completo</Label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="h-11 bg-white border-border/60" />
          </div>
          <div className="space-y-2">
            <Label className="text-[0.78rem] font-medium">E-mail</Label>
            <Input value={profile?.email || ""} disabled className="h-11 bg-muted border-border/60" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[0.78rem] font-medium">WhatsApp</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 bg-white border-border/60" />
            </div>
            <div className="space-y-2">
              <Label className="text-[0.78rem] font-medium">Estado</Label>
              <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} maxLength={2} className="h-11 bg-white border-border/60 uppercase" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[0.78rem] font-medium">Cidade</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="h-11 bg-white border-border/60" />
          </div>
          <div className="space-y-2">
            <Label className="text-[0.78rem] font-medium">URL do avatar</Label>
            <Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." className="h-11 bg-white border-border/60" />
          </div>
          <button disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Salvando..." : "Salvar alterações"}</button>
        </form>
      </div>
    </AppShell>
  );
}
