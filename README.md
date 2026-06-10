# AI Capital Flow Observatory

> Where is AI capital flowing? A Bloomberg / PitchBook / Palantir–inspired terminal for mapping the movement of capital across the global AI ecosystem (2024 → present).

The AI economy is represented as a **living network**: nodes are entities (investors, foundation-model labs, infrastructure, compute, energy, robotics, agent infra, enterprise AI, governments) and edges are **capital flows**. The app lets you see at a glance who is funding whom, where money is concentrating, which sectors have momentum, and where bottlenecks are forming.

dark, glassmorphism, network-driven UI

---

## Features

The app is a **single screen**: one live capital network of the entire AI economy, with an on-click intelligence panel — no multi-page navigation.

- **Capital Network** — Interactive graph (React Flow / `@xyflow/react`) of every entity, laid out with a **d3-force simulation** (sector clustering + collision resolution so nodes never overlap). Nodes show **real company logos**, are sized by capital weight, colored by sector, with animated capital-flow edges, search, sector filtering, zoom, drag, and a minimap.
- **Copilot intelligence panel** — Click any node to open an AI-briefing-style panel with auto-generated summary, key stats, and tabs for **Overview**, **Investments / Portfolio**, and **all Capital Flows** (a unified in/out ledger). Every counterparty is clickable to jump across the network.
- **Market Pulse** — A drawer with auto-ranked **What's Hot** signals (fastest sector, largest round, most influential investor, bottlenecks…), funding-by-sector, and sector momentum.
- **Logos** — Clearbit logos with a Google-favicon fallback and colored-initials fallback; governments use country flags.
- **Analytics engine** — Funding by sector & geography, capital concentration (HHI), investor influence (graph PageRank centrality), infra & energy spending, capital efficiency, growth velocity, and sector momentum (Recharts).
- **Modular ETL** — A source-agnostic ingestion pipeline that normalizes everything into a single domain model, with a Supabase persistence layer.
- **Premium UI** — Dark theme, glassmorphism, Framer Motion animations, fully responsive.

## Tech Stack


| Layer              | Choice                                               |
| ------------------ | ---------------------------------------------------- |
| Framework          | Next.js 16 (App Router) · React 19 · TypeScript      |
| Styling            | Tailwind CSS v4 · custom glassmorphism design system |
| UI primitives      | shadcn-style components (`src/components/ui`)        |
| Graph              | `@xyflow/react` (React Flow)                         |
| Sankey / viz       | `d3-sankey`, `d3-shape`                              |
| Charts             | Recharts                                             |
| Animation          | Framer Motion                                        |
| Backend (optional) | Supabase (Postgres)                                  |
| Icons              | lucide-react                                         |


> Note: the prompt called for Next.js 15; `create-next-app@latest` installs Next 16, which is API-compatible for everything used here. Pin to 15 in `package.json` if required.

## Getting Started

```bash
npm install
npm run seed     # generate the JSON seed dataset (already committed)
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build && npm start
```

## Scripts


| Script                         | Description                                                            |
| ------------------------------ | ---------------------------------------------------------------------- |
| `npm run dev`                  | Start the dev server                                                   |
| `npm run build` / `npm start`  | Production build / serve                                               |
| `npm run seed`                 | Regenerate the deterministic mock dataset → `src/lib/data/seed/*.json` |
| `npm run ingest`               | Run the full ETL pipeline → JSON seed                                  |
| `npm run ingest -- --supabase` | Run ETL and upsert into Supabase                                       |
| `npm run lint`                 | ESLint                                                                 |


## Architecture

```
src/
  app/
    page.tsx                # the single dashboard screen
    layout.tsx              # full-bleed shell
  components/
    dashboard/              # header + graph + Market Pulse drawer
    graph/                  # React Flow network, node w/ logos, edge, copilot panel
    charts/                 # Recharts wrappers
    insights/ ui/           # What's Hot cards, design-system primitives
  lib/
    types.ts                # the canonical domain model
    sectors.ts              # sector metadata + colors
    data/
      curated.ts            # ~70 research-informed real entities
      generate.ts           # deterministic generator (100+ entities, 300+ flows)
      logos.ts              # domain → logo / flag resolution
      seed/*.json           # committed seed dataset (what the app loads)
      index.ts              # typed data-access layer + indices
      detail.ts             # per-entity detail + capital-movement ledger
    metrics/                # analytics, graph (d3-force) layout, insights/trends
    etl/                    # modular ingestion pipeline + source connectors
    supabase/               # client + dataset sync
supabase/schema.sql         # Postgres schema mirroring the domain model
scripts/                    # seed + ingest entrypoints
```

