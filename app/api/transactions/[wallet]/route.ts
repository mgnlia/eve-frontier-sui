import { NextResponse } from 'next/server'
import { suiRpc } from '../../sui-utils'

export async function GET(req: Request, { params }: { params: { wallet: string } }) {
  const url = new URL(req.url)
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20', 10), 50)

  try {
    const result = await suiRpc('suix_queryTransactionBlocks', [
      { filter: { FromAddress: params.wallet }, options: { showInput: true, showEffects: true } },
      null,
      limit,
      true,
    ]) as { data?: Array<{ digest?: string; timestampMs?: string; effects?: { status?: { status?: string }; gasUsed?: { computationCost?: string; storageCost?: string; storageRebate?: string } }> } } | null

    const txs = (result?.data ?? []).map((tx) => {
      const gas = tx.effects?.gasUsed ?? {}
      const gasCost = (
        parseInt(gas.computationCost ?? '0', 10) +
        parseInt(gas.storageCost ?? '0', 10) -
        parseInt(gas.storageRebate ?? '0', 10)
      )
      return {
        digest: tx.digest,
        timestamp_ms: tx.timestampMs,
        status: tx.effects?.status?.status ?? 'unknown',
        gas_cost_mist: gasCost,
        gas_cost_sui: gasCost / 1_000_000_000,
      }
    })

    return NextResponse.json({ wallet: params.wallet, transaction_count: txs.length, transactions: txs })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
