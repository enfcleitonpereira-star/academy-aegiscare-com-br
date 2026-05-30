import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Entrar — Aegis Care Academy" }] }),
});

function LoginPage() {
  const { session, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: isAdmin ? "/aluno/admin" : "/aluno", replace: true });
  }, [session, isAdmin, navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos" : error.message);
    else toast.success("Bem-vindo de volta.");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-ink" />
        <div className="absolute inset-0" style={{ background: "var(--grad-deep)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, oklch(0.74 0.08 80 / 0.18), transparent 60%)" }} />
        <div className="relative z-10 flex flex-col justify-between p-16 text-white">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15">
              <span className="gold-text text-sm font-semibold">AC</span>
            </div>
            <div className="leading-tight">
              <p className="text-[0.82rem] font-medium">Aegis Care</p>
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/60">Academy</p>
            </div>
          </Link>
          <div className="max-w-md">
            <span className="gold-line" />
            <h2 className="display text-4xl mt-6 mb-4">Continue sua jornada de excelência assistencial.</h2>
            <p className="text-white/65 text-[0.95rem] leading-relaxed">Acesse sua Central do Aluno e retome o cuidado humanizado de onde parou.</p>
          </div>
          <p className="text-white/40 text-[0.7rem] uppercase tracking-[0.22em]">Plataforma Premium · 180 horas</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <span className="eyebrow">Central do Aluno</span>
            <h1 className="display text-[2.4rem] mt-3 mb-2 text-ink">Entrar</h1>
            <p className="text-muted-foreground text-[0.92rem]">Acesse sua conta para continuar a formação.</p>
          </div>

          <form onSubmit={handle} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[0.78rem] font-medium">E-mail</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" className="h-12 border-border/70 bg-white" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[0.78rem] font-medium">Senha</Label>
                <Link to="/recuperar-senha" className="text-[0.75rem] text-mid hover:text-ink transition-colors">Esqueci a senha</Link>
              </div>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12 border-border/70 bg-white" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? "Entrando..." : <>Entrar <span className="arrow">→</span></>}
            </button>
          </form>

          <p className="mt-8 text-center text-[0.85rem] text-muted-foreground">
            Ainda não tem conta? <Link to="/cadastro" className="text-ink font-medium hover:text-mid transition-colors">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
