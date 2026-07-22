import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, Bell, LayoutDashboard, FileText, MessageSquareText, Building2,
  ShoppingBag, History as HistoryIcon, User, LogOut, ChevronRight, ChevronDown,
  Sparkles, Copy, Check, Loader2, X, Menu, ArrowRight, Star, ShieldCheck,
  Mail, Phone, MapPin, Clock, Trash2, AlertTriangle, Send, Eye, EyeOff, Scale,
  Zap, Droplet, Volume2, Construction, Sun, Moon, ExternalLink, Trash,
  TreePine, Wifi, Stethoscope, ClipboardList, ArrowLeft, Quote
} from "lucide-react";
import { storage } from "./storage.js";
import { auth, db, googleProvider } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/* ============================================================
   YOUKNOWRECIFE — design tokens
   Civic yellow (carimbo/selo) + navy authority, with a
   "protocolo oficial" signature language: dashed stamp badges,
   mono protocol numbers, torn-ticket cards.
   ============================================================ */

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap');
`;

const GLOBAL_CSS = `
${FONTS}
:root{
  --yn-primary:#FFD500;
  --yn-primary-ink:#4a3f00;
  --yn-secondary:#0F172A;
  --yn-bg:#F8FAFC;
  --yn-card:#FFFFFF;
  --yn-accent:#22C55E;
  --yn-danger:#EF4444;
  --yn-text:#111827;
  --yn-border:rgba(0,0,0,.08);
}
*{box-sizing:border-box;}
html{ scroll-behavior:smooth; }
#features, #how, #faq{ scroll-margin-top: 76px; }
.ykr{
  font-family:'Inter',ui-sans-serif,system-ui,sans-serif;
  color:var(--yn-text);
  background:var(--yn-bg);
  -webkit-font-smoothing:antialiased;
}
.ykr .mono{ font-family:'JetBrains Mono',monospace; letter-spacing:.02em; }
.ykr ::selection{ background:var(--yn-primary); color:var(--yn-secondary); }