### Data model

Everything derives from three normalized records in `src/lib/types.ts`:

- **Entity** — investor / company / government with funding, valuation, revenue, users, geography.
- **FundingRound** — a financing closed by a company, with investors.
- **CapitalFlow** — a directed dollar flow (`investment`, `grant`, `partnership`, `compute-deal`, `supply`, `energy-contract`). The graph and Sankey are both projections of these.

### Metrics

Implemented in `src/lib/metrics/analytics.ts`:

- **Herfindahl-Hirschman Index (HHI)** — capital concentration over sector / investor shares.
- **Investor centrality** — amount-weighted **PageRank** over the directed flow graph.
- **Capital efficiency** — funding ÷ revenue, ÷ users, ÷ enterprise customers.
- **Growth velocity** — capital deployed over time (monthly + cumulative).
- **Sector momentum** — trailing-6-month inflow vs the prior 6 months.

Trend detection + auto-insights live in `src/lib/metrics/insights.ts`.

## Connecting Live Funding APIs

The app is built so that **swapping mock data for live data requires no UI changes** — every view depends only on the typed accessors in `src/lib/data/index.ts`, which are populated by the ETL pipeline output.

### 1. The ingestion contract

Every source implements `IngestionSource` (`src/lib/etl/types.ts`):

```ts
interface IngestionSource {
  id: string;
  label: string;
  live: boolean;
  fetch(ctx: IngestionContext): Promise<IngestionResult>; // { entities, rounds, flows }
}
```

Connectors normalize their vendor payloads into the domain model (helpers in `src/lib/etl/normalize.ts`: `normalizeSector`, `normalizeRegion`, `parseUsd`, `slugifyId`, plus dedupers). The pipeline (`src/lib/etl/pipeline.ts`) runs every **live** source, merges, dedupes, and emits one dataset.

### 2. Implement a source

Connectors are stubbed and ready (see `src/lib/etl/sources/`):


| Source                 | File                | What to implement                                                                                                                    |
| ---------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Crunchbase             | `crunchbase.ts`     | `mapOrganization` / `mapFundingRound` are already written — wire `fetch` to the Crunchbase Enterprise API with `CRUNCHBASE_API_KEY`. |
| SEC EDGAR              | `sec.ts`            | Pull XBRL financials & 8-K strategic stakes for public infra/energy.                                                                 |
| OECD / Government      | `oecd.ts`           | Sovereign AI programs → `government` entities + `grant`/`partnership` flows.                                                         |
| NVIDIA IR / Datacenter | `infrastructure.ts` | Supply deals & buildouts → `supply` / `compute-deal` flows.                                                                          |
| Energy providers       | `infrastructure.ts` | PPAs / datacenter power → `energy-contract` flows.                                                                                   |
| Press / CB Insights    | `infrastructure.ts` | NLP over newswires for early financings.                                                                                             |


Example — flip Crunchbase live:

```ts
export const crunchbaseSource: IngestionSource = {
  id: "crunchbase",
  label: "Crunchbase",
  live: true, // ← was false
  async fetch({ apiKey, since, limit }) {
    const orgs = await fetchCrunchbaseOrgs({ apiKey, since, limit });
    const rounds = await fetchCrunchbaseRounds({ apiKey, since, limit });
    return {
      entities: orgs.map(mapOrganization),
      rounds: rounds.map(mapFundingRound),
      flows: rounds.flatMap(roundToFlows), // investor → company per round
    };
  },
};
```

### 3. Run it

```bash
npm run ingest                 # writes src/lib/data/seed/*.json (the app reads these)
npm run ingest -- --supabase   # upserts into Supabase instead
```

### 4. Persist with Supabase (optional)

1. Create a Supabase project and run `[supabase/schema.sql](supabase/schema.sql)`.
2. Set the env vars (see `.env.example`):
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (read)
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side writes)
3. `npm run ingest -- --supabase` to load, then point `src/lib/data/index.ts` at `loadDataset()` from `src/lib/supabase/sync.ts` to read live.

Without env vars, the app transparently falls back to the committed JSON seed.

## Data Disclaimer

The seed dataset is **research-informed but synthetic** — generated deterministically for visualization. Figures are approximations and **not investment advice**. Connect the live sources above for production data.

## License

MIT