import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastro")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Criar conta — Aegis Care Academy" }] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", city: "", state: "", password: "" });
  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Senha precisa ter ao menos 6 caracteres."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/aluno`,
        data: {
          full_name: form.full_name, phone: form.phone, city: form.city, state: form.state,
        },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Conta criada. Verifique seu e-mail para confirmar.");
    setTimeout(() => navigate({ to: "/login" }), 1200);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="text-[0.75rem] text-muted-foreground hover:text-ink transition-colors">← Voltar ao site</Link>
            <span className="eyebrow mt-6 block">Central do Aluno</span>
            <h1 className="display text-[2.2rem] mt-3 mb-2 text-ink">Criar conta</h1>
            <p className="text-muted-foreground text-[0.9rem]">Comece sua jornada na Academy.</p>
          </div>

          <form onSubmit={handle} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[0.78rem] font-medium">Nome completo</Label>
              <Input required value={form.full_name} onChange={update("full_name")} className="h-11 bg-white border-border/70" />
            </div>
            <div className="space-y-2">
              <Label className="text-[0.78rem] font-medium">E-mail</Label>
              <Input type="email" required value={form.email} onChange={update("email")} className="h-11 bg-white border-border/70" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[0.78rem] font-medium">WhatsApp</Label>
                <Input value={form.phone} onChange={update("phone")} placeholder="(00) 00000-0000" className="h-11 bg-white border-border/70" />
              </div>
              <div className="space-y-2">
                <Label className="text-[0.78rem] font-medium">Estado</Label>
                <Input value={form.state} onChange={update("state")} placeholder="SP" maxLength={2} className="h-11 bg-white border-border/70 uppercase" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[0.78rem] font-medium">Cidade</Label>
              <Input value={form.city} onChange={update("city")} className="h-11 bg-white border-border/70" />
            </div>
            <div className="space-y-2">
              <Label className="text-[0.78rem] font-medium">Senha</Label>
              <Input type="password" required minLength={6} value={form.password} onChange={update("password")} className="h-11 bg-white border-border/70" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2 disabled:opacity-60">
              {loading ? "Criando..." : <>Criar conta <span className="arrow">→</span></>}
            </button>
          </form>

          <p className="mt-6 text-center text-[0.85rem] text-muted-foreground">
            Já tem conta? <Link to="/login" className="text-ink font-medium hover:text-mid transition-colors">Entrar</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-ink" />
        <div className="absolute inset-0" style={{ background: "var(--grad-deep)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 80%, oklch(0.74 0.08 80 / 0.18), transparent 60%)" }} />
        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <span className="gold-line" />
          <h2 className="display text-4xl mt-6 mb-4 max-w-md">Uma formação cuidada nos mínimos detalhes.</h2>
          <p className="text-white/65 text-[0.95rem] leading-relaxed max-w-md">8 módulos · 180 horas · certificado digital. Cuidar bem é uma escolha de excelência.</p>
        </div>
      </div>
    </div>
  );
}
