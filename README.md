# Professional DNA Anti-Portfolio 🚀

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com) [![Status](https://img.shields.io/badge/Status-Phase%206%20Complete-brightgreen)](PROJECT_STATUS.md)

## 🧬 Descrizione progetto
Professional DNA e' un anti-portfolio AI-native che racconta le persone come sistemi complessi invece che come liste di skill. L'interfaccia raccoglie CV, progetti, filosofia di lavoro e firma Big Five per generare - tramite Claude Sonnet 4 - una narrazione radicalmente onesta composta da Genome Overview, Chromosome Map, Mutation Timeline e sezioni focalizzate sull'impatto reale. L'obiettivo e' offrire ai talent team uno strumento affidabile per valutare compatibilita', trade-off e contesti ideali prima ancora del primo colloquio.

## ✨ Features principali
- Landing page con hero, galleria esempi, feature grid e "How it works".
- Form a 4 tab (CV, Projects, Philosophy, Big Five) con validazioni e storage locale.
- API route `app/api/generate/route.ts` per orchestrare le chiamate a Claude Sonnet 4.
- Portfolio viewer `/portfolio/[id]` con stato di caricamento/errore, pulsante download e layout a 6 sezioni.
- Tre dataset di esempio completi (`developer`, `designer`, `pm`) per demo offline.
- DNA metaphor system con Compatibility Matrix, Gene Expression e Unique Sequence.

## ⚡ Quick start guide

### Prerequisiti
- Node.js 20+
- npm (o pnpm/bun/yarn) installato globalmente
- Chiave `ANTHROPIC_API_KEY` salvata in `.env.local`

### Installazione
```bash
npm install
```

### Uso
```bash
npm run dev
# Naviga su http://localhost:3000
# /create  -> compila il form
# /portfolio/[id] -> visualizza o condividi l'anti-portfolio
```

Per build di produzione:
```bash
npm run build && npm run start
```

## 📚 Example portfolios
- [Developer](http://localhost:3000/portfolio/developer)
- [Product Designer](http://localhost:3000/portfolio/designer)
- [Product Manager](http://localhost:3000/portfolio/pm)

> Suggerimento: apri prima il JSON corrispondente in `data/examples/` per capire struttura e nomenclatura.

## 🧱 Tech stack
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **AI**: Claude Sonnet 4 (Anthropic API)
- **State/Storage**: Browser `localStorage`, URL params per shareability
- **Deployment target**: Vercel

## 🏁 Hackathon deliverables checklist
- [x] ✅ Phase 5 portfolio sections complete (6 DNA componenti)
- [x] ✅ Landing page + navigazione interna
- [x] ✅ Tre JSON di esempio + rendering verificato
- [x] ✅ FRAMEWORK.md (documentazione architettura)
- [ ] ⏳ README finale + video demo per submission
- [ ] ⏳ Deploy pubblico su Vercel
- [ ] ⏳ Analytics / error boundaries opzionali

Stato dettagliato e prossimo sprint in `PROJECT_STATUS.md`.

## 📄 License
MIT License - aggiungere il file `LICENSE` se non e' ancora presente nel repository.