@keyframes ykr-fade-up{ from{opacity:0; transform:translateY(14px);} to{opacity:1; transform:translateY(0);} }
@keyframes ykr-float{ 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-14px) rotate(2deg);} }
@keyframes ykr-float-slow{ 0%,100%{transform:translateY(0);} 50%{transform:translateY(-22px);} }
@keyframes ykr-spin-slow{ from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
@keyframes ykr-shimmer{ 0%{background-position:-400px 0;} 100%{background-position:400px 0;} }
@keyframes ykr-pulse-ring{ 0%{ box-shadow:0 0 0 0 rgba(255,213,0,.55);} 100%{ box-shadow:0 0 0 14px rgba(255,213,0,0);} }
@keyframes ykr-pop{ 0%{ transform:scale(.92); opacity:0;} 100%{ transform:scale(1); opacity:1;} }

.ykr-animate-up{ animation: ykr-fade-up .6s cubic-bezier(.16,1,.3,1) both; }
.ykr-float{ animation: ykr-float 7s ease-in-out infinite; }
.ykr-float-slow{ animation: ykr-float-slow 9s ease-in-out infinite; }
.ykr-spin-slow{ animation: ykr-spin-slow 18s linear infinite; }
.ykr-pop{ animation: ykr-pop .28s cubic-bezier(.16,1,.3,1) both; }
.ykr-shimmer{ background:linear-gradient(90deg,#eef1f5 0px,#f7f8fa 40px,#eef1f5 80px); background-size:600px; animation:ykr-shimmer 1.4s infinite linear; }

.ykr-stamp{
  border:2px dashed rgba(15,23,42,.35);
  border-radius:9999px;
  transform:rotate(-4deg);
}

.ykr-card{
  background:var(--yn-card);
  border:1px solid var(--yn-border);
  border-radius:20px;
  box-shadow:0 1px 2px rgba(15,23,42,.04);
  transition:box-shadow .25s ease, transform .25s ease, border-color .25s ease;
}
.ykr-card-hover:hover{
  box-shadow:0 14px 34px -12px rgba(15,23,42,.18);
  transform:translateY(-3px);
  border-color:rgba(15,23,42,.14);
}

.ykr-btn-primary{
  background:var(--yn-secondary);
  color:#fff;
  border-radius:12px;
  font-weight:600;
  transition:transform .18s ease, box-shadow .18s ease, background .18s ease;
}
.ykr-btn-primary:hover{ transform:translateY(-1px); box-shadow:0 10px 24px -8px rgba(15,23,42,.45); background:#182338; }
.ykr-btn-primary:active{ transform:translateY(0); }
.ykr-btn-primary:disabled{ opacity:.55; cursor:not-allowed; transform:none; box-shadow:none; }

.ykr-btn-accent{
  background:var(--yn-primary);
  color:var(--yn-secondary);
  border-radius:12px;
  font-weight:700;
  transition:transform .18s ease, box-shadow .18s ease, filter .18s ease;
}
.ykr-btn-accent:hover{ transform:translateY(-1px); box-shadow:0 10px 26px -10px rgba(255,213,0,.7); filter:brightness(1.03); }
.ykr-btn-accent:disabled{ opacity:.55; cursor:not-allowed; transform:none; box-shadow:none; }

.ykr-btn-ghost{
  background:transparent; color:var(--yn-secondary); border:1px solid var(--yn-border); border-radius:12px; font-weight:600;
  transition:background .18s ease, border-color .18s ease;
}
.ykr-btn-ghost:hover{ background:#F1F5F9; border-color:rgba(15,23,42,.16); }

.ykr-input{
  width:100%; border:1px solid var(--yn-border); border-radius:12px; background:#fff;
  padding:.75rem .9rem; font-size:.925rem; color:var(--yn-text); transition:border-color .18s ease, box-shadow .18s ease;
}
.ykr-input:focus{ outline:none; border-color:var(--yn-secondary); box-shadow:0 0 0 3px rgba(15,23,42,.08); }
.ykr-input::placeholder{ color:#94A3B8; }

.ykr-scrollbar::-webkit-scrollbar{ width:8px; height:8px; }
.ykr-scrollbar::-webkit-scrollbar-thumb{ background:rgba(15,23,42,.16); border-radius:8px; }

.ykr-focus:focus-visible{ outline:2px solid var(--yn-secondary); outline-offset:2px; }

.ykr-grain{
  background-image:radial-gradient(rgba(255,255,255,.14) 1px, transparent 1px);
  background-size:22px 22px;
}

.ykr-ticket-notch{
  position:relative;
}
.ykr-ticket-notch::before,.ykr-ticket-notch::after{
  content:''; position:absolute; width:18px; height:18px; background:var(--yn-bg);
  border-radius:9999px; top:50%; transform:translateY(-50%);
}
.ykr-ticket-notch::before{ left:-9px; }
.ykr-ticket-notch::after{ right:-9px; }
`;

/* ============================================================
   Helpers
   ============================================================ */

let protoCounter = 4820;
function nextProtocol() {
  protoCounter += 1;
  return `PROT-2026-${String(protoCounter).padStart(6, "0")}`;
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "agora há pouco";
  if (s < 3600) return `há ${Math.floor(s / 60)} min`;
  if (s < 86400) return `há ${Math.floor(s / 3600)} h`;
  return `há ${Math.floor(s / 86400)} d`;
}

async function callClaude(system, userText) {
  // Calls our own serverless function (api/claude.js) instead of the
  // Anthropic API directly, so the API key stays on the server.
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, userText }),
  });
  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || "Falha na chamada da IA (" + response.status + ")");
  }
  const data = await response.json();
  const text = (data.content || [])
    .map((b) => (b.type === "text" ? b.text : ""))
    .filter(Boolean)
    .join("\n");
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const firstBrace = clean.indexOf("{");
  const lastBrace = clean.lastIndexOf("}");
  const jsonSlice = firstBrace >= 0 ? clean.slice(firstBrace, lastBrace + 1) : clean;
  return JSON.parse(jsonSlice);
}

async function saveHistory(entry) {
  const id = "history:" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  const record = { id, ts: Date.now(), favorite: false, ...entry };
  try {
    await storage.set(id, JSON.stringify(record));
  } catch (e) { /* best effort */ }
  return record;
}

/* ============================================================
   Small shared UI atoms
   ============================================================ */

function StampBadge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "text-[var(--yn-secondary)] border-[rgba(15,23,42,.35)]",
    accent: "text-[var(--yn-accent)] border-[rgba(34,197,94,.5)]",
    primary: "text-[var(--yn-primary-ink)] border-[rgba(255,213,0,.8)]",
    danger: "text-[var(--yn-danger)] border-[rgba(239,68,68,.5)]",
  };
  return (
    <span className={`ykr-stamp mono inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold uppercase ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Logo({ size = 34, dark = false }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className="ykr-stamp flex items-center justify-center shrink-0"
        style={{
          width: size, height: size,
          borderColor: dark ? "rgba(255,255,255,.5)" : "rgba(15,23,42,.5)",
        }}
      >
        <span className="mono font-bold" style={{ fontSize: size * 0.34, color: dark ? "#fff" : "var(--yn-secondary)" }}>YKR</span>
      </div>
      <span className={`font-extrabold tracking-tight ${dark ? "text-white" : "text-[var(--yn-secondary)]"}`} style={{ fontSize: size * 0.5 }}>
        YouKnow<span style={{ color: "var(--yn-primary)" }}>Recife</span>
      </span>
    </div>
  );
}

function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <div key={t.id} className="ykr-pop ykr-card flex items-center gap-2 px-4 py-3 shadow-lg" style={{ borderColor: "rgba(15,23,42,.14)" }}>
          {t.type === "success" ? <Check size={16} className="text-[var(--yn-accent)]" /> : <AlertTriangle size={16} className="text-[var(--yn-danger)]" />}
          <span className="text-sm font-medium">{t.msg}</span>
          <button onClick={() => onDismiss(t.id)} className="ml-1 text-slate-400 hover:text-slate-700"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

function Loading({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--yn-secondary)] ykr-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={18} className="text-[var(--yn-primary-ink)]" />
        </div>
      </div>
      <p className="mono text-xs uppercase tracking-wider text-slate-500">{label || "Processando com IA…"}</p>
    </div>
  );
}

/* ============================================================
   LANDING PAGE
   ============================================================ */

function LandingPage({ onEnter }) {
  const [openFaq, setOpenFaq] = useState(0);

  const features = [
    { icon: FileText, title: "Traduzir Leis", desc: "Cole qualquer lei ou documento oficial e receba uma explicação em português simples: o que muda, quem é afetado e quais direitos você tem." },
    { icon: MessageSquareText, title: "Traduzir Notícias", desc: "Entenda o que uma notícia sobre governo realmente significa para a sua vida, sem juridiquês e sem viés." },
    { icon: AlertTriangle, title: "Gerador de Reclamações", desc: "Descreva o problema — vazamento, buraco na rua, falta de luz — e receba uma reclamação formal pronta para enviar." },
    { icon: ClipboardList, title: "Solicitação de Serviços", desc: "Peça poda de árvore, limpeza, reparo de semáforo e mais, em formato de protocolo oficial." },
    { icon: Building2, title: "Localizador de Órgãos", desc: "Descubra automaticamente qual órgão público é responsável, com contato, endereço e horário de atendimento." },
    { icon: ShoppingBag, title: "Direitos do Consumidor", desc: "Tire dúvidas sobre reembolsos, atrasos, produtos com defeito e cobranças indevidas." },
  ];

  const steps = [
    { title: "Descreva sua situação", desc: "Em poucas palavras, no seu jeito de falar — sem termos técnicos." },
    { title: "A IA traduz e organiza", desc: "Você recebe uma explicação clara ou um documento pronto, com o órgão responsável identificado." },
    { title: "Resolva de verdade", desc: "Copie, baixe ou envie diretamente. Acompanhe tudo pelo histórico de protocolos." },
  ];

  const testimonials = [
    { name: "Marcela A.", role: "Moradora, Boa Viagem", quote: "Consegui redigir uma reclamação formal sobre o vazamento na minha rua em menos de dois minutos e o protocolo foi aceito de primeira." },
    { name: "João P.", role: "Comerciante, Casa Amarela", quote: "Nunca tinha entendido de fato uma lei municipal até ler a explicação traduzida. Parece que alguém finalmente traduziu o \"economês\"." },
    { name: "Renata S.", role: "Aposentada, Espinheiro", quote: "Encontrei o órgão certo pra reclamar da poda de árvore sem precisar ligar em cinco lugares diferentes." },
  ];

  const faqs = [
    { q: "O YouKnowRecife substitui um advogado?", a: "Não. A plataforma explica leis e ajuda a redigir documentos, mas não oferece aconselhamento jurídico individual. Para casos complexos, sempre recomendamos um profissional." },
    { q: "Minhas reclamações são enviadas automaticamente?", a: "Não — você recebe o texto pronto e os dados do órgão responsável, mas o envio final é sempre feito por você, no seu e-mail ou canal oficial de preferência." },
    { q: "É gratuito?", a: "O plano básico é gratuito para uso pessoal, com limite mensal de gerações de IA. Planos pagos oferecem uso ilimitado e recursos avançados." },
    { q: "Os dados que eu envio ficam salvos?", a: "Seu histórico de solicitações fica salvo na sua conta para você acompanhar e reutilizar, com total controle para excluir quando quiser." },
  ];

  return (
    <div className="ykr min-h-screen w-full overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-[var(--yn-border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size={30} />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-[var(--yn-secondary)] transition-colors">Ferramentas</a>
            <a href="#how" className="hover:text-[var(--yn-secondary)] transition-colors">Como funciona</a>
            <a href="#faq" className="hover:text-[var(--yn-secondary)] transition-colors">Perguntas</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => onEnter("login")} className="ykr-btn-ghost hidden sm:inline-flex text-sm px-4 py-2">Entrar</button>
            <button onClick={() => onEnter("login")} className="ykr-btn-accent text-sm px-4 py-2">Começar grátis</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full ykr-float-slow" style={{ background: "radial-gradient(circle,var(--yn-primary) 0%, rgba(255,213,0,0) 70%)", opacity: .55 }} />
          <div className="absolute top-40 -left-32 w-80 h-80 rounded-full ykr-float" style={{ background: "radial-gradient(circle,var(--yn-accent) 0%, rgba(34,197,94,0) 70%)", opacity: .18 }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 relative">
          <div className="max-w-2xl ykr-animate-up">
            <div className="inline-flex items-center gap-2 mb-6">
              <StampBadge tone="primary">Recife · Cidadania Digital</StampBadge>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-[var(--yn-secondary)]">
              Entenda seus direitos.<br />
              <span className="relative inline-block">
                Resolva seus problemas.
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 300 10" preserveAspectRatio="none">
                  <path d="M0,7 Q75,0 150,6 T300,4" fill="none" stroke="var(--yn-primary)" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              A plataforma que traduz leis, notícias e burocracia pública para linguagem simples —
              e transforma qualquer reclamação em um protocolo formal, pronto para o órgão certo.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button onClick={() => onEnter("login")} className="ykr-btn-accent px-6 py-3.5 text-[15px] inline-flex items-center gap-2">
                Começar agora <ArrowRight size={17} />
              </button>
              <a href="#how" className="ykr-btn-ghost px-6 py-3.5 text-[15px]">Ver como funciona</a>
            </div>
            <div className="mt-10 flex items-center gap-8">
              {[["48mil+", "cidadãos ajudados"], ["6", "ferramentas de IA"], ["4,9/5", "satisfação"]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-extrabold text-[var(--yn-secondary)]">{n}</div>
                  <div className="text-xs text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating protocol card illustration */}
          <div className="hidden lg:block absolute top-10 right-0 w-[340px] ykr-animate-up" style={{ animationDelay: ".15s" }}>
            <div className="ykr-card ykr-float p-5 relative" style={{ transform: "rotate(3deg)" }}>
              <div className="flex items-center justify-between mb-3">
                <StampBadge tone="accent">Protocolo Gerado</StampBadge>
                <Sparkles size={16} className="text-[var(--yn-primary-ink)]" />
              </div>
              <p className="mono text-[11px] text-slate-400 mb-1">{nextProtocol()}</p>
              <p className="text-sm font-semibold text-[var(--yn-secondary)] mb-1">Reparo de iluminação pública</p>
              <p className="text-xs text-slate-500 leading-relaxed">Órgão responsável: EMLURB · Prazo estimado de resposta: 5 dias úteis.</p>
              <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-2/3 rounded-full" style={{ background: "var(--yn-primary)" }} />
              </div>
            </div>
            <div className="ykr-card p-4 absolute -bottom-10 -left-10 w-56" style={{ transform: "rotate(-6deg)" }}>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className="text-[var(--yn-accent)]" />
                <span className="text-[11px] font-semibold text-slate-500 uppercase mono">Direito identificado</span>
              </div>
              <p className="text-xs text-slate-600">Lei nº 18.267/2016 garante prazo de resposta em até 15 dias.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-xl mb-12">
          <StampBadge tone="neutral">Ferramentas</StampBadge>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--yn-secondary)]">Seis formas de transformar burocracia em clareza</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={f.title} className="ykr-card ykr-card-hover p-6 ykr-animate-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--yn-primary)" }}>
                <f.icon size={20} className="text-[var(--yn-secondary)]" />
              </div>
              <h3 className="font-bold text-[15px] text-[var(--yn-secondary)] mb-1.5">{f.title}</h3>
              <p className="text-[13.5px] text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-[var(--yn-secondary)] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-14">
            <StampBadge tone="primary">Como funciona</StampBadge>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-white">Do problema ao protocolo, em três passos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="mono text-6xl font-bold text-white/10 mb-2">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
                {i < 2 && <div className="hidden md:block absolute top-8 -right-4 w-8 h-px bg-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-xl mb-12">
          <StampBadge tone="neutral">Depoimentos</StampBadge>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--yn-secondary)]">Gente de Recife resolvendo problemas de verdade</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="ykr-card p-6 flex flex-col">
              <Quote size={20} className="text-[var(--yn-primary-ink)] mb-3" />
              <p className="text-sm text-slate-600 leading-relaxed flex-1">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-2">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-[var(--yn-primary)] fill-[var(--yn-primary)]" />)}</div>
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--yn-secondary)]">{t.name}</p>
              <p className="text-xs text-slate-400">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10">
          <StampBadge tone="neutral">Perguntas frequentes</StampBadge>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--yn-secondary)]">Ainda com dúvidas?</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="ykr-card overflow-hidden">
              <button className="w-full flex items-center justify-between px-5 py-4 text-left" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <span className="font-semibold text-sm text-[var(--yn-secondary)]">{f.q}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed ykr-animate-up">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="ykr-card ykr-grain relative overflow-hidden p-12 text-center" style={{ background: "var(--yn-primary)", borderColor: "rgba(15,23,42,.1)" }}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--yn-secondary)] tracking-tight">Pronto para entender seus direitos?</h2>
          <p className="mt-3 text-[var(--yn-primary-ink)]/80 text-sm max-w-md mx-auto">Crie sua conta gratuita e gere seu primeiro protocolo em menos de dois minutos.</p>
          <button onClick={() => onEnter("login")} className="mt-7 ykr-btn-primary px-7 py-3.5 text-[15px] inline-flex items-center gap-2">
            Criar conta grátis <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--yn-border)] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={24} />
          <p className="text-xs text-slate-400 text-center sm:text-right">
            © 2026 YouKnowRecife. Plataforma independente de cidadania digital. Não substitui aconselhamento jurídico.
            <br />
            Desenvolvido por Pedro Henrique S. Frutuoso · henriquecomercial1401@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   LOGIN
   ============================================================ */

