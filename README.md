# EVE Frontier × Sui Fleet Analytics Dashboard

> **EVE Frontier × Sui Hackathon 2026 Entry** — On-chain fleet analytics for EVE Frontier using the Sui blockchain.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://eve-frontier-sui.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-purple?logo=railway)](https://eve-frontier-sui-backend.up.railway.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## Overview

An external analytics dashboard that queries the **Sui Mainnet JSON-RPC** to provide real-time fleet intelligence for EVE Frontier players. No complex on-chain smart contracts needed — pure analytics power.

### Features

- 🔍 **Wallet Scanner** — Look up any Sui wallet address
- 🚀 **Fleet Composition** — Ships, modules, resources categorized via heuristics
- 📊 **Visual Analytics** — Pie charts, bar charts, area charts via Recharts
- ⛓️ **Transaction History** — Full tx log with gas cost timeline
- 🎨 **EVE-themed UI** — Dark sci-fi aesthetic with glow effects

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   Next.js Frontend  │────▶│  FastAPI Backend      │────▶│  Sui Mainnet    │
│   (Vercel)          │     │  (Railway)            │     │  JSON-RPC       │
└─────────────────────┘     └──────────────────────┘     └─────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Charts | Recharts |
| Backend | Python, FastAPI, httpx |
| Package Manager | uv (Python) |
| Blockchain | Sui Mainnet JSON-RPC |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /assets/{wallet}` | All Sui objects + SUI balance |
| `GET /fleet/{wallet}` | Fleet analytics with category breakdown |
| `GET /transactions/{wallet}` | Recent transaction history |
| `GET /health` | Health check |

## Local Development

### Backend

```bash
cd backend
pip install uv
uv pip install --system fastapi uvicorn httpx pydantic python-dotenv
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

## Deployment

### Backend → Railway

```bash
cd backend
railway up
```

### Frontend → Vercel

```bash
cd frontend
vercel --prod
```

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

### Backend
```
SUI_RPC_URL=https://fullnode.mainnet.sui.io  # default
PORT=8000
```

## Hackathon

- **Event**: EVE Frontier × Sui Hackathon 2026
- **Track**: External Analytics Dashboard
- **Prize Pool**: $80,000
- **Deadline**: March 31, 2026

## License

MIT
