import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/recuperar-senha")({
  component: ResetPage,
  head: () => ({ meta: [{ title: "Recuperar senha — Aegis Care Academy" }] }),
});

function ResetPage() {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false); const [sent, setSent] = useState(false);
  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/redefinir-senha` });
    setLoading(false);
    if (error) toast.error(error.message); else { setSent(true); toast.success("E-mail enviado."); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="text-[0.75rem] text-muted-foreground hover:text-ink transition-colors">← Voltar ao login</Link>
        <span className="eyebrow mt-6 block">Recuperação</span>
        <h1 className="display text-[2.2rem] mt-3 mb-2 text-ink">Recuperar senha</h1>
        <p className="text-muted-foreground text-[0.92rem] mb-8">Enviaremos um link de redefinição para seu e-mail.</p>
        {sent ? (
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-[0.92rem]">Verifique sua caixa de entrada em <span className="font-medium">{email}</span>.</p>
          </div>
        ) : (
          <form onSubmit={handle} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[0.78rem] font-medium">E-mail</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 bg-white border-border/70" />
            </div>
            <button disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">{loading ? "Enviando..." : "Enviar link"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
