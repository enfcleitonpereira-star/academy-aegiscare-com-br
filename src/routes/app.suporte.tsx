import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/app/suporte")({ component: Suporte });

function Suporte() {
  return (
    <div className="space-y-10 max-w-3xl">
      <div><span className="eyebrow">Estamos com você</span><h1 className="display text-5xl mt-3">Suporte</h1>
      <p className="text-muted-foreground mt-3">Nossa equipe acolhe e responde com a mesma sensibilidade do cuidado.</p></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <a href="mailto:academy@aegiscare.com.br" className="module-card"><Mail className="w-6 h-6 text-mid" /><h3 className="mt-4 font-medium">E-mail</h3><p className="text-sm text-muted-foreground mt-2">academy@aegiscare.com.br</p></a>
        <a href="https://wa.me/" className="module-card"><MessageCircle className="w-6 h-6 text-mid" /><h3 className="mt-4 font-medium">WhatsApp</h3><p className="text-sm text-muted-foreground mt-2">Atendimento humano</p></a>
      </div>
      <div className="glass rounded-2xl p-8">
        <LifeBuoy className="w-6 h-6 text-mid" />
        <h3 className="display text-2xl mt-4">Dúvidas frequentes</h3>
        <div className="mt-6 space-y-5 text-sm">
          <div><strong>Como meu acesso é liberado?</strong><p className="text-muted-foreground mt-1">Após confirmação do pagamento, o curso completo é liberado automaticamente.</p></div>
          <div><strong>Como recebo o certificado?</strong><p className="text-muted-foreground mt-1">Ao concluir todos os módulos e obter nota ≥ 7 nas avaliações, emissão é automática.</p></div>
        </div>
      </div>
    </div>
  );
}
