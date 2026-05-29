import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight, Award, BookOpen, HeartHandshake, ShieldCheck, GraduationCap,
  Sparkles, FileText, Users, MonitorPlay, Clock, Infinity as InfinityIcon,
  CheckCircle2, Stethoscope, Activity, Brain, HandHelping, Utensils, Syringe, LifeBuoy,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import logo from "@/assets/logo-aegis.png";
import heroImg from "@/assets/hero-care.jpg";
import aboutImg from "@/assets/about-hands.jpg";
import formationImg from "@/assets/formation.jpg";
import missionImg from "@/assets/mission.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aegis Care Academy — Educação continuada para o cuidado domiciliar" },
      { name: "description", content: "Núcleo institucional de educação continuada da Aegis Care. Formação prática, humanizada e baseada na realidade da assistência domiciliar." },
      { property: "og:title", content: "Aegis Care Academy" },
      { property: "og:description", content: "Capacitação prática, humanizada e baseada na realidade da assistência domiciliar." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

const differentials = [
  { icon: GraduationCap, title: "Educação continuada", text: "Aprendizado constante para acompanhar a evolução do cuidado." },
  { icon: HeartHandshake, title: "Conteúdo baseado em prática real", text: "Construído a partir das rotinas reais da assistência domiciliar." },
  { icon: Sparkles, title: "Humanização no cuidado", text: "Foco no acolhimento, escuta e dignidade do assistido." },
  { icon: ShieldCheck, title: "Segurança assistencial", text: "Protocolos claros para reduzir riscos no domicílio." },
  { icon: Award, title: "Formação profissional", text: "Trilha estruturada com avaliações e certificação." },
  { icon: BookOpen, title: "Capacitação contínua", text: "Atualizações periódicas e novos conteúdos práticos." },
];

const courseFacts = [
  { icon: Clock, label: "180 horas", sub: "de formação" },
  { icon: MonitorPlay, label: "100% EAD", sub: "modalidade online" },
  { icon: BookOpen, label: "Videoaulas", sub: "objetivas e práticas" },
  { icon: FileText, label: "Apostilas", sub: "digitais inclusas" },
  { icon: Users, label: "Fóruns", sub: "interativos" },
  { icon: CheckCircle2, label: "Avaliações", sub: "online" },
  { icon: Award, label: "Certificação", sub: "digital" },
  { icon: InfinityIcon, label: "Acesso flexível", sub: "no seu ritmo" },
];

const modules = [
  {
    n: "01", icon: HeartHandshake, h: "20h",
    title: "Fundamentos do Envelhecimento e da Pessoa Idosa",
    items: [
      "Processo natural do envelhecimento",
      "Envelhecimento fisiológico x patológico",
      "Alterações do envelhecimento",
      "Fragilidade do idoso",
      "Direitos da pessoa idosa",
      "Estatuto do Idoso",
      "Autonomia e dependência",
      "Qualidade de vida",
      "Humanização no cuidado",
    ],
  },
  {
    n: "02", icon: Users, h: "20h",
    title: "O Cuidador e o Cuidar",
    items: [
      "Papel do cuidador", "Ética profissional", "Postura profissional",
      "Comunicação com a família", "Rotina do cuidado domiciliar", "Organização do plantão",
      "Limites da atuação", "Segurança do assistido", "Saúde emocional do cuidador",
      "Humanização no atendimento",
    ],
  },
  {
    n: "03", icon: Activity, h: "20h",
    title: "Fisiologia do Envelhecimento",
    items: [
      "Alterações cardiovasculares", "Alterações respiratórias", "Alterações neurológicas",
      "Alterações musculares", "Alterações digestivas", "Alterações urinárias",
      "Mobilidade e equilíbrio", "Sarcopenia", "Alterações cognitivas", "Sono no idoso",
    ],
  },
  {
    n: "04", icon: Brain, h: "30h",
    title: "Demências e Condições Neurológicas",
    items: [
      "Introdução às demências", "Alzheimer", "Demência vascular",
      "Demência por corpos de Lewy", "Parkinson", "Confusão mental", "Delirium",
      "Desorientação", "Alterações comportamentais", "Agressividade", "Recusa alimentar",
      "Comunicação com idosos com demência", "Segurança do paciente desorientado",
    ],
  },
  {
    n: "05", icon: HandHelping, h: "30h",
    title: "Rotina Assistencial no Domicílio",
    items: [
      "Banho no leito", "Higiene corporal", "Higiene íntima", "Troca de fraldas",
      "Mudança de decúbito", "Conforto do assistido", "Prevenção de lesão por pressão",
      "Organização do quarto", "Ergonomia do cuidador", "Mobilização segura",
      "Prevenção de quedas", "Higiene oral", "Rotina do assistido acamado",
    ],
  },
  {
    n: "06", icon: Utensils, h: "20h",
    title: "Alimentação, Hidratação e Saúde do Idoso",
    items: [
      "Alimentação do idoso", "Hidratação", "Desidratação", "Disfagia", "Engasgo",
      "Recusa alimentar", "Constipação intestinal", "Incontinência urinária", "ITU",
      "Polifarmácia", "Vacinação do idoso",
    ],
  },
  {
    n: "07", icon: Syringe, h: "20h",
    title: "Cuidados com Dispositivos no Domicílio",
    items: [
      "Sonda vesical", "Bolsa coletora", "Sonda nasoenteral", "Gastrostomia",
      "Oxigenoterapia", "Concentrador de oxigênio", "Traqueostomia",
      "Cuidados básicos com dispositivos", "Higiene e segurança", "Sinais de alerta",
      "Limites da atuação do cuidador",
    ],
  },
  {
    n: "08", icon: LifeBuoy, h: "20h",
    title: "Primeiros Socorros e Intercorrências",
    items: [
      "Primeiros socorros", "Avaliação inicial", "RCP básica", "Engasgo", "Quedas",
      "Hipoglicemia", "AVC", "Crise convulsiva", "Febre", "Falta de ar",
      "Quando chamar emergência", "Comunicação de intercorrências",
    ],
  },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${scrolled ? "py-3" : "py-5"}`}>
      <div className={`mx-auto max-w-7xl px-6 transition-all duration-700`}>
        <div className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-700 ${scrolled ? "glass" : ""}`}>
          <a href="#top" className="flex items-center gap-3">
            <img src={logo} alt="Aegis Care Academy" className="h-9 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-9 text-sm text-ink-soft">
            <a href="#academy" className="hover:text-ink transition-colors">A Academy</a>
            <a href="#formacao" className="hover:text-ink transition-colors">Formação</a>
            <a href="#modulos" className="hover:text-ink transition-colors">Módulos</a>
            <a href="#certificado" className="hover:text-ink transition-colors">Certificação</a>
          </nav>
          <a href="#formacao" className="btn-primary !py-2.5 !px-5 !text-[0.82rem]">
            Acessar plataforma <ArrowUpRight className="arrow w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Landing() {
  return (
    <main id="top" className="relative overflow-x-clip">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-end pt-32 pb-16">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Cuidadora acolhendo idosa em ambiente domiciliar sofisticado" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "var(--grad-hero-overlay)" }} />
          <div className="absolute inset-0 bg-background/55" />
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(closest-side, oklch(0.74 0.08 80 / 0.18), transparent)" }} />
          <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(closest-side, oklch(0.50 0.08 222 / 0.18), transparent)" }} />
        </div>

        <div className="mx-auto max-w-7xl px-6 w-full">
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span className="gold-line" />
              <span className="eyebrow">Aegis Care · Academy</span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display text-[clamp(2.6rem,7vw,6.2rem)] max-w-5xl">
              Educação continuada<br />
              para transformar o <span className="italic font-light text-mid">cuidado domiciliar</span>.
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="mt-8 max-w-xl text-lg text-ink-soft leading-relaxed">
              Capacitação prática, humanizada e baseada na realidade da assistência domiciliar da Aegis Care.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#formacao" className="btn-primary">
                Conhecer a formação <ArrowUpRight className="arrow w-4 h-4" />
              </a>
              <a href="#academy" className="btn-ghost">Acessar plataforma</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section id="academy" className="relative py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12 md:gap-20 items-center">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[var(--shadow-elev)]">
              <img src={aboutImg} alt="Mãos entrelaçadas em cuidado humanizado" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute bottom-6 left-6 right-6 glass rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <span className="gold-line" />
                  <span className="eyebrow">Núcleo educacional</span>
                </div>
                <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                  O conhecimento que nasce da experiência real do cuidado.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="md:col-span-7 md:pl-8">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="gold-line" />
                <span className="eyebrow">O que é a Aegis Care Academy</span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="display text-[clamp(2rem,4.4vw,3.6rem)]">
                Onde a experiência do cuidado se transforma em <span className="italic font-light text-mid">conhecimento</span>.
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 space-y-6 text-[1.05rem] text-ink-soft leading-relaxed max-w-xl">
                <p>
                  A Aegis Care Academy é o núcleo educacional da Aegis Care, criado para promover capacitação contínua aos profissionais do cuidado domiciliar.
                </p>
                <p>
                  A proposta da Academy é transformar experiências reais da assistência domiciliar em conhecimento prático, acessível e aplicável à rotina dos cuidadores.
                </p>
                <p>Mais do que ensinar técnicas, a Academy busca fortalecer:</p>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 pt-2">
                  {["segurança assistencial", "postura profissional", "humanização no cuidado", "observação clínica", "excelência no atendimento domiciliar"].map((i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1 h-1 rounded-full bg-gold" />
                      <span className="text-ink">{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--grad-light)" }} />
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="gold-line" />
              <span className="eyebrow">Diferenciais</span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="display text-[clamp(1.8rem,3.6vw,3rem)] max-w-2xl">
              Um padrão de formação à altura do cuidado que prestamos.
            </h2>
          </Reveal>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {differentials.map((d, i) => (
              <Reveal key={d.title} delay={i * 70}>
                <div className="module-card h-full">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6" style={{ background: "oklch(0.96 0.02 220)" }}>
                    <d.icon className="w-5 h-5 text-deep" strokeWidth={1.4} />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight text-ink">{d.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">{d.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FORMAÇÃO OFICIAL */}
      <section id="formacao" className="relative py-32 md:py-44 text-white" style={{ background: "var(--grad-deep)" }}>
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 30% 20%, oklch(0.88 0.12 180 / 0.25), transparent 55%), radial-gradient(ellipse at 80% 80%, oklch(0.74 0.08 80 / 0.18), transparent 55%)" }} />
        <div className="relative mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="gold-line" />
                <span className="eyebrow !text-aqua">Formação oficial</span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="display text-[clamp(2rem,4.6vw,4rem)]">
                Formação em <span className="italic font-light gold-text">Cuidados ao Idoso</span> no Domicílio.
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 text-lg text-white/75 leading-relaxed max-w-xl">
                Uma formação completa, prática e humanizada para profissionais que desejam atuar com mais segurança, preparo e excelência na assistência domiciliar.
              </p>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {courseFacts.map((f) => (
                  <div key={f.label} className="glass-dark rounded-xl p-4">
                    <f.icon className="w-4 h-4 text-gold" strokeWidth={1.4} />
                    <div className="mt-3 text-sm font-medium">{f.label}</div>
                    <div className="text-xs text-white/55">{f.sub}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal className="md:col-span-6" delay={200}>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                <img src={formationImg} alt="Profissional acompanhando idosa em estudo" className="w-full h-full object-cover" loading="lazy" />
              </div>

              {/* Price card */}
              <div className="absolute -bottom-10 -left-6 md:-left-12 glass rounded-2xl p-6 w-[280px]">
                <div className="flex items-center gap-2 text-ink">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span className="eyebrow !text-[0.65rem]">Investimento</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-[2.2rem] font-light tracking-tight text-ink">R$ 129,99</span>
                </div>
                <div className="text-sm text-ink-soft line-through">R$ 199,99</div>
                <div className="hairline my-4" />
                <div className="flex items-center gap-2 text-xs text-ink-soft">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="tracking-wider uppercase font-medium text-ink">Vagas limitadas</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MÓDULOS */}
      <section id="modulos" className="relative py-32 md:py-44">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--grad-light)" }} />
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="gold-line" />
              <span className="eyebrow">O que você vai aprender</span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="display text-[clamp(2rem,4.4vw,3.6rem)] max-w-3xl">
              Oito módulos pensados para a <span className="italic font-light text-mid">realidade do domicílio</span>.
            </h2>
          </Reveal>

          <div className="mt-20 grid md:grid-cols-2 gap-5">
            {modules.map((m, i) => (
              <Reveal key={m.n} delay={(i % 2) * 100}>
                <article className="module-card h-full">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-medium text-gold tracking-widest">MÓDULO {m.n}</span>
                    </div>
                    <span className="text-xs uppercase tracking-widest text-ink-soft">{m.h}</span>
                  </div>
                  <div className="mt-6 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "oklch(0.96 0.02 220)" }}>
                      <m.icon className="w-5 h-5 text-deep" strokeWidth={1.4} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-medium tracking-tight text-ink leading-tight">{m.title}</h3>
                  </div>
                  <div className="hairline my-6" />
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-ink-soft">
                    {m.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5">
                        <span className="mt-2 w-1 h-1 rounded-full bg-gold shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ESTRUTURA PEDAGÓGICA */}
      <section className="relative py-32 md:py-40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-12 gap-16">
            <div className="md:col-span-5">
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <span className="gold-line" />
                  <span className="eyebrow">Estrutura pedagógica</span>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <h2 className="display text-[clamp(1.8rem,3.6vw,3rem)]">
                  Uma arquitetura de ensino simples, completa e <span className="italic font-light text-mid">consistente</span>.
                </h2>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-10 glass rounded-2xl p-6">
                  <div className="eyebrow mb-3">Sistema de avaliação</div>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    O aluno deverá atingir nota mínima de <span className="text-ink font-medium">7,0 pontos</span> para aprovação nos módulos.
                  </p>
                  <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                    Os fóruns de interação possuem participação avaliativa de <span className="text-ink font-medium">0 a 10 pontos</span>.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
              {[
                { i: MonitorPlay, t: "Videoaulas objetivas", s: "Conteúdo direto e aplicável." },
                { i: FileText, t: "Apostilas digitais", s: "Material de leitura por módulo." },
                { i: BookOpen, t: "Materiais complementares", s: "Checklists e guias rápidos." },
                { i: Users, t: "Fóruns avaliativos", s: "Troca entre profissionais." },
                { i: CheckCircle2, t: "Provas online", s: "Avaliação por módulo." },
                { i: Award, t: "Certificado digital", s: "Emitido pela Academy." },
              ].map((x, i) => (
                <Reveal key={x.t} delay={i * 60}>
                  <div className="module-card h-full">
                    <x.i className="w-5 h-5 text-deep" strokeWidth={1.4} />
                    <div className="mt-5 text-base font-medium text-ink">{x.t}</div>
                    <div className="text-sm text-ink-soft mt-1">{x.s}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MATERIAIS DE APOIO */}
      <section className="relative py-32 md:py-40">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--grad-light)" }} />
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="gold-line" />
                <span className="eyebrow">Materiais de apoio</span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="display text-[clamp(1.8rem,3.6vw,3rem)] max-w-lg">
                Recursos sofisticados para acompanhar cada passo.
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <ul className="mt-10 space-y-4 text-ink-soft">
                {["Apostilas digitais", "Checklists", "Materiais complementares", "Guias rápidos", "Conteúdos práticos", "Arquivos em PDF"].map((m) => (
                  <li key={m} className="flex items-center gap-4">
                    <span className="gold-line !w-6" />
                    <span className="text-ink">{m}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Mockups */}
          <Reveal className="md:col-span-6" delay={200}>
            <div className="relative h-[460px]">
              <div className="absolute left-4 top-6 w-56 h-80 rounded-2xl bg-white shadow-[var(--shadow-elev)] p-5 rotate-[-6deg] transition-transform duration-700 hover:rotate-[-3deg]">
                <div className="eyebrow !text-[0.6rem]">Apostila</div>
                <div className="mt-2 text-sm font-medium text-ink leading-tight">Fundamentos do Envelhecimento</div>
                <div className="hairline my-4" />
                <div className="space-y-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-muted" style={{ width: `${90 - i * 7}%` }} />
                  ))}
                </div>
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                  <span className="text-[0.6rem] uppercase tracking-widest text-ink-soft">PDF</span>
                  <span className="gold-text text-xs">Aegis Academy</span>
                </div>
              </div>

              <div className="absolute left-44 top-0 w-60 h-80 rounded-2xl bg-white shadow-[var(--shadow-elev)] p-5 rotate-[3deg] transition-transform duration-700 hover:rotate-[6deg]">
                <div className="eyebrow !text-[0.6rem]">Checklist</div>
                <div className="mt-2 text-sm font-medium text-ink leading-tight">Rotina assistencial diária</div>
                <div className="hairline my-4" />
                <ul className="space-y-3 text-xs text-ink-soft">
                  {["Higiene matinal", "Hidratação", "Mobilização", "Alimentação", "Medicação", "Registro do plantão"].map((c) => (
                    <li key={c} className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded border border-border flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-sm bg-gold" />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="absolute right-2 top-20 w-52 h-72 rounded-2xl glass p-5 rotate-[7deg] transition-transform duration-700 hover:rotate-[4deg]">
                <Stethoscope className="w-4 h-4 text-deep" strokeWidth={1.4} />
                <div className="mt-3 text-sm font-medium text-ink leading-tight">Guia rápido — sinais de alerta</div>
                <div className="hairline my-3" />
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-md bg-muted" />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CERTIFICADO */}
      <section id="certificado" className="relative py-32 md:py-44 text-white overflow-hidden" style={{ background: "var(--grad-deep)" }}>
        <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.74 0.08 80 / 0.2), transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="gold-line" />
                <span className="eyebrow !text-aqua">Certificação</span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="display text-[clamp(2rem,4.2vw,3.4rem)]">
                Uma <span className="italic gold-text font-light">conquista</span> que carrega o peso da Aegis Care.
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 text-lg text-white/75 leading-relaxed max-w-md">
                Os alunos que concluírem a formação e atingirem os critérios mínimos de desempenho receberão certificação digital emitida pela Aegis Care Academy.
              </p>
            </Reveal>
          </div>

          <Reveal className="md:col-span-7" delay={200}>
            <div className="relative">
              <div className="absolute -inset-10 rounded-3xl" style={{ background: "radial-gradient(closest-side, oklch(0.74 0.08 80 / 0.25), transparent)" }} />
              <div className="relative aspect-[1.55/1] rounded-2xl bg-gradient-to-br from-white to-[oklch(0.97_0.01_220)] p-10 shadow-[0_50px_120px_-20px_rgba(0,0,0,0.6)]" style={{ border: "1px solid oklch(0.74 0.08 80 / 0.4)" }}>
                <div className="absolute inset-3 rounded-xl pointer-events-none" style={{ border: "1px solid oklch(0.74 0.08 80 / 0.3)" }} />
                <div className="relative h-full flex flex-col">
                  <div className="flex items-start justify-between">
                    <img src={logo} alt="Aegis" className="h-12 w-auto" />
                    <div className="text-right">
                      <div className="eyebrow !text-ink-soft">Certificado</div>
                      <div className="text-[0.65rem] tracking-widest text-ink-soft mt-1">Nº 2026-AC-0001</div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="eyebrow !text-mid">Certificamos que</div>
                    <div className="mt-3 text-2xl md:text-4xl font-light tracking-tight text-ink">[ Nome do aluno ]</div>
                    <div className="mt-4 text-sm text-ink-soft max-w-md leading-relaxed">
                      concluiu com aproveitamento a <span className="text-ink font-medium">Formação em Cuidados ao Idoso no Domicílio</span>, com carga horária total de 180 horas.
                    </div>

                    <div className="mt-8 flex items-end justify-between">
                      <div>
                        <div className="w-44 hairline" />
                        <div className="text-xs text-ink-soft mt-2">Aegis Care Academy</div>
                      </div>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--grad-gold)" }}>
                        <Award className="w-7 h-7 text-white" strokeWidth={1.2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSÃO */}
      <section className="relative py-32 md:py-44">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-16 items-center">
          <Reveal className="md:col-span-6 order-2 md:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[var(--shadow-elev)]">
              <img src={missionImg} alt="Cuidadora apoiando idoso ao se levantar" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </Reveal>
          <div className="md:col-span-6 order-1 md:order-2">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="gold-line" />
                <span className="eyebrow">Nossa missão</span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="display text-[clamp(2rem,4.4vw,3.6rem)]">
                Cuidar de quem <span className="italic font-light text-mid">cuida</span>.
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 text-lg text-ink-soft leading-relaxed max-w-xl">
                Fortalecer a qualidade da assistência domiciliar através da educação continuada, da humanização no cuidado e da valorização dos profissionais que cuidam diariamente de vidas e famílias.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-12 flex flex-wrap gap-3">
                <a href="#formacao" className="btn-primary">
                  Conhecer a formação <ArrowUpRight className="arrow w-4 h-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative pt-20 pb-10 text-white" style={{ background: "var(--grad-deep)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-12 gap-12 pb-14">
            <div className="md:col-span-5">
              <img src={logo} alt="Aegis Care Academy" className="h-12 w-auto brightness-0 invert opacity-95" />
              <p className="mt-6 text-sm text-white/65 max-w-sm leading-relaxed">
                Núcleo institucional de educação continuada da Aegis Care. Formação humanizada para a assistência domiciliar.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="eyebrow !text-aqua mb-4">Academy</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#academy" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#formacao" className="hover:text-white transition-colors">Formação</a></li>
                <li><a href="#modulos" className="hover:text-white transition-colors">Módulos</a></li>
                <li><a href="#certificado" className="hover:text-white transition-colors">Certificação</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <div className="eyebrow !text-aqua mb-4">Institucional</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Aegis Care</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <div className="eyebrow !text-aqua mb-4">Contato</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li>contato@aegiscare.com.br</li>
                <li>Atendimento institucional</li>
              </ul>
              <div className="mt-6 flex gap-2">
                {["IN", "IG", "LI"].map((s) => (
                  <a key={s} href="#" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[0.65rem] tracking-widest text-white/70 hover:border-gold hover:text-gold transition-colors">{s}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/50" style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }}>
            <div>© {new Date().getFullYear()} Aegis Care Academy. Todos os direitos reservados.</div>
            <div className="flex items-center gap-2">
              <span className="gold-line !w-6" />
              <span>Educação que transforma o cuidado</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
