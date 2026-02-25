import { NextResponse } from 'next/server'

// EVE Frontier World API - live game data from nursery environment
const EVE_WORLD_API = 'https://blockchain-gateway-nova.nursery.rnd.games'

// Fetch data from EVE Frontier World API
async function fetchEveWorldData(path: string) {
  const url = `${EVE_WORLD_API}${path}`
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
    next: { revalidate: 60 }, // cache 60s
  })
  if (!res.ok) throw new Error(`EVE World API ${res.status}: ${res.statusText}`)
  return res.json()
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const endpoint = url.searchParams.get('endpoint') ?? 'types'

  try {
    let data: unknown
    switch (endpoint) {
      case 'types':
        data = await fetchEveWorldData('/api/types?limit=20')
        break
      case 'killmails':
        data = await fetchEveWorldData('/api/killmails?limit=10')
        break
      case 'smart-assemblies':
        data = await fetchEveWorldData('/api/smart-assemblies?limit=10')
        break
      default:
        data = await fetchEveWorldData(`/api/${endpoint}`)
    }
    return NextResponse.json({ source: 'eve-frontier-world-api', endpoint, data })
  } catch (e: unknown) {
    // Return graceful fallback — EVE World API may not always be available
    return NextResponse.json(
      {
        source: 'eve-frontier-world-api',
        endpoint,
        error: e instanceof Error ? e.message : String(e),
        note: 'EVE Frontier World API may be in maintenance. Sui on-chain data is always available.',
        data: null,
      },
      { status: 200 } // don't fail the dashboard
    )
  }
}
