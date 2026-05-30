import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/redefinir-senha")({
  component: NewPasswordPage,
  head: () => ({ meta: [{ title: "Nova senha — Aegis Care Academy" }] }),
});

function NewPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false);
  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); if (password.length < 6) { toast.error("Mínimo 6 caracteres"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Senha redefinida."); navigate({ to: "/aluno" }); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <span className="eyebrow">Nova senha</span>
        <h1 className="display text-[2.2rem] mt-3 mb-8 text-ink">Defina sua nova senha</h1>
        <form onSubmit={handle} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[0.78rem] font-medium">Nova senha</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 bg-white border-border/70" />
          </div>
          <button disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">{loading ? "Salvando..." : "Redefinir senha"}</button>
        </form>
      </div>
    </div>
  );
}
