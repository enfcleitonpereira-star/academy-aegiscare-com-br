import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LifeBuoy, Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/_aluno/suporte")({
  component: SuportePage,
  head: () => ({ meta: [{ title: "Suporte — Aegis Care Academy" }] }),
});

function SuportePage() {
  return (
    <AppShell title="Suporte" subtitle="Atendimento Academy">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <span className="eyebrow">Estamos aqui</span>
          <h2 className="display text-4xl mt-3 max-w-2xl">Atendimento humano, dedicado a você.</h2>
          <p className="mt-4 text-muted-foreground">Nossa equipe responde em até 24 horas úteis.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-5">
          <a href="mailto:academy@aegiscare.com.br" className="glass rounded-2xl p-7 hover:border-gold/40 transition-all group">
            <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center mb-5">
              <Mail className="h-5 w-5 text-mid" />
            </div>
            <h3 className="text-[1.05rem] font-medium">E-mail</h3>
            <p className="text-[0.88rem] text-muted-foreground mt-1.5">academy@aegiscare.com.br</p>
          </a>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="glass rounded-2xl p-7 hover:border-gold/40 transition-all group">
            <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center mb-5">
              <MessageCircle className="h-5 w-5 text-mid" />
            </div>
            <h3 className="text-[1.05rem] font-medium">WhatsApp</h3>
            <p className="text-[0.88rem] text-muted-foreground mt-1.5">Atendimento direto pelo WhatsApp</p>
          </a>
        </div>

        <div className="mt-10 glass rounded-2xl p-8 flex items-start gap-4">
          <LifeBuoy className="h-5 w-5 text-mid mt-0.5" />
          <div>
            <h4 className="font-medium text-[0.98rem]">Central de Ajuda</h4>
            <p className="text-[0.88rem] text-muted-foreground mt-1.5">Em breve, a base de conhecimento completa estará disponível aqui.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
