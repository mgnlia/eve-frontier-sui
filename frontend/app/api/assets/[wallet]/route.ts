import { NextResponse } from 'next/server'
import { fetchAssets } from '../../sui-utils'

export async function GET(
  _req: Request,
  { params }: { params: { wallet: string } }
) {
  try {
    const data = await fetchAssets(params.wallet)
    return NextResponse.json(data)
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    )
  }
}
