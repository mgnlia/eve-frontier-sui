"""
EVE Frontier x Sui Fleet Analytics - Backend API
Uses real Sui JSON-RPC - NO mock/seeded data
"""
import os
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

SUI_RPC_URL = os.getenv("SUI_RPC_URL", "https://fullnode.mainnet.sui.io")

app = FastAPI(
    title="EVE Frontier x Sui Fleet Analytics",
    description="Real-time Sui blockchain analytics for EVE Frontier fleet assets",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)


async def sui_rpc(method: str, params: list):
    async with httpx.AsyncClient(timeout=25) as client:
        r = await client.post(
            SUI_RPC_URL,
            json={"jsonrpc": "2.0", "id": 1, "method": method, "params": params},
        )
        r.raise_for_status()
        data = r.json()
        if "error" in data:
            raise HTTPException(400, detail=str(data["error"]))
        return data.get("result")


def classify(obj_type: str, name: str) -> str:
    t, n = obj_type.lower(), name.lower()
    if any(k in t for k in ["ship", "vessel", "fleet"]) or any(
        k in n for k in ["ship", "frigate", "cruiser", "destroyer"]
    ):
        return "ship"
    if any(k in t for k in ["module", "weapon", "armor", "shield"]) or any(
        k in n for k in ["module", "weapon", "turret"]
    ):
        return "module"
    if any(k in t for k in ["resource", "ore", "mineral", "fuel"]) or any(
        k in n for k in ["ore", "mineral", "fuel"]
    ):
        return "resource"
    return "unknown"


@app.get("/")
def root():
    return {
        "service": "EVE Frontier x Sui Fleet Analytics",
        "version": "1.0.0",
        "rpc": SUI_RPC_URL,
        "data": "live Sui mainnet",
        "endpoints": ["/health", "/assets/{wallet}", "/fleet/{wallet}", "/transactions/{wallet}"],
    }


@app.get("/health")
def health():
    return {"status": "ok", "rpc": SUI_RPC_URL}


@app.get("/assets/{wallet}")
async def get_assets(wallet: str):
    bal, objs = await asyncio.gather(
        sui_rpc("suix_getBalance", [wallet, "0x2::sui::SUI"]),
        sui_rpc(
            "suix_getOwnedObjects",
            [wallet, {"options": {"showType": True, "showContent": True, "showDisplay": True}}, None, 50],
        ),
    )
    mist = int((bal or {}).get("totalBalance", "0"))
    objects = []
    for item in (objs or {}).get("data", []):
        d = item.get("data", {})
        disp = (d.get("display") or {}).get("data") or {}
        o = {
            "objectId": d.get("objectId"),
            "type": d.get("type", ""),
            "name": disp.get("name", ""),
            "description": disp.get("description", ""),
            "imageUrl": disp.get("image_url", ""),
            "version": d.get("version"),
            "digest": d.get("digest"),
        }
        o["category"] = classify(o["type"], o["name"])
        objects.append(o)
    return {
        "wallet": wallet,
        "sui_balance": mist / 1e9,
        "sui_balance_mist": mist,
        "total_objects": len(objects),
        "objects": objects,
    }


@app.get("/fleet/{wallet}")
async def get_fleet(wallet: str):
    a = await get_assets(wallet)
    objs = a["objects"]
    ships = [o for o in objs if o["category"] == "ship"]
    modules = [o for o in objs if o["category"] == "module"]
    resources = [o for o in objs if o["category"] == "resource"]
    other = [o for o in objs if o["category"] == "unknown"]
    tc: dict = {}
    for o in objs:
        t = o["type"].split("::")[-1] if "::" in o["type"] else o["type"] or "Unknown"
        tc[t] = tc.get(t, 0) + 1
    top = sorted(tc.items(), key=lambda x: x[1], reverse=True)[:10]
    return {
        "wallet": wallet,
        "sui_balance": a["sui_balance"],
        "fleet_summary": {
            "total_assets": len(objs),
            "ships": len(ships),
            "modules": len(modules),
            "resources": len(resources),
            "other": len(other),
        },
        "category_breakdown": [
            {"category": "Ships", "count": len(ships)},
            {"category": "Modules", "count": len(modules)},
            {"category": "Resources", "count": len(resources)},
            {"category": "Other", "count": len(other)},
        ],
        "top_asset_types": [{"type": t, "count": c} for t, c in top],
        "ships": ships,
        "modules": modules,
        "resources": resources,
        "other": other,
    }


@app.get("/transactions/{wallet}")
async def get_transactions(wallet: str, limit: int = 20):
    result = await sui_rpc(
        "suix_queryTransactionBlocks",
        [
            {"filter": {"FromAddress": wallet}, "options": {"showInput": True, "showEffects": True}},
            None,
            min(limit, 50),
            True,
        ],
    )
    txs = []
    for tx in (result or {}).get("data", []):
        gas = (tx.get("effects") or {}).get("gasUsed", {})
        cost = (
            int(gas.get("computationCost", 0))
            + int(gas.get("storageCost", 0))
            - int(gas.get("storageRebate", 0))
        )
        txs.append({
            "digest": tx.get("digest"),
            "timestamp_ms": tx.get("timestampMs"),
            "status": (tx.get("effects") or {}).get("status", {}).get("status", "unknown"),
            "gas_cost_mist": cost,
            "gas_cost_sui": cost / 1e9,
        })
    return {"wallet": wallet, "transaction_count": len(txs), "transactions": txs}
