# Source Directory Note

This project uses **Next.js 14 App Router** — source files live in `../app/` and `../components/`, not in `src/`.

## Directory Structure

```
frontend/
├── app/                    ← Next.js App Router pages & API routes (equivalent to src/)
│   ├── page.tsx            ← Main dashboard page (App.tsx equivalent)
│   ├── layout.tsx          ← Root layout
│   ├── globals.css         ← Global styles
│   └── api/
│       ├── health/         ← GET /api/health
│       ├── assets/[wallet] ← GET /api/assets/:wallet  (Sui RPC)
│       ├── fleet/[wallet]  ← GET /api/fleet/:wallet   (Sui RPC + analytics)
│       ├── transactions/[wallet] ← GET /api/transactions/:wallet
│       ├── eve-world/      ← GET /api/eve-world       (EVE Frontier World API)
│       └── sui-utils.ts    ← Sui JSON-RPC helpers
└── components/             ← React components
    ├── FleetDashboard.tsx  ← Main fleet analytics dashboard
    ├── AssetTable.tsx      ← Paginated asset table
    ├── CategoryChart.tsx   ← Pie chart (recharts)
    ├── AssetTypeChart.tsx  ← Bar chart (recharts)
    ├── TransactionHistory.tsx ← Area chart + tx list (recharts)
    ├── EveWorldPanel.tsx   ← EVE Frontier World API integration
    ├── FleetSummaryCards.tsx ← Summary stat cards
    ├── Header.tsx          ← App header
    ├── HeroStats.tsx       ← Hero stats bar
    └── WalletSearch.tsx    ← Wallet address input
```

## Live URL

https://eve-frontier-sui.vercel.app
