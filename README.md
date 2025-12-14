# Professional DNA Anti-Portfolio 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com) [![Status](https://img.shields.io/badge/Status-Phase%206.5%20Complete-brightgreen)](PROJECT_STATUS.md)

## 🧬 Descrizione progetto
Professional DNA e' un anti-portfolio AI-native che racconta le persone come sistemi complessi invece che come liste di skill. L'interfaccia raccoglie CV, progetti, filosofia di lavoro e firma Big Five per generare - tramite Claude Sonnet 4 - una narrazione radicalmente onesta composta da Genome Overview, Chromosome Map, Mutation Timeline e sezioni focalizzate sull'impatto reale. L'obiettivo e' offrire ai talent team uno strumento affidabile per valutare compatibilita', trade-off e contesti ideali prima ancora del primo colloquio.

## ✨ Features principali
- Landing page con hero, galleria esempi, feature grid e "How it works".
- Form a 4 tab (CV, Projects, Philosophy, Big Five) con validazioni e storage locale.
- API route `app/api/generate/route.ts` per orchestrare le chiamate a Claude Sonnet 4.
- Portfolio viewer `/portfolio/[id]` con stato di caricamento/errore, pulsante download e layout a 6 sezioni (export HTML standalone con CSS inline).
- Tre dataset di esempio completi (`developer`, `designer`, `pm`) per demo offline.
- DNA metaphor system con Compatibility Matrix, Gene Expression e Unique Sequence.

## ⚡ Quick start guide

