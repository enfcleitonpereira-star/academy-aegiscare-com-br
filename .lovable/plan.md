
# Central do Aluno — Aegis Care Academy

A landing page já está pronta. Este plano constrói toda a plataforma logada (aluno + admin) mantendo a mesma identidade visual (paleta aqua/teal/ink + dourado, glassmorphism, Inter Tight, animações cinematográficas).

O banco de dados **já existe** com todas as tabelas necessárias: `profiles` (com `access_status`: pending/active/blocked), `user_roles` (admin/student), `modules`, `lessons`, `lesson_progress`, `materials`, `activities`, `activity_submissions`, `exams`, `exam_attempts`, `certificates`, `forum_posts`, `announcements`. RLS já está configurada — alunos só veem conteúdo quando `access_status = 'active'`.

## Escopo

### 1. Autenticação premium
- `/auth` — login + cadastro em layout split-screen cinematográfico
- `/auth/reset-password` — recuperação
- Listener `onAuthStateChange` no root + invalidação de queries
- Layout `_authenticated` com guard via `beforeLoad`
- Google OAuth + email/senha
- Admin seed: `academy@aegiscare.com.br` recebe role `admin` automaticamente após primeiro signup (via trigger ou server fn)

### 2. Gating de pagamento
- Após signup, aluno entra em estado `pending`
- Tela `/pending` mostra status "aguardando confirmação", botão de pagamento (placeholder Stripe/MP — preparado para integração)
- Server function `activateAccess` (admin-only) muda `access_status` para `active`
- RLS já bloqueia módulos/aulas/materiais para não-ativos

### 3. Layout do aluno
- Sidebar fixa premium (collapsible) com 11 itens + ícones Lucide
- Header com avatar, nome, badge de status
- Wrapper com gradientes sutis e blur

### 4. Páginas do aluno
- **Início** (`/app`) — boas-vindas, progresso geral, próxima aula, últimos acessos, avisos pinned, mini-calendário
- **Minha Formação** (`/app/formacao`) — visão consolidada com timeline dos 8 módulos
- **Módulos** (`/app/modulos`) — grid premium de cards (cover, horas, % progresso, status, botão continuar)
- **Aula** (`/app/aula/$lessonId`) — player de vídeo, descrição, resumo, materiais, próximo/anterior, marcar concluída
- **Apostilas** (`/app/apostilas`) — biblioteca digital de PDFs
- **Vídeos** (`/app/videos`) — galeria de vídeos
- **Atividades** (`/app/atividades`) — questionários com correção
- **Fóruns** (`/app/forum`) — threads, respostas, badge de participação (0-10)
- **Avaliações** (`/app/avaliacoes`) — provas por módulo, tentativas, nota ≥7
- **Certificados** (`/app/certificados`) — emissão automática quando todas as provas passam; preview + download PDF (jsPDF) com layout cinematográfico
- **Perfil** (`/app/perfil`) — dados pessoais, avatar, telefone, cidade
- **Suporte** (`/app/suporte`) — FAQ + contato

### 5. Painel administrativo (`/admin/*`)
- Guard: apenas role `admin`
- **Dashboard** — totais (alunos, ativos, certificados, progresso médio)
- **Alunos** — listar, aprovar pagamento (toggle `access_status`), bloquear
- **Módulos & Aulas** — CRUD com upload de cover e vídeo (URL externa)
- **Materiais** — upload de PDFs (URL)
- **Atividades & Provas** — criar questões (JSON builder simples)
- **Fórum** — moderar
- **Avisos** — publicar/pinar
- **Certificados** — visualizar emitidos

### 6. Seed de conteúdo
- Migração `INSERT` dos 8 módulos com `order_index`, `hours` (180h total) e descrições
- Estrutura vazia de lessons/exams pronta para o admin popular

### 7. Integrações preparadas
- Stripe (botão placeholder no `/pending`) — pronto para `enable_stripe_payments` em fase seguinte
- Storage: vídeos/PDFs por URL externa (admin cola link); upload nativo pode vir depois

## Detalhes técnicos

- TanStack Start + server functions com `requireSupabaseAuth`
- Bearer attacher em `src/start.ts` (verificar/adicionar)
- Layout `_authenticated.tsx` + `_authenticated/_active.tsx` (para conteúdo gated)
- Layout `_authenticated/_admin.tsx` para área administrativa
- TanStack Query para todas as leituras (loader + `useSuspenseQuery`)
- Certificado: jsPDF + html2canvas para gerar PDF visual com paleta da marca
- Componentes shadcn: Sidebar, Card, Dialog, Form, Progress, Tabs
- Animações: Reveal existente + transições de página suaves

## Ordem de entrega

1. Migração: trigger admin auto-role + seed dos 8 módulos
2. Auth (login/signup/reset) + Google + listener
3. Layout autenticado + sidebar + guards (pending vs active vs admin)
4. Dashboard + Módulos + Aula + Materiais
5. Atividades + Provas + Fórum + Certificados
6. Painel admin completo
7. QA visual + responsividade

Como é trabalho muito extenso (≈ 30+ arquivos), entrego em sequência sem parar para confirmação entre etapas, mas posso pausar se você preferir validar fase por fase.
