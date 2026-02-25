import { NextResponse } from 'next/server'
import { fetchAssets, SuiObject } from '../../sui-utils'

export async function GET(_req: Request, { params }: { params: { wallet: string } }) {
  try {
    const assets = await fetchAssets(params.wallet)
    const objects = assets.objects

    const ships = objects.filter((o: SuiObject) => o.category === 'ship')
    const modules = objects.filter((o: SuiObject) => o.category === 'module')
    const resources = objects.filter((o: SuiObject) => o.category === 'resource')
    const other = objects.filter((o: SuiObject) => o.category === 'unknown')

    const typeCounts: Record<string, number> = {}
    for (const obj of objects) {
      const t = obj.type.includes('::') ? obj.type.split('::').pop()! : obj.type || 'Unknown'
      typeCounts[t] = (typeCounts[t] ?? 0) + 1
    }
    const topTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }))

    return NextResponse.json({
      wallet: params.wallet,
      sui_balance: assets.sui_balance,
      fleet_summary: {
        total_assets: objects.length,
        ships: ships.length,
        modules: modules.length,
        resources: resources.length,
        other: other.length,
      },
      category_breakdown: [
        { category: 'Ships', count: ships.length },
        { category: 'Modules', count: modules.length },
        { category: 'Resources', count: resources.length },
        { category: 'Other', count: other.length },
      ],
      top_asset_types: topTypes,
      ships,
      modules,
      resources,
      other,
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
