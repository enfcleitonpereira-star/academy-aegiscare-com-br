import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/AppShell";
import { Award, Download } from "lucide-react";

export const Route = createFileRoute("/aluno/certificado")({
  component: CertificadoPage,
  head: () => ({ meta: [{ title: "Certificado — Aegis Care Academy" }] }),
});

function CertificadoPage() {
  const { user, profile } = useAuth();
  const { data: cert } = useQuery({
    queryKey: ["cert", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("certificates").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  return (
    <AppShell title="Certificado" subtitle="Reconhecimento institucional · 180h">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <span className="eyebrow">Reconhecimento</span>
          <h2 className="display text-4xl mt-3 max-w-2xl">Seu certificado digital da Aegis Care Academy.</h2>
        </header>

        <article className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-elev)] aspect-[1.41/1] bg-white border border-border" style={{ background: "linear-gradient(135deg, oklch(0.98 0.005 100) 0%, oklch(0.96 0.01 200) 100%)" }}>
          <div className="absolute top-8 left-8 right-8 flex items-start justify-between">
            <div>
              <span className="text-[0.65rem] uppercase tracking-[0.32em] text-mid">Aegis Care Academy</span>
              <div className="gold-line mt-3 !w-16" />
            </div>
            <Award className="h-10 w-10 text-gold" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground mb-4">Certificado de Conclusão</p>
            <h3 className="display text-3xl md:text-5xl text-ink mb-6">{profile?.full_name || "Seu Nome"}</h3>
            <p className="text-[0.95rem] text-muted-foreground max-w-md leading-relaxed">
              concluiu com excelência a <span className="font-medium text-ink">Formação em Cuidados ao Idoso no Domicílio</span>, com carga horária total de <span className="font-medium text-ink">180 horas</span>.
            </p>
            {!cert && <p className="mt-6 text-[0.78rem] text-gold">Certificado disponível após conclusão completa</p>}
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
            <div>
              <p className="text-[0.75rem] italic text-ink">Direção Acadêmica</p>
              <div className="h-px w-32 bg-ink mt-1" />
            </div>
            <div className="text-right">
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">Código</p>
              <p className="text-[0.85rem] font-mono mt-1">{cert?.certificate_code || "—— —— ——"}</p>
            </div>
          </div>
        </article>

        <div className="mt-8 flex justify-center">
          <button disabled={!cert} className="btn-primary disabled:opacity-50">
            <Download className="h-4 w-4" /> Baixar PDF
          </button>
        </div>
      </div>
    </AppShell>
  );
}