const FIREBASE_ERROR_MESSAGES = {
  "auth/invalid-email": "E-mail inválido.",
  "auth/user-not-found": "Não encontramos uma conta com esse e-mail.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/email-already-in-use": "Já existe uma conta com esse e-mail.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/popup-closed-by-user": "Janela do Google fechada antes de concluir.",
  "auth/missing-password": "Digite uma senha.",
};

function friendlyAuthError(err) {
  return FIREBASE_ERROR_MESSAGES[err?.code] || "Não foi possível concluir. Tente novamente.";
}

async function saveUserDoc(user, displayName) {
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: displayName || user.displayName || "",
        email: user.email || "",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (e) { /* não bloqueia o login se o Firestore falhar */ }
}

function LoginPage({ onBack, onLogin }) {
  const [mode, setMode] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit() {
    setError(""); setResetSent(false);
    if (!email.trim() || !pw.trim()) { setError("Preencha e-mail e senha."); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), pw);
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
        await saveUserDoc(cred.user, name.trim());
        onLogin(name.trim() || cred.user.email.split("@")[0]);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), pw);
        await saveUserDoc(cred.user, cred.user.displayName);
        onLogin(cred.user.displayName || cred.user.email.split("@")[0]);
      }
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(""); setResetSent(false);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await saveUserDoc(cred.user, cred.user.displayName);
      onLogin(cred.user.displayName || cred.user.email.split("@")[0]);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError(""); setResetSent(false);
    if (!email.trim()) { setError("Digite seu e-mail acima para receber o link de redefinição."); return; }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (err) {
      setError(friendlyAuthError(err));
    }
  }

  return (
    <div className="ykr min-h-screen w-full flex">
      {/* left brand panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center" style={{ background: "var(--yn-secondary)" }}>
        <div className="absolute inset-0 ykr-grain opacity-[.06]" />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full ykr-float-slow" style={{ background: "radial-gradient(circle,var(--yn-primary),rgba(255,213,0,0) 70%)", opacity: .3 }} />
        <div className="relative z-10 max-w-sm px-10">
          <Logo dark size={30} />
          <h2 className="mt-8 text-3xl font-extrabold text-white leading-tight">Sua ponte com os serviços públicos de Recife.</h2>
          <p className="mt-4 text-white/60 text-sm leading-relaxed">Traduza leis, gere reclamações formais e acompanhe cada protocolo em um só lugar.</p>
          <div className="mt-10 ykr-card p-5 ykr-float" style={{ transform: "rotate(-2deg)" }}>
            <StampBadge tone="accent">Conta verificada</StampBadge>
            <p className="mt-3 text-sm text-slate-600">"Finalmente um jeito simples de lidar com a prefeitura."</p>
          </div>
        </div>
      </div>

      {/* right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={15} /> Voltar
        </button>
        <div className="w-full max-w-sm ykr-animate-up">
          <div className="lg:hidden mb-8"><Logo size={28} /></div>
          <h1 className="text-2xl font-extrabold text-[var(--yn-secondary)]">{mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{mode === "login" ? "Entre para continuar seus protocolos." : "Leva menos de um minuto."}</p>

          <div className="mt-7 backdrop-blur-sm bg-white/60 ykr-card p-6 space-y-4" style={{ boxShadow: "0 20px 50px -20px rgba(15,23,42,.15)" }}>
            <button onClick={handleGoogle} disabled={loading} className="w-full ykr-btn-ghost py-2.5 flex items-center justify-center gap-2 text-sm disabled:opacity-60">
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6 29.6 4 24 4c-7.4 0-13.7 4.2-16.7 10.3z" /><path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5l-6.6-5.4C29.6 35.4 27 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5C9.3 39.7 16.1 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.6 5.4C41.8 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-3.5z" /></svg>
              Continuar com Google
            </button>
            <div className="flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-[11px] text-slate-400 uppercase mono">ou</span><div className="h-px flex-1 bg-slate-200" /></div>

            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Nome completo</label>
                <input className="ykr-input" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">E-mail</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="ykr-input pl-9" style={{ paddingLeft: 36 }} placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-500">Senha</label>
                {mode === "login" && <button onClick={handleForgotPassword} className="text-xs font-medium text-[var(--yn-secondary)] hover:underline">Esqueci a senha</button>}
              </div>
              <div className="relative">
                <input className="ykr-input pr-9" type={showPw ? "text" : "password"} placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
                <button onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-[var(--yn-danger)] flex items-center gap-1.5"><AlertTriangle size={13} /> {error}</p>}
            {resetSent && <p className="text-xs text-[var(--yn-accent)] flex items-center gap-1.5"><Check size={13} /> E-mail de redefinição enviado.</p>}

            <button onClick={handleSubmit} disabled={loading} className="w-full ykr-btn-accent py-2.75 text-sm mt-2 inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 size={15} className="animate-spin" />}
              {mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            {mode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
            <button className="font-semibold text-[var(--yn-secondary)] hover:underline" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Criar agora" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APP SHELL
   ============================================================ */

const NAV_ITEMS = [
  { id: "home", label: "Painel", icon: LayoutDashboard },
  { id: "tools", label: "Ferramentas de IA", icon: Sparkles },
  { id: "history", label: "Histórico", icon: HistoryIcon },
  { id: "profile", label: "Perfil", icon: User },
];

function AppShell({ user, onLogout, children, tab, setTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ykr min-h-screen flex">
      {/* mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 h-screen z-40 w-64 shrink-0 bg-[var(--yn-secondary)] flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <Logo dark size={26} />
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors relative"
                style={{ background: active ? "var(--yn-primary)" : "transparent", color: active ? "var(--yn-secondary)" : "rgba(255,255,255,.7)" }}
              >
                <item.icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "var(--yn-primary)", color: "var(--yn-secondary)" }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-white/40 truncate">Plano gratuito</p>
            </div>
            <button onClick={onLogout} className="text-white/40 hover:text-white transition-colors"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-[var(--yn-border)] flex items-center gap-4 px-5">
          <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="ykr-input pl-9 !py-2 !bg-slate-50" placeholder="Buscar leis, ferramentas, histórico…" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
              <Bell size={17} className="text-slate-500" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: "var(--yn-danger)" }} />
            </button>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8 ykr-scrollbar">{children}</main>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */

function Dashboard({ user, goToTool, recent }) {
  const quick = [
    { id: "laws", icon: FileText, title: "Traduzir uma lei", tone: "primary" },
    { id: "complaint", icon: AlertTriangle, title: "Gerar reclamação", tone: "danger" },
    { id: "agency", icon: Building2, title: "Achar órgão responsável", tone: "accent" },
    { id: "consumer", icon: ShoppingBag, title: "Direitos do consumidor", tone: "neutral" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="ykr-card p-7 relative overflow-hidden" style={{ background: "var(--yn-secondary)" }}>
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full ykr-float-slow" style={{ background: "radial-gradient(circle,var(--yn-primary),rgba(255,213,0,0) 70%)", opacity: .35 }} />
        <div className="relative">
          <StampBadge tone="primary">Painel</StampBadge>
          <h1 className="mt-3 text-2xl font-extrabold text-white">Olá, {user.name.split(" ")[0]} 👋</h1>
          <p className="mt-1 text-white/60 text-sm max-w-md">O que vamos resolver hoje? Escolha uma ferramenta abaixo ou continue de onde parou.</p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Ações rápidas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quick.map((q) => (
            <button key={q.id} onClick={() => goToTool(q.id)} className="ykr-card ykr-card-hover p-5 text-left">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: "var(--yn-primary)" }}>
                <q.icon size={18} className="text-[var(--yn-secondary)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--yn-secondary)]">{q.title}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400">Abrir <ChevronRight size={12} /></span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Atividade recente</h2>
        {recent.length === 0 ? (
          <div className="ykr-card p-10 text-center">
            <ClipboardList size={26} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">Nenhum protocolo ainda. Use uma ferramenta acima para começar.</p>
          </div>
        ) : (
          <div className="ykr-card divide-y divide-[var(--yn-border)]">
            {recent.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F1F5F9" }}>
                  <FileText size={15} className="text-[var(--yn-secondary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--yn-secondary)] truncate">{r.title}</p>
                  <p className="mono text-[11px] text-slate-400">{r.protocol} · {timeAgo(r.ts)}</p>
                </div>
                <StampBadge tone="accent">Concluído</StampBadge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TOOLS HUB + individual tools
   ============================================================ */

const TOOL_META = {
  laws: { title: "Traduzir Leis", icon: FileText, desc: "Cole o texto de uma lei ou documento oficial." },
  news: { title: "Traduzir Notícias", icon: MessageSquareText, desc: "Cole uma notícia sobre governo ou serviços públicos." },
  complaint: { title: "Gerador de Reclamações", icon: AlertTriangle, desc: "Descreva um problema público para gerar uma reclamação formal." },
  agency: { title: "Localizador de Órgãos", icon: Building2, desc: "Descubra o órgão responsável por resolver seu problema." },
  consumer: { title: "Direitos do Consumidor", icon: ShoppingBag, desc: "Tire dúvidas sobre reembolsos, atrasos e cobranças." },
};

function ToolsHub({ activeTool, setActiveTool, pushToast, onSaved }) {
  if (activeTool) {
    return <ToolPanel toolId={activeTool} onBack={() => setActiveTool(null)} pushToast={pushToast} onSaved={onSaved} />;
  }
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[var(--yn-secondary)] mb-1">Ferramentas de IA</h1>
      <p className="text-sm text-slate-500 mb-7">Escolha uma ferramenta para traduzir, gerar ou consultar.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(TOOL_META).map(([id, meta]) => (
          <button key={id} onClick={() => setActiveTool(id)} className="ykr-card ykr-card-hover p-6 text-left flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--yn-primary)" }}>
              <meta.icon size={19} className="text-[var(--yn-secondary)]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--yn-secondary)]">{meta.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{meta.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ eyebrow, children }) {
  return (
    <div className="ykr-card p-6 ykr-animate-up">
      {eyebrow && <StampBadge tone="accent">{eyebrow}</StampBadge>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function CopyButton({ text, pushToast }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); pushToast("Copiado para a área de transferência", "success"); setTimeout(() => setCopied(false), 1500); }}
      className="ykr-btn-ghost text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function ToolPanel({ toolId, onBack, pushToast, onSaved }) {
  const meta = TOOL_META[toolId];
  const [input, setInput] = useState("");
  const [extra, setExtra] = useState({ problemType: "vazamento de água", address: "", urgency: "média" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const problemTypes = [
    { id: "vazamento", label: "Vazamento de água", icon: Droplet },
    { id: "energia", label: "Falta de energia", icon: Zap },
    { id: "iluminacao", label: "Iluminação pública", icon: Sun },
    { id: "lixo", label: "Coleta de lixo", icon: Trash },
    { id: "ruido", label: "Perturbação sonora", icon: Volume2 },
    { id: "via", label: "Buraco / dano na via", icon: Construction },
  ];

  const serviceTypes = [
    { id: "poda", label: "Poda de árvore", icon: TreePine },
    { id: "limpeza", label: "Limpeza de rua", icon: Trash },
    { id: "semaforo", label: "Reparo de semáforo", icon: AlertTriangle },
    { id: "agua", label: "Serviço de água", icon: Droplet },
    { id: "internet", label: "Internet / telecom", icon: Wifi },
    { id: "saude", label: "Serviço de saúde", icon: Stethoscope },
  ];

  async function run() {
    setError(""); setResult(null);
    if (!input.trim()) { setError("Descreva a situação antes de continuar."); return; }
    setLoading(true);
    try {
      let system, user, record;
      if (toolId === "laws") {
        system = `Você é um assistente jurídico que traduz leis e documentos oficiais brasileiros para linguagem simples, em português do Brasil. Responda APENAS com um JSON válido, sem markdown, no formato exato:
{"resumo":"...","oQueAconteceu":"...","oQueSignifica":"...","quemEAfetado":"...","direitos":["...","..."],"exemploPratico":"..."}
Seja claro, objetivo e evite juridiquês. Máximo 3 frases por campo de texto, e no máximo 4 itens em "direitos".`;
        user = input;
        setLoading(true);
        const data = await callClaude(system, user);
        setResult({ type: "laws", data });
        record = await saveHistory({ tool: "laws", title: "Lei traduzida", protocol: nextProtocol(), summary: data.resumo, data });
      } else if (toolId === "news") {
        system = `Você é um assistente que traduz notícias sobre governo e serviços públicos brasileiros para linguagem simples, em português do Brasil. Responda APENAS com um JSON válido no formato exato:
{"resumo":"...","oQueAconteceu":"...","porQueImporta":"...","impactosPossiveis":["...","..."],"acoesDoGoverno":"...","implicacoesPraticas":"..."}
Seja neutro e objetivo. Máximo 3 frases por campo de texto.`;
        user = input;
        const data = await callClaude(system, user);
        setResult({ type: "news", data });
        record = await saveHistory({ tool: "news", title: "Notícia traduzida", protocol: nextProtocol(), summary: data.resumo, data });
      } else if (toolId === "complaint") {
        system = `Você gera reclamações formais para órgãos públicos de Recife, Brasil, em português do Brasil, tom profissional e respeitoso. Responda APENAS com um JSON válido no formato exato:
{"assunto":"...","corpo":"...","nivelUrgencia":"baixa|média|alta","anexosSugeridos":["...","..."],"assinaturaSugerida":"Atenciosamente,\\n[Seu nome]"}
O campo "corpo" deve ser uma reclamação completa e formal, incluindo saudação, descrição do problema, endereço mencionado, e pedido de providência, mas SEM incluir a assinatura final (isso vai em assinaturaSugerida).`;
        user = `Tipo de problema: ${extra.problemType}. Endereço: ${extra.address || "não informado"}. Urgência percebida pelo cidadão: ${extra.urgency}. Descrição do cidadão: ${input}`;
        const data = await callClaude(system, user);
        setResult({ type: "complaint", data });
        record = await saveHistory({ tool: "complaint", title: `Reclamação: ${extra.problemType}`, protocol: nextProtocol(), summary: data.assunto, data });
      } else if (toolId === "agency") {
        system = `Você identifica, com o seu melhor conhecimento, qual órgão público de Recife/Pernambuco, Brasil, provavelmente é responsável por um determinado problema urbano, em português do Brasil. Responda APENAS com um JSON válido no formato exato:
{"orgao":"...","descricaoResponsabilidade":"...","emailEstimado":"...","siteEstimado":"...","telefoneEstimado":"...","horarioEstimado":"...","enderecoEstimado":"...","aviso":"Estes dados são uma estimativa gerada por IA e devem ser confirmados no canal oficial antes do envio."}
Use os órgãos reais de Recife quando souber (ex: EMLURB, Compesa, Neoenergia Pernambuco, CTTU, Secretaria de Saúde do Recife), mas deixe claro no campo "aviso" que os dados de contato são estimativas.`;
        user = input;
        const data = await callClaude(system, user);
        setResult({ type: "agency", data });
        record = await saveHistory({ tool: "agency", title: `Órgão: ${data.orgao}`, protocol: nextProtocol(), summary: data.descricaoResponsabilidade, data });
      } else if (toolId === "consumer") {
        system = `Você é um assistente de direitos do consumidor no Brasil (com base no CDC), respondendo em português do Brasil, de forma simples e prática. Responda APENAS com um JSON válido no formato exato:
{"resumo":"...","seusDireitos":["...","..."],"proximosPassos":["...","..."],"baseLegal":"..."}
Máximo 4 itens em cada lista, frases curtas e práticas.`;
        user = input;
        const data = await callClaude(system, user);
        setResult({ type: "consumer", data });
        record = await saveHistory({ tool: "consumer", title: "Consulta de direitos do consumidor", protocol: nextProtocol(), summary: data.resumo, data });
      }
      if (record) onSaved(record);
      pushToast("Gerado com sucesso", "success");
    } catch (e) {
      setError("Não foi possível gerar a resposta agora. Tente novamente em instantes.");
      pushToast("Erro ao gerar resposta", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
        <ArrowLeft size={15} /> Todas as ferramentas
      </button>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "var(--yn-primary)" }}>
          <meta.icon size={19} className="text-[var(--yn-secondary)]" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[var(--yn-secondary)]">{meta.title}</h1>
          <p className="text-xs text-slate-500">{meta.desc}</p>
        </div>
      </div>

      <div className="ykr-card p-6 space-y-4">
        {toolId === "complaint" && (
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-2 block">Tipo de problema</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {problemTypes.map((p) => (
                <button key={p.id} onClick={() => setExtra((s) => ({ ...s, problemType: p.label }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors ${extra.problemType === p.label ? "border-[var(--yn-secondary)] bg-slate-50" : "border-[var(--yn-border)] hover:bg-slate-50"}`}>
                  <p.icon size={14} /> {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {toolId === "agency" && input === "" && (
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-2 block">Ou escolha um serviço comum</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {serviceTypes.map((p) => (
                <button key={p.id} onClick={() => setInput(`Problema relacionado a: ${p.label}, em um bairro de Recife.`)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--yn-border)] hover:bg-slate-50 text-xs font-medium transition-colors">
                  <p.icon size={14} /> {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {toolId === "complaint" && (
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Endereço (opcional)</label>
            <input className="ykr-input" placeholder="Rua, número, bairro" value={extra.address} onChange={(e) => setExtra((s) => ({ ...s, address: e.target.value }))} />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">
            {toolId === "laws" && "Cole o texto da lei ou documento"}
            {toolId === "news" && "Cole o texto da notícia"}
            {toolId === "complaint" && "Descreva o problema com suas palavras"}
            {toolId === "agency" && "Descreva a situação"}
            {toolId === "consumer" && "Descreva sua dúvida de consumo"}
          </label>
          <textarea rows={6} className="ykr-input resize-none" placeholder="Escreva aqui, do seu jeito…" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>

        {toolId === "complaint" && (
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-2 block">Urgência percebida</label>
            <div className="flex gap-2">
              {["baixa", "média", "alta"].map((u) => (
                <button key={u} onClick={() => setExtra((s) => ({ ...s, urgency: u }))}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border capitalize transition-colors ${extra.urgency === u ? "border-[var(--yn-secondary)] bg-[var(--yn-secondary)] text-white" : "border-[var(--yn-border)] text-slate-500 hover:bg-slate-50"}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-xs text-[var(--yn-danger)] flex items-center gap-1.5"><AlertTriangle size={13} /> {error}</p>}

        <button onClick={run} disabled={loading} className="ykr-btn-accent w-full py-3 text-sm inline-flex items-center justify-center gap-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? "Gerando…" : "Gerar com IA"}
        </button>
      </div>

      <div className="mt-6">
        {loading && <Loading label="Consultando a IA…" />}
        {!loading && result && <ToolResult result={result} pushToast={pushToast} />}
      </div>
    </div>
  );
}

function ToolResult({ result, pushToast }) {
  const { type, data } = result;

  if (type === "laws") {
    return (
      <ResultCard eyebrow="Tradução gerada">
        <h3 className="font-bold text-[var(--yn-secondary)] mb-2">Resumo</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{data.resumo}</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">O que aconteceu</p>
            <p className="text-sm text-slate-600 leading-relaxed">{data.oQueAconteceu}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">O que significa</p>
            <p className="text-sm text-slate-600 leading-relaxed">{data.oQueSignifica}</p>
          </div>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Quem é afetado</p>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{data.quemEAfetado}</p>
        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Seus direitos</p>
        <ul className="space-y-1.5 mb-4">
          {(data.direitos || []).map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600"><ShieldCheck size={14} className="text-[var(--yn-accent)] mt-0.5 shrink-0" /> {d}</li>
          ))}
        </ul>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Exemplo prático</p>
          <p className="text-sm text-slate-600 leading-relaxed">{data.exemploPratico}</p>
        </div>
      </ResultCard>
    );
  }

  if (type === "news") {
    return (
      <ResultCard eyebrow="Tradução gerada">
        <h3 className="font-bold text-[var(--yn-secondary)] mb-2">{data.resumo}</h3>
        <div className="space-y-4 mt-4">
          <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">O que aconteceu</p><p className="text-sm text-slate-600 leading-relaxed">{data.oQueAconteceu}</p></div>
          <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">Por que importa</p><p className="text-sm text-slate-600 leading-relaxed">{data.porQueImporta}</p></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Impactos possíveis</p>
            <ul className="space-y-1.5">{(data.impactosPossiveis || []).map((d, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-600"><ChevronRight size={13} className="mt-0.5 shrink-0 text-slate-400" /> {d}</li>)}</ul>
          </div>
          <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">Implicações práticas</p><p className="text-sm text-slate-600 leading-relaxed">{data.implicacoesPraticas}</p></div>
        </div>
      </ResultCard>
    );
  }

  if (type === "complaint") {
    const fullText = `Assunto: ${data.assunto}\n\n${data.corpo}\n\n${data.assinaturaSugerida || ""}`;
    return (
      <ResultCard eyebrow="Reclamação pronta">
        <div className="flex items-center justify-between mb-4">
          <StampBadge tone={data.nivelUrgencia === "alta" ? "danger" : data.nivelUrgencia === "baixa" ? "accent" : "primary"}>Urgência {data.nivelUrgencia}</StampBadge>
          <CopyButton text={fullText} pushToast={pushToast} />
        </div>
        <div className="ykr-ticket-notch border-t border-dashed border-slate-200 pt-4">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Assunto</p>
          <p className="text-sm font-semibold text-[var(--yn-secondary)] mb-4">{data.assunto}</p>
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Corpo do e-mail</p>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{data.corpo}</p>
          <p className="text-sm text-slate-600 whitespace-pre-line mt-3">{data.assinaturaSugerida}</p>
        </div>
        {data.anexosSugeridos && data.anexosSugeridos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Anexos sugeridos</p>
            <div className="flex flex-wrap gap-2">{data.anexosSugeridos.map((a, i) => <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{a}</span>)}</div>
          </div>
        )}
      </ResultCard>
    );
  }

  if (type === "agency") {
    return (
      <ResultCard eyebrow="Órgão identificado">
        <h3 className="font-bold text-lg text-[var(--yn-secondary)] mb-1">{data.orgao}</h3>
        <p className="text-sm text-slate-500 mb-5">{data.descricaoResponsabilidade}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-3"><Mail size={15} className="text-slate-400 shrink-0" /><span className="text-sm text-slate-600 truncate">{data.emailEstimado}</span></div>
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-3"><ExternalLink size={15} className="text-slate-400 shrink-0" /><span className="text-sm text-slate-600 truncate">{data.siteEstimado}</span></div>
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-3"><Phone size={15} className="text-slate-400 shrink-0" /><span className="text-sm text-slate-600 truncate">{data.telefoneEstimado}</span></div>
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-3"><Clock size={15} className="text-slate-400 shrink-0" /><span className="text-sm text-slate-600 truncate">{data.horarioEstimado}</span></div>
          <div className="sm:col-span-2 flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-3"><MapPin size={15} className="text-slate-400 shrink-0" /><span className="text-sm text-slate-600 truncate">{data.enderecoEstimado}</span></div>
        </div>
        <div className="mt-4 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl px-3.5 py-3">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {data.aviso}
        </div>
      </ResultCard>
    );
  }

  if (type === "consumer") {
    return (
      <ResultCard eyebrow="Orientação gerada">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{data.resumo}</p>
        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Seus direitos</p>
        <ul className="space-y-1.5 mb-4">{(data.seusDireitos || []).map((d, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-600"><ShieldCheck size={14} className="text-[var(--yn-accent)] mt-0.5 shrink-0" /> {d}</li>)}</ul>
        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Próximos passos</p>
        <ul className="space-y-1.5 mb-4">{(data.proximosPassos || []).map((d, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-600"><ChevronRight size={13} className="mt-0.5 shrink-0 text-slate-400" /> {d}</li>)}</ul>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Base legal</p>
          <p className="text-sm text-slate-600 leading-relaxed">{data.baseLegal}</p>
        </div>
      </ResultCard>
    );
  }

  return null;
}

/* ============================================================
   HISTORY
   ============================================================ */

function HistoryTab({ records, loading, onDelete, onToggleFav }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? records : filter === "fav" ? records.filter((r) => r.favorite) : records.filter((r) => r.tool === filter);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[var(--yn-secondary)] mb-1">Histórico</h1>
      <p className="text-sm text-slate-500 mb-6">Todos os seus protocolos e consultas geradas.</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {[["all", "Todos"], ["fav", "Favoritos"], ["laws", "Leis"], ["news", "Notícias"], ["complaint", "Reclamações"], ["agency", "Órgãos"], ["consumer", "Consumidor"]].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === id ? "border-[var(--yn-secondary)] bg-[var(--yn-secondary)] text-white" : "border-[var(--yn-border)] text-slate-500 hover:bg-slate-50"}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="ykr-card h-20 ykr-shimmer" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="ykr-card p-10 text-center">
          <HistoryIcon size={26} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">Nada por aqui ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="ykr-card p-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#F1F5F9" }}>
                {React.createElement(TOOL_META[r.tool]?.icon || FileText, { size: 15, className: "text-[var(--yn-secondary)]" })}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-[var(--yn-secondary)]">{r.title}</p>
                  <span className="mono text-[10px] text-slate-400">{r.protocol}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.summary}</p>
                <p className="text-[11px] text-slate-400 mt-1.5">{timeAgo(r.ts)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => onToggleFav(r)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
                  <Star size={15} className={r.favorite ? "text-[var(--yn-primary-ink)] fill-[var(--yn-primary)]" : "text-slate-300"} />
                </button>
                <button onClick={() => onDelete(r)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                  <Trash2 size={15} className="text-slate-300 hover:text-[var(--yn-danger)]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PROFILE
   ============================================================ */

function ProfileTab({ user }) {
  const [dark, setDark] = useState(false);
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[var(--yn-secondary)] mb-1">Perfil</h1>
      <p className="text-sm text-slate-500 mb-6">Gerencie sua conta e preferências.</p>

      <div className="ykr-card p-6 flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg" style={{ background: "var(--yn-primary)", color: "var(--yn-secondary)" }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-[var(--yn-secondary)]">{user.name}</p>
          <StampBadge tone="accent">Conta gratuita</StampBadge>
        </div>
      </div>

      <div className="ykr-card divide-y divide-[var(--yn-border)]">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            {dark ? <Moon size={17} className="text-slate-500" /> : <Sun size={17} className="text-slate-500" />}
            <div><p className="text-sm font-semibold text-[var(--yn-secondary)]">Modo escuro</p><p className="text-xs text-slate-400">Ajuste o tema da interface</p></div>
          </div>
          <button onClick={() => setDark((d) => !d)} className="w-11 h-6 rounded-full relative transition-colors" style={{ background: dark ? "var(--yn-secondary)" : "#E2E8F0" }}>
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: dark ? "translateX(22px)" : "translateX(2px)" }} />
          </button>
        </div>
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck size={17} className="text-slate-500" />
            <div><p className="text-sm font-semibold text-[var(--yn-secondary)]">Segurança da conta</p><p className="text-xs text-slate-400">Senha e verificação em duas etapas</p></div>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </div>
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <Bell size={17} className="text-slate-500" />
            <div><p className="text-sm font-semibold text-[var(--yn-secondary)]">Notificações</p><p className="text-xs text-slate-400">Alertas sobre seus protocolos</p></div>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </div>
      </div>
      {dark && <p className="mt-3 text-xs text-slate-400">Prévia do modo escuro chega em breve — hoje só a preferência é salva.</p>}

      <div className="ykr-card p-5 mt-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Créditos</p>
        <p className="text-sm font-semibold text-[var(--yn-secondary)]">Pedro Henrique S. Frutuoso</p>
        <p className="text-sm text-slate-500">henriquecomercial1401@gmail.com</p>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */

export default function App() {
  const [view, setView] = useState("landing"); // landing | login | app
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [activeTool, setActiveTool] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [records, setRecords] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Fonte da verdade da sessão: escuta o Firebase Auth diretamente, então
  // um F5 na página mantém o usuário logado (ou deslogado) corretamente.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          name: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Cidadão"),
          email: fbUser.email,
          uid: fbUser.uid,
        });
        setView((v) => (v === "login" || v === "landing" ? "app" : v));
      } else {
        setUser(null);
        setView((v) => (v === "app" ? "landing" : v));
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const pushToast = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const list = await storage.list("history:");
      const keys = (list && list.keys) || [];
      const items = [];
      for (const k of keys) {
        try {
          const res = await storage.get(k);
          if (res) items.push(JSON.parse(res.value));
        } catch (e) { /* skip broken entry */ }
      }
      items.sort((a, b) => b.ts - a.ts);
      setRecords(items);
    } catch (e) { /* storage unavailable */ }
    setHistoryLoading(false);
  }, []);

  useEffect(() => { if (view === "app") loadHistory(); }, [view, loadHistory]);

  function handleLogin(name) {
    // O estado de usuário/tela é atualizado pelo listener do Firebase Auth
    // acima; aqui só cuidamos do resto da navegação e do aviso.
    setTab("home");
    pushToast(`Bem-vindo, ${name}!`, "success");
  }

  async function handleLogout() {
    try { await signOut(auth); } catch (e) {}
    setTab("home");
    setActiveTool(null);
  }

  function goToTool(id) {
    setTab("tools");
    setActiveTool(id);
  }

  async function handleDelete(record) {
    try { await storage.delete(record.id); } catch (e) {}
    setRecords((rs) => rs.filter((r) => r.id !== record.id));
    pushToast("Removido do histórico", "success");
  }

  async function handleToggleFav(record) {
    const updated = { ...record, favorite: !record.favorite };
    try { await storage.set(record.id, JSON.stringify(updated)); } catch (e) {}
    setRecords((rs) => rs.map((r) => (r.id === record.id ? updated : r)));
  }

  function handleSaved(record) {
    setRecords((rs) => [record, ...rs]);
  }

  if (!authReady) {
    return (
      <div className="ykr min-h-screen flex items-center justify-center">
        <style>{GLOBAL_CSS}</style>
        <Loader2 size={26} className="animate-spin text-[var(--yn-secondary)]" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <style>{GLOBAL_CSS}</style>

      {view === "landing" && <LandingPage onEnter={setView} />}
      {view === "login" && <LoginPage onBack={() => setView("landing")} onLogin={handleLogin} />}

      {view === "app" && user && (
        <AppShell user={user} onLogout={handleLogout} tab={tab} setTab={(t) => { setTab(t); if (t !== "tools") setActiveTool(null); }}>
          {tab === "home" && <Dashboard user={user} goToTool={goToTool} recent={records} />}
          {tab === "tools" && <ToolsHub activeTool={activeTool} setActiveTool={setActiveTool} pushToast={pushToast} onSaved={handleSaved} />}
          {tab === "history" && <HistoryTab records={records} loading={historyLoading} onDelete={handleDelete} onToggleFav={handleToggleFav} />}
          {tab === "profile" && <ProfileTab user={user} />}
        </AppShell>
      )}

      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}
