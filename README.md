# EVE Frontier × Sui Fleet Analytics Dashboard

**Hackathon:** EVE Frontier × Sui Hackathon 2026  
**Track:** External Analytics Dashboard  
**Canonical Repo:** https://github.com/mgnlia/eve-frontier-sui

## ✅ Live Demo

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://eve-frontier-sui.vercel.app | ✅ Live |
| **API Health** | https://eve-frontier-sui.vercel.app/api/health | ✅ Live |
| **Assets API** | https://eve-frontier-sui.vercel.app/api/assets/{wallet} | ✅ Live |
| **Fleet API** | https://eve-frontier-sui.vercel.app/api/fleet/{wallet} | ✅ Live |
| **Transactions API** | https://eve-frontier-sui.vercel.app/api/transactions/{wallet} | ✅ Live |

## Architecture

**Single Next.js 14 app** deployed on Vercel handles both frontend UI and API:

```
frontend/
├── app/
│   ├── page.tsx                    # Dashboard UI
│   └── api/
│       ├── health/route.ts         # Health check
│       ├── sui-utils.ts            # Sui RPC helpers
│       ├── assets/[wallet]/route.ts     # Wallet asset inventory
│       ├── fleet/[wallet]/route.ts      # Fleet analytics breakdown
│       └── transactions/[wallet]/route.ts # Transaction history
└── components/                     # React dashboard components
```

**Backend (Railway-deployable):** `backend/main.py` — FastAPI service, same Sui RPC logic.

## Real Blockchain Data

**No mock data.** All data is fetched live from **Sui Mainnet** via JSON-RPC:
- `suix_getBalance` — SUI token balance
- `suix_getOwnedObjects` — NFT/object inventory with display metadata
- `suix_queryTransactionBlocks` — Transaction history with gas costs

Endpoint: `https://fullnode.mainnet.sui.io`

## Features

- 🔍 **Wallet Lookup** — enter any Sui address (0x...)
- 📊 **Fleet Analytics** — asset breakdown by category (Ships, Modules, Resources)
- 📈 **Charts** — pie chart (category distribution) + bar chart (top asset types)
- 💳 **Asset Table** — paginated object inventory with Sui Explorer links
- 📉 **Transaction History** — gas cost area chart + recent tx list
- ⚡ **Real-time** — live Sui mainnet data, no caching

## Tech Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Recharts** for data visualizations
- **Sui JSON-RPC API** — direct fetch calls to Sui mainnet
- **Vercel** deployment (frontend + API routes)
- **Python/FastAPI** (backend/, deployable to Railway)

## Local Development

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

## Test Wallet

Try any active Sui wallet. Example:
```
0x0000000000000000000000000000000000000000000000000000000000000001
```