### Prerequisiti
- **Node.js 20+** - [Scarica qui](https://nodejs.org/)
- **npm** (incluso con Node.js) o alternative: pnpm, yarn, bun
- **Anthropic API Key** - [Ottienila qui](https://console.anthropic.com/)

### Installazione

1. **Clona il repository**
```bash
git clone <repository-url>
cd professional-dna-portfolio
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Configura l'API key**

Crea un file `.env.local` nella root del progetto:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
```

> ⚠️ **Importante**: Il file `.env.local` è già incluso nel `.gitignore` per proteggere la tua API key. Non committare mai questo file!

4. **Avvia il server di sviluppo**
```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

### Come usare l'applicazione

#### 1. Esplora gli esempi (opzionale)
Visita la home page e clicca su uno dei 3 portfolio di esempio per vedere il formato finale:
- `/portfolio/developer` - Backend engineer con bassa Extraversion
- `/portfolio/designer` - UX designer con alta Openness
- `/portfolio/pm` - Product manager con profilo bilanciato

#### 2. Genera il tuo anti-portfolio
1. Vai su `/create` o clicca "Create Your DNA" dalla home
2. Compila i **4 tab**:
   - **CV**: Incolla il tuo CV o background professionale (min 200 caratteri)
   - **Projects**: Aggiungi link GitHub/Portfolio e descrivi 1-3 case study
   - **Philosophy**: Rispondi alle 5 domande sulla tua filosofia di lavoro (obbligatorio)
   - **Big Five**: Completa il questionario di 25 domande sulla personalità (obbligatorio)
3. Clicca **"Generate Portfolio"**
4. Attendi 20-40 secondi mentre Claude analizza i tuoi dati
5. Verrai reindirizzato al tuo portfolio unico su `/portfolio/[id]`

#### 3. Condividi e scarica
- **Condividi**: Copia l'URL `/portfolio/[id]` - il portfolio è salvato nel localStorage del browser
- **Download**: Clicca il pulsante "Download Portfolio" nell'header per scaricare un file HTML standalone con CSS inline (funziona offline)

### Build di produzione
```bash
npm run build
npm run start
```

### Comandi disponibili
```bash
npm run dev          # Avvia development server (localhost:3000)
npm run build        # Build ottimizzato per produzione
npm run start        # Avvia production server
npm run lint         # ESLint check
```

## 📚 Example portfolios
- [Developer](http://localhost:3000/portfolio/developer) - Backend engineer, Low Extraversion (32), High Conscientiousness (88)
- [Product Designer](http://localhost:3000/portfolio/designer) - UX designer, High Openness (87), High Extraversion (83)
- [Product Manager](http://localhost:3000/portfolio/pm) - Product manager, Balanced profile across all dimensions

> 💡 **Suggerimento**: Apri i JSON corrispondenti in `public/examples/` per studiare la struttura del output generato da Claude.

## 🏗️ Architettura e flusso dati

```
┌─────────────────┐
│  User Input     │
│  (4 tabs form)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Big Five Scoring               │
│  lib/bigfive-scorer.ts          │
│  • 0-100 normalization          │
│  • Reverse items handling       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Response Quality Validation    │
│  lib/bigfive-validator.ts       │
│  • Straight-lining detection    │
│  • Acquiescence bias check      │
│  • Confidence score (H/M/L)     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Claude API Generation          │
│  app/api/generate/route.ts      │
│  • 140+ lines interpretation    │
│  • Trait→Behavior mapping       │
│  • Evidence-based narrative     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  ProfessionalDNA JSON           │
│  types/portfolio.ts             │
│  • 6 sections structure         │
│  • Metadata + confidence        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Portfolio Rendering            │
│  components/sections/*.tsx      │
│  • Section1: Genome Overview    │
│  • Section2: Chromosome Map     │
│  • Section3: Mutation Timeline  │
│  • Section4: Gene Expression    │
│  • Section5: Unique Sequence    │
│  • Section6: DNA Compatibility  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  localStorage + URL Sharing     │
│  lib/storage.ts                 │
└─────────────────────────────────┘
```

### File chiave
- `types/portfolio.ts` - Tutte le interfacce TypeScript
- `lib/claude.ts` - Prompt engineering + API client
- `lib/bigfive-scorer.ts` - Calcolo OCEAN scores
- `lib/bigfive-validator.ts` - Validazione qualità risposte
- `app/create/page.tsx` - Form principale
- `app/api/generate/route.ts` - Endpoint generazione
- `app/portfolio/[id]/page.tsx` - Viewer del portfolio

Vedi `PROJECT_STATUS.md` per architettura dettagliata e `FRAMEWORK.md` per principi di design.

## 🐛 Troubleshooting

### L'API key non funziona
```bash
# Verifica che il file .env.local esista nella root
ls -la .env.local

# Il contenuto deve essere esattamente:
ANTHROPIC_API_KEY=sk-ant-api03-...

# Riavvia il server dopo aver modificato .env.local
npm run dev
```

### Errore "Failed to generate portfolio"
- Controlla che l'API key sia valida su [console.anthropic.com](https://console.anthropic.com/)
- Verifica di aver compilato tutti i campi obbligatori (Philosophy e Big Five)
- Controlla la console del browser per errori dettagliati
- Prova a ridurre la lunghezza del CV se è molto lungo (>10000 caratteri)

### Il portfolio non si carica dopo la generazione
- Controlla che il localStorage non sia disabilitato nel browser
- Apri DevTools → Application → Local Storage → `dna-portfolios`
- Se il portfolio è lì ma non si carica, prova a cancellare la cache del browser

### Build errors su Windows
Se riscontri problemi con i path su Windows, usa PowerShell o Git Bash invece di CMD.

### Rate limiting Anthropic API
L'API di Anthropic ha limiti di rate. Se generi molti portfolio rapidamente, potresti ricevere errori 429. Attendi qualche minuto prima di riprovare.

## 📖 Documentazione aggiuntiva

- **[FRAMEWORK.md](FRAMEWORK.md)** - Filosofia dell'anti-portfolio, principi di design, visione AI-native
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Stato del progetto, fasi completate, architettura tecnica
- **Big Five Model** - [Wikipedia](https://en.wikipedia.org/wiki/Big_Five_personality_traits)

## 🧱 Tech stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: Tailwind CSS 4 + shadcn/ui
- **AI**: Claude Sonnet 4 (Anthropic API)
- **State/Storage**: Browser `localStorage`, URL params per shareability
- **Deployment target**: Vercel

## 🚀 Deploy su Vercel

### Deploy automatico (raccomandato)

1. **Push su GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connetti a Vercel**
- Vai su [vercel.com](https://vercel.com)
- Clicca "Add New Project"
- Importa il repository GitHub
- Vercel rileva automaticamente Next.js

3. **Configura Environment Variables**
Nel dashboard Vercel → Settings → Environment Variables:
```
ANTHROPIC_API_KEY = sk-ant-api03-YOUR_KEY_HERE
```

4. **Deploy**
- Clicca "Deploy"
- Attendi 2-3 minuti
- Ricevi l'URL pubblico (es. `your-app.vercel.app`)

### Deploy da CLI

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (segui le istruzioni)
vercel

# Per production deploy
vercel --prod
```

### Dopo il deploy
- Testa tutti i 3 esempi: `/portfolio/developer`, `/portfolio/designer`, `/portfolio/pm`
- Genera un nuovo portfolio per verificare l'API key
- Condividi l'URL pubblico nella submission dell'hackathon

## 🏁 Hackathon deliverables checklist

### 1️⃣ Portfolio Generator Tool
- [x] ✅ Input handling: CV, Projects, Philosophy, Big Five
- [x] ✅ AI generation con Claude Sonnet 4
- [x] ✅ Output: Portfolio web personalizzato in formato DNA metaphor
- [x] ✅ GitHub repository con README completo
- [x] ✅ Tool funzionante (non solo concept)

### 2️⃣ Tre Portfolio Esempio
- [x] ✅ Developer (Low E:32, High C:88)
- [x] ✅ Designer (High O:87, High E:83)
- [x] ✅ PM (Balanced profile)
- [x] ✅ Formato web/HTML
- [ ] ⏳ **Link pubblici** (richiede deploy Vercel)

### 3️⃣ Framework Document
- [x] ✅ [FRAMEWORK.md](FRAMEWORK.md) completo
- [x] ✅ Assunti base (portfolio tradizionali vs anti-portfolio)
- [x] ✅ Pattern e domande (4 input layers)
- [x] ✅ Principi di design (4 principi core)
- [x] ✅ 7 elementi distintivi (DNA metaphor, Big Five, Mutations, Prose-only, Compatibility, Unique Sequence, Gene Expression)
- [x] ✅ Visione AI-native (Claude editor, iterative portfolio, future ecosystem)

Stato dettagliato in [PROJECT_STATUS.md](PROJECT_STATUS.md).

## 📄 Licenza e Copyright

**Copyright © 2025 Flavio Neirotti. All Rights Reserved.**

Questo software e la documentazione associata sono proprietà esclusiva del titolare del copyright. Nessuna parte di questo software può essere utilizzata, copiata, modificata, fusa, pubblicata, distribuita, sublicenziata, venduta o altrimenti sfruttata per qualsiasi scopo, commerciale o non commerciale, senza il permesso scritto esplicito del titolare del copyright.

Per informazioni complete sulla licenza, consulta il file [LICENSE](LICENSE).

### Restrizioni d'uso
- ❌ **Uso commerciale**: Non consentito
- ❌ **Uso non commerciale**: Non consentito
- ❌ **Modifica e distribuzione**: Non consentite
- ✅ **Visualizzazione del codice**: Consentita solo per scopi di valutazione dell'hackathon

### Contatti
Per richieste di licenza o permessi speciali, contatta il titolare del copyright.



