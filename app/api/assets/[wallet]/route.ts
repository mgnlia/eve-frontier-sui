import { NextResponse } from 'next/server'
import { fetchAssets } from '../../sui-utils'

export async function GET(_req: Request, { params }: { params: { wallet: string } }) {
  try {
    const data = await fetchAssets(params.wallet)
    return NextResponse.json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
