import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/app/perfil")({ component: Perfil });

function Perfil() {
  const { profile, refresh } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", city: "", state: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setForm({
      full_name: profile.full_name || "", phone: profile.phone || "",
      city: profile.city || "", state: profile.state || "",
    });
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update(form).eq("user_id", profile.user_id);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Perfil atualizado."); refresh(); }
  };

  return (
    <div className="space-y-10 max-w-2xl">
      <div><span className="eyebrow">Conta</span><h1 className="display text-5xl mt-3">Meu perfil</h1></div>
      <form onSubmit={save} className="glass rounded-2xl p-8 space-y-5">
        {(["full_name", "phone", "city", "state"] as const).map((k) => (
          <label key={k} className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
              {k === "full_name" ? "Nome completo" : k === "phone" ? "Telefone" : k === "city" ? "Cidade" : "Estado"}
            </span>
            <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-input bg-card text-sm" />
          </label>
        ))}
        <button disabled={busy} className="btn-primary">Salvar alterações</button>
      </form>
    </div>
  );
}
