# YouKnowRecife

> "Entenda seus direitos. Resolva seus problemas."

Protótipo funcional de uma plataforma de cidadania digital com IA: traduz leis e
notícias para linguagem simples, gera reclamações formais e identifica o órgão
público responsável em Recife.

## O que este projeto é (e o que não é)

Este é um **front-end React completo e funcional**, com 5 ferramentas de IA
reais (chamam a API da Anthropic de verdade) e histórico persistido no
navegador. Ele **não inclui**: autenticação real de usuários, banco de dados
multiusuário, painel administrativo, nem envio automático de e-mails para
órgãos públicos. Veja "Próximos passos" no fim deste arquivo para o que falta
para virar um produto completo.

## Stack

- React 18 + Vite
- Tailwind CSS
- lucide-react (ícones)
- Uma função serverless (`api/claude.js`) para chamar a IA sem expor sua chave
  de API no navegador
- Histórico salvo em `localStorage` (por navegador/dispositivo)

## Rodando localmente

```bash
npm install
npm run dev
```

A interface abre em `http://localhost:5173`. As telas de landing page, login
(mock) e navegação funcionam imediatamente. Para as ferramentas de IA
funcionarem localmente, você precisa rodar a função serverless também — veja
abaixo.

### Ativando as ferramentas de IA localmente

`api/claude.js` é uma função no formato Vercel. Duas opções:

**Opção A — Vercel CLI (recomendado)**
```bash
npm install -g vercel
vercel dev
```
Isso serve o front-end e a função `/api/claude` juntos. Configure a variável
de ambiente antes:
```bash
cp .env.example .env
# edite .env e cole sua chave da Anthropic (console.anthropic.com)
```

**Opção B — apenas o front-end**
Rodando só com `npm run dev`, as telas funcionam normalmente, mas os botões
"Gerar com IA" vão falhar (não há servidor respondendo em `/api/claude`).
Isso é esperado.

## Publicando no GitHub

```bash
git init
git add .
git commit -m "Primeiro commit: protótipo YouKnowRecife"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/youknowrecife.git
git push -u origin main
```

## Deploy (Vercel)

1. Importe o repositório em [vercel.com/new](https://vercel.com/new)
2. Em **Settings → Environment Variables**, adicione `ANTHROPIC_API_KEY` com
   sua chave real
3. Deploy — o Vercel detecta o Vite automaticamente e publica `api/claude.js`
   como função serverless

Sem esse passo 2, as ferramentas de IA carregam mas retornam erro ao gerar.

## Estrutura

```
├── api/claude.js         # proxy serverless para a API da Anthropic
├── src/
│   ├── App.jsx            # toda a aplicação (landing, login, dashboard, ferramentas, histórico, perfil)
│   ├── storage.js         # wrapper de histórico sobre localStorage
│   ├── main.jsx
│   └── index.css
├── index.html
└── vite.config.js
```

## Próximos passos para virar produto real

- Autenticação real (ex.: Supabase Auth) no lugar do login simulado
- Banco de dados multiusuário para histórico (ex.: Supabase Postgres) no
  lugar do `localStorage`
- Painel administrativo (usuários, uso de IA, relatórios)
- Confirmação humana antes de qualquer envio automático a órgãos públicos —
  os dados de contato gerados pela IA são estimativas e devem ser validados
- Testes automatizados e monitoramento de erros em produção
