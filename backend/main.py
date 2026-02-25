"""
EVE Frontier × Sui Fleet Analytics Backend
FastAPI service querying Sui blockchain via JSON-RPC
"""

import os
import asyncio
from typing import Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

SUI_RPC_URL = os.getenv("SUI_RPC_URL", "https://fullnode.mainnet.sui.io")
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

app = FastAPI(
    title="EVE Frontier × Sui Fleet Analytics",
    description="On-chain fleet analytics dashboard for EVE Frontier using Sui blockchain data",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Sui JSON-RPC helpers
# ---------------------------------------------------------------------------

async def sui_rpc(method: str, params: list[Any]) -> Any:
    """Call Sui JSON-RPC and return the result field."""
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params,
    }
    async with httpx.AsyncClient(timeout=30) as client:
        try:
            resp = await client.post(SUI_RPC_URL, json=payload)
            resp.raise_for_status()
            data = resp.json()
            if "error" in data:
                raise HTTPException(status_code=400, detail=data["error"])
            return data.get("result")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"Sui RPC error: {e}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Sui RPC unreachable: {e}")


def classify_object(obj: dict) -> str:
    """Classify a Sui object as ship, module, resource, or unknown."""
    obj_type = obj.get("type", "")
    name_lower = obj.get("name", "").lower()
    desc_lower = obj.get("description", "").lower()

    # Heuristic classification based on type/name patterns
    if any(k in obj_type.lower() for k in ["ship", "vessel", "fleet"]):
        return "ship"
    if any(k in obj_type.lower() for k in ["module", "weapon", "armor", "shield"]):
        return "module"
    if any(k in obj_type.lower() for k in ["resource", "ore", "mineral", "fuel"]):
        return "resource"
    if any(k in name_lower for k in ["ship", "frigate", "cruiser", "destroyer", "carrier"]):
        return "ship"
    if any(k in name_lower for k in ["module", "weapon", "turret", "launcher"]):
        return "module"
    if any(k in name_lower for k in ["ore", "mineral", "resource", "fuel", "tritanium"]):
        return "resource"
    return "unknown"


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    return {
        "service": "EVE Frontier × Sui Fleet Analytics",
        "version": "1.0.0",
        "endpoints": ["/assets/{wallet}", "/fleet/{wallet}", "/transactions/{wallet}", "/health"],
    }


@app.get("/health")
async def health():
    return {"status": "ok", "rpc": SUI_RPC_URL}


@app.get("/assets/{wallet}")
async def get_assets(wallet: str):
    """
    Return all Sui objects owned by a wallet address.
    Includes SUI balance + NFT/object inventory.
    """
    # Fetch balance and objects in parallel
    balance_task = sui_rpc("suix_getBalance", [wallet, "0x2::sui::SUI"])
    objects_task = sui_rpc(
        "suix_getOwnedObjects",
        [
            wallet,
            {
                "options": {
                    "showType": True,
                    "showContent": True,
                    "showDisplay": True,
                }
            },
            None,
            50,
        ],
    )

    balance_result, objects_result = await asyncio.gather(balance_task, objects_task)

    # Parse balance
    total_balance_mist = int(balance_result.get("totalBalance", 0)) if balance_result else 0
    sui_balance = total_balance_mist / 1_000_000_000  # Convert MIST → SUI

    # Parse objects
    objects = []
    if objects_result and "data" in objects_result:
        for item in objects_result["data"]:
            obj_data = item.get("data", {})
            display = obj_data.get("display", {}).get("data", {}) or {}
            obj = {
                "objectId": obj_data.get("objectId"),
                "type": obj_data.get("type", ""),
                "name": display.get("name", ""),
                "description": display.get("description", ""),
                "imageUrl": display.get("image_url", ""),
                "version": obj_data.get("version"),
                "digest": obj_data.get("digest"),
            }
            obj["category"] = classify_object(obj)
            objects.append(obj)

    return {
        "wallet": wallet,
        "sui_balance": sui_balance,
        "sui_balance_mist": total_balance_mist,
        "total_objects": len(objects),
        "objects": objects,
    }


@app.get("/fleet/{wallet}")
async def get_fleet(wallet: str):
    """
    Return fleet analytics for a wallet — ships, modules, resources,
    aggregated stats, and category breakdown for charting.
    """
    assets = await get_assets(wallet)
    objects = assets["objects"]

    # Categorize
    ships = [o for o in objects if o["category"] == "ship"]
    modules = [o for o in objects if o["category"] == "module"]
    resources = [o for o in objects if o["category"] == "resource"]
    unknown = [o for o in objects if o["category"] == "unknown"]

    # Type frequency map (for charts)
    type_counts: dict[str, int] = {}
    for obj in objects:
        t = obj["type"].split("::")[-1] if "::" in obj["type"] else obj["type"] or "Unknown"
        type_counts[t] = type_counts.get(t, 0) + 1

    # Top types for chart
    top_types = sorted(type_counts.items(), key=lambda x: x[1], reverse=True)[:10]

    return {
        "wallet": wallet,
        "sui_balance": assets["sui_balance"],
        "fleet_summary": {
            "total_assets": len(objects),
            "ships": len(ships),
            "modules": len(modules),
            "resources": len(resources),
            "other": len(unknown),
        },
        "category_breakdown": [
            {"category": "Ships", "count": len(ships)},
            {"category": "Modules", "count": len(modules)},
            {"category": "Resources", "count": len(resources)},
            {"category": "Other", "count": len(unknown)},
        ],
        "top_asset_types": [{"type": t, "count": c} for t, c in top_types],
        "ships": ships,
        "modules": modules,
        "resources": resources,
        "other": unknown,
    }


@app.get("/transactions/{wallet}")
async def get_transactions(wallet: str, limit: int = 20):
    """
    Return recent transaction history for a wallet.
    """
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
    if result and "data" in result:
        for tx in result["data"]:
            digest = tx.get("digest")
            timestamp = tx.get("timestampMs")
            effects = tx.get("effects", {})
            status = effects.get("status", {}).get("status", "unknown")

            # Gas cost
            gas_used = effects.get("gasUsed", {})
            gas_total = (
                int(gas_used.get("computationCost", 0))
                + int(gas_used.get("storageCost", 0))
                - int(gas_used.get("storageRebate", 0))
            )

            txs.append({
                "digest": digest,
                "timestamp_ms": timestamp,
                "status": status,
                "gas_cost_mist": gas_total,
                "gas_cost_sui": gas_total / 1_000_000_000,
            })

    return {
        "wallet": wallet,
        "transaction_count": len(txs),
        "transactions": txs,
    }
