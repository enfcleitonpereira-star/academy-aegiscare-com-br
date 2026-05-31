import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  Home, GraduationCap, BookOpen, FileText, Video, ClipboardCheck,
  MessagesSquare, Award, ScrollText, User, LifeBuoy, LogOut, Shield, Menu, X,
} from "lucide-react";
import { useState, ReactNode, useEffect } from "react";
import logo from "@/assets/logo-aegis.png";

const studentNav = [
  { to: "/app", label: "Início", icon: Home, exact: true },
  { to: "/app/formacao", label: "Minha Formação", icon: GraduationCap },
  { to: "/app/modulos", label: "Módulos", icon: BookOpen },
  { to: "/app/apostilas", label: "Apostilas", icon: FileText },
  { to: "/app/videos", label: "Vídeos", icon: Video },
  { to: "/app/atividades", label: "Atividades", icon: ClipboardCheck },
  { to: "/app/forum", label: "Fóruns", icon: MessagesSquare },
  { to: "/app/avaliacoes", label: "Avaliações", icon: ScrollText },
  { to: "/app/certificados", label: "Certificados", icon: Award },
  { to: "/app/perfil", label: "Perfil", icon: User },
  { to: "/app/suporte", label: "Suporte", icon: LifeBuoy },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { loading, session, profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  useEffect(() => { setMobileOpen(false); }, [path]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-mid border-t-transparent animate-spin" />
      </div>
    );
  }

  const pending = profile?.access_status === "pending";
  const blocked = profile?.access_status === "blocked";

  return (
    <div className="min-h-screen flex" style={{ background: "var(--grad-light), var(--background)" }}>
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 border-r border-border/60 bg-card/60 backdrop-blur-xl">
        <SidebarInner path={path} role={role} signOut={signOut} profile={profile} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card flex flex-col">
            <SidebarInner path={path} role={role} signOut={signOut} profile={profile} />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-72 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 px-4 md:px-10 h-16 flex items-center justify-between border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            {profile && (
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">{profile.full_name || "Aluno(a)"}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {role === "admin" ? "Administrador" : pending ? "Aguardando aprovação" : blocked ? "Acesso bloqueado" : "Aluno ativo"}
                </div>
              </div>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mid to-deep text-white flex items-center justify-center text-sm font-medium">
              {(profile?.full_name || profile?.email || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="px-4 md:px-10 py-8 md:py-12 max-w-7xl mx-auto">
          {pending && path.startsWith("/app") && !path.startsWith("/app/perfil") && !path.startsWith("/app/suporte") ? (
            <PendingBanner />
          ) : blocked ? (
            <div className="glass rounded-2xl p-10 text-center">
              <h2 className="display text-3xl">Acesso bloqueado</h2>
              <p className="text-muted-foreground mt-3">Entre em contato com a Academy para reativar seu acesso.</p>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarInner({
  path, role, signOut, profile,
}: { path: string; role: string | null; signOut: () => void; profile: { full_name: string; email: string } | null }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="" className="h-9 w-9" />
          <div className="leading-tight">
            <div className="text-[11px] tracking-[0.22em] uppercase text-mid font-medium">Aegis Care</div>
            <div className="text-sm font-light">Academy</div>
          </div>
        </Link>
        <button onClick={() => { /* mobile close handled by overlay */ }} className="lg:hidden p-1 text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <nav className="px-3 flex-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Central do Aluno</div>
        {studentNav.map((item) => {
          const active = item.exact ? path === item.to : path === item.to || path.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl text-sm transition-all ${
                active
                  ? "bg-gradient-to-r from-ink to-deep text-white shadow-[0_8px_30px_-12px_oklch(0.24_0.06_264_/_0.5)]"
                  : "text-foreground/70 hover:text-foreground hover:bg-accent/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-gold" : ""}`} />
              <span className="font-medium tracking-tight">{item.label}</span>
            </Link>
          );
        })}
        {role === "admin" && (
          <>
            <div className="px-3 mt-6 mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Administração</div>
            <Link to="/admin" className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              path.startsWith("/admin") ? "bg-gradient-to-r from-ink to-deep text-white" : "text-foreground/70 hover:bg-accent/60"
            }`}>
              <Shield className="w-4 h-4 text-gold" /> Painel administrativo
            </Link>
          </>
        )}
      </nav>
      <div className="p-3 border-t border-border/60">
        <button
          onClick={async () => { await signOut(); navigate({ to: "/" }); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-destructive hover:bg-accent/60 transition"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
        <div className="px-3 mt-2 text-[11px] text-muted-foreground">
          {profile?.email}
        </div>
      </div>
    </>
  );
}

function PendingBanner() {
  return (
    <div className="glass rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto">
      <span className="eyebrow">Status da matrícula</span>
      <h2 className="display text-4xl md:text-5xl mt-4">
        Aguardando<br/><em className="gold-text not-italic">confirmação de pagamento</em>.
      </h2>
      <p className="text-muted-foreground mt-6 leading-relaxed">
        Sua conta está criada. Assim que o pagamento for confirmado, todo o conteúdo da formação (180h) será liberado automaticamente.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
        <a href="https://wa.me/" className="btn-primary justify-center">Falar com a Academy</a>
        <Link to="/app/perfil" className="btn-ghost justify-center">Completar perfil</Link>
      </div>
      <div className="mt-10 pt-8 hairline text-xs text-muted-foreground">
        Investimento da formação completa: <strong className="text-ink">R$ 129,99</strong> · Acesso vitalício · Certificado 180h
      </div>
    </div>
  );
}
