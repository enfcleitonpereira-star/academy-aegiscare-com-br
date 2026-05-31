import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowUpRight, Loader2 } from "lucide-react";
import logo from "@/assets/logo-aegis.png";
import heroImg from "@/assets/hero-care.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Acessar a Central — Aegis Care Academy" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/app" });
  }, [session, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta.");
        navigate({ to: "/app" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { full_name: fullName, phone },
          },
        });
        if (error) throw error;
        toast.success("Conta criada. Bem-vindo à Academy.");
        navigate({ to: "/app" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Enviamos um e-mail para redefinir sua senha.");
        setMode("login");
      }
    } catch (err) {
      const e = err as Error;
      toast.error(e.message || "Não foi possível concluir.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:block">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.24 0.06 264 / 0.85), oklch(0.40 0.08 235 / 0.7))" }} />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Aegis Care Academy" className="h-10 w-10" />
            <div className="leading-tight">
              <div className="text-sm tracking-[0.2em] uppercase font-medium opacity-90">Aegis Care</div>
              <div className="text-base font-light tracking-wide">Academy</div>
            </div>
          </Link>
          <div className="max-w-md">
            <span className="eyebrow text-white/70">Central do Aluno</span>
            <h1 className="display text-5xl mt-4 font-light">
              Educação continuada<br />em <em className="gold-text not-italic font-normal">cuidado humanizado</em>.
            </h1>
            <p className="mt-6 text-white/75 leading-relaxed">
              Acesse sua jornada formativa. Conteúdos práticos, materiais institucionais e acompanhamento contínuo.
            </p>
          </div>
          <div className="text-xs text-white/50 tracking-wider">© Aegis Care Academy · Formação 180h</div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <img src={logo} alt="" className="h-8 w-8" /> <span className="font-medium">Aegis Care Academy</span>
          </Link>
          <span className="eyebrow">
            {mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar acesso"}
          </span>
          <h2 className="display text-4xl mt-3 mb-2">
            {mode === "login" ? "Bem-vindo." : mode === "signup" ? "Comece sua formação." : "Vamos restaurar."}
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            {mode === "login"
              ? "Acesse sua conta para continuar a jornada."
              : mode === "signup"
              ? "Crie sua conta e dê início à formação premium."
              : "Enviaremos um link seguro para o seu e-mail."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <Field label="Nome completo" value={fullName} onChange={setFullName} required />
                <Field label="Telefone" value={phone} onChange={setPhone} />
              </>
            )}
            <Field label="E-mail" type="email" value={email} onChange={setEmail} required />
            {mode !== "reset" && (
              <Field label="Senha" type="password" value={password} onChange={setPassword} required minLength={6} />
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full justify-center mt-6">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  {mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
                  <ArrowUpRight className="w-4 h-4 arrow" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-sm text-muted-foreground flex flex-col gap-2">
            {mode === "login" ? (
              <>
                <button onClick={() => setMode("signup")} className="hover:text-ink transition text-left">
                  Não tem conta? <span className="text-ink font-medium">Criar agora</span>
                </button>
                <button onClick={() => setMode("reset")} className="hover:text-ink transition text-left">
                  Esqueceu a senha?
                </button>
              </>
            ) : (
              <button onClick={() => setMode("login")} className="hover:text-ink transition text-left">
                ← Voltar para login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required, minLength,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; minLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="mt-2 w-full px-4 py-3 rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-mid/30 focus:border-mid transition text-sm"
      />
    </label>
  );
}
