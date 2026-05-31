import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Award, Download } from "lucide-react";
import jsPDF from "jspdf";

export const Route = createFileRoute("/app/certificados")({ component: Certificados });

function Certificados() {
  const { profile } = useAuth();
  const { data } = useQuery({
    queryKey: ["cert", profile?.user_id],
    enabled: !!profile?.user_id,
    queryFn: async () => {
      const { data } = await supabase.from("certificates").select("*").eq("user_id", profile!.user_id);
      return data ?? [];
    },
  });

  const downloadPdf = (code: string, hours: number) => {
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    pdf.setFillColor(23, 42, 80);
    pdf.rect(0, 0, 297, 210, "F");
    pdf.setDrawColor(200, 169, 107);
    pdf.setLineWidth(0.6);
    pdf.rect(10, 10, 277, 190);
    pdf.setTextColor(200, 169, 107);
    pdf.setFontSize(10);
    pdf.text("AEGIS CARE ACADEMY", 148, 30, { align: "center" });
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(40);
    pdf.text("Certificado", 148, 70, { align: "center" });
    pdf.setFontSize(12);
    pdf.text("Certificamos que", 148, 95, { align: "center" });
    pdf.setFontSize(28);
    pdf.text(profile?.full_name || "—", 148, 115, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(`concluiu com êxito a Formação em Assistência Domiciliar — ${hours}h.`, 148, 135, { align: "center" });
    pdf.setFontSize(9);
    pdf.text(`Código de validação: ${code}`, 148, 180, { align: "center" });
    pdf.save(`certificado-${code}.pdf`);
  };

  return (
    <div className="space-y-10">
      <div><span className="eyebrow">Reconhecimento</span><h1 className="display text-5xl mt-3">Certificados</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">Emissão automática ao concluir a trilha completa com nota ≥ 7.</p></div>

      {!data?.length ? (
        <div className="glass rounded-3xl p-12 text-center">
          <Award className="w-12 h-12 text-gold mx-auto" />
          <h3 className="display text-2xl mt-6">Seu certificado aparecerá aqui</h3>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">Conclua todos os módulos e seja aprovado nas avaliações para emissão automática.</p>
        </div>
      ) : (
        data.map((c) => (
          <div key={c.id} className="rounded-3xl p-10 text-white" style={{ background: "var(--grad-deep)" }}>
            <div className="text-xs tracking-[0.3em] uppercase text-gold">Aegis Care Academy</div>
            <div className="display text-5xl mt-6">Certificado</div>
            <div className="mt-8 text-white/80">Outorgado a</div>
            <div className="display text-3xl mt-2">{profile?.full_name}</div>
            <div className="mt-6 text-white/70 max-w-xl">Pela conclusão da Formação em Assistência Domiciliar — {c.total_hours}h.</div>
            <div className="mt-10 flex items-center justify-between">
              <div className="text-xs text-white/50">Código: {c.certificate_code}</div>
              <button onClick={() => downloadPdf(c.certificate_code, c.total_hours)} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold text-ink text-sm font-medium hover:bg-gold-soft transition">
                <Download className="w-4 h-4" /> Baixar PDF
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
