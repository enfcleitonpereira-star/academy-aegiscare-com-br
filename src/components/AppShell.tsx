import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home, GraduationCap, BookOpen, FileText, Video, ListChecks,
  MessagesSquare, ClipboardCheck, Award, User, LifeBuoy, LogOut, ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { ReactNode } from "react";

const items = [
  { title: "Início", url: "/aluno", icon: Home },
  { title: "Minha Formação", url: "/aluno/formacao", icon: GraduationCap },
  { title: "Módulos", url: "/aluno/modulos", icon: BookOpen },
  { title: "Apostilas", url: "/aluno/apostilas", icon: FileText },
  { title: "Vídeos", url: "/aluno/videos", icon: Video },
  { title: "Atividades", url: "/aluno/atividades", icon: ListChecks },
  { title: "Fóruns", url: "/aluno/forum", icon: MessagesSquare },
  { title: "Avaliações", url: "/aluno/avaliacoes", icon: ClipboardCheck },
  { title: "Certificados", url: "/aluno/certificado", icon: Award },
  { title: "Perfil", url: "/aluno/perfil", icon: User },
  { title: "Suporte", url: "/aluno/suporte", icon: LifeBuoy },
];

function NavList() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { isAdmin } = useAuth();
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="eyebrow !text-[0.6rem]">Central do Aluno</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((it) => {
              const active = path === it.url || (it.url !== "/aluno" && path.startsWith(it.url));
              return (
                <SidebarMenuItem key={it.url}>
                  <SidebarMenuButton asChild isActive={active} tooltip={it.title}>
                    <Link to={it.url} className="flex items-center gap-3">
                      <it.icon className="h-[18px] w-[18px]" />
                      {!collapsed && <span className="text-[0.92rem]">{it.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {isAdmin && (
        <SidebarGroup>
          <SidebarGroupLabel className="eyebrow !text-[0.6rem]">Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={path.startsWith("/aluno/admin")} tooltip="Painel">
                  <Link to="/aluno/admin" className="flex items-center gap-3">
                    <ShieldCheck className="h-[18px] w-[18px]" />
                    {!collapsed && <span className="text-[0.92rem]">Painel Admin</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </>
  );
}

function UserBlock() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const initials = (profile?.full_name || profile?.email || "A").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
  return (
    <div className="flex items-center gap-3 p-2">
      <Avatar className="h-9 w-9 ring-1 ring-border">
        {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
        <AvatarFallback className="bg-ink text-primary-foreground text-xs">{initials}</AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="flex-1 min-w-0">
          <p className="text-[0.82rem] font-medium truncate">{profile?.full_name || "Aluno"}</p>
          <p className="text-[0.7rem] text-muted-foreground truncate">{profile?.email}</p>
        </div>
      )}
      {!collapsed && (
        <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }} className="p-2 rounded-md hover:bg-muted transition-colors" aria-label="Sair">
          <LogOut className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}

export function AppShell({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  const { profile } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon" className="border-r border-border/60">
          <SidebarHeader className="border-b border-border/40 px-4 py-5">
            <Link to="/aluno" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-ink flex items-center justify-center">
                <span className="gold-text text-sm font-semibold tracking-tight">AC</span>
              </div>
              <div className="leading-tight">
                <p className="text-[0.82rem] font-medium tracking-tight">Aegis Care</p>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">Academy</p>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2 py-3">
            <NavList />
          </SidebarContent>
          <SidebarFooter className="border-t border-border/40">
            <UserBlock />
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border/50 px-6 flex items-center justify-between bg-background/70 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div>
                {title && <h1 className="text-[1.05rem] font-medium tracking-tight">{title}</h1>}
                {subtitle && <p className="text-[0.72rem] text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile?.access_status === "active" ? (
                <Badge variant="outline" className="border-aqua/40 text-mid bg-aqua/10 font-normal text-[0.7rem]">Acesso liberado</Badge>
              ) : (
                <Badge variant="outline" className="border-gold/40 text-gold bg-gold/10 font-normal text-[0.7rem]">Aguardando aprovação</Badge>
              )}
            </div>
          </header>
          <main className="flex-1 p-6 md:p-10">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
