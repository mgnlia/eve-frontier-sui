import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    rpc: 'https://fullnode.mainnet.sui.io',
    service: 'EVE Frontier × Sui Fleet Analytics',
    version: '1.0.0',
  })
}
