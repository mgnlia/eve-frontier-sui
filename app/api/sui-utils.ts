const SUI_RPC = 'https://fullnode.mainnet.sui.io'

export async function suiRpc(method: string, params: unknown[]): Promise<unknown> {
  const res = await fetch(SUI_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(25000),
  })
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))
  return data.result
}

export function classifyObject(type: string, name: string): string {
  const t = type.toLowerCase()
  const n = name.toLowerCase()
  if (/ship|vessel|fleet/.test(t) || /ship|frigate|cruiser|destroyer|carrier/.test(n)) return 'ship'
  if (/module|weapon|armor|shield/.test(t) || /module|weapon|turret|launcher/.test(n)) return 'module'
  if (/resource|ore|mineral|fuel/.test(t) || /ore|mineral|resource|fuel|tritanium/.test(n)) return 'resource'
  return 'unknown'
}

export interface SuiObject {
  objectId: string | undefined
  type: string
  name: string
  description: string
  imageUrl: string
  version: string | undefined
  digest: string | undefined
  category: string
}

export async function fetchAssets(wallet: string): Promise<{
  wallet: string
  sui_balance: number
  sui_balance_mist: number
  total_objects: number
  objects: SuiObject[]
}> {
  const [balanceResult, objectsResult] = await Promise.all([
    suiRpc('suix_getBalance', [wallet, '0x2::sui::SUI']),
    suiRpc('suix_getOwnedObjects', [
      wallet,
      { options: { showType: true, showContent: true, showDisplay: true } },
      null,
      50,
    ]),
  ]) as [
    { totalBalance?: string } | null,
    { data?: Array<{ data: { objectId?: string; type?: string; version?: string; digest?: string; display?: { data?: { name?: string; description?: string; image_url?: string } } } }> } | null
  ]

  const totalMist = parseInt(balanceResult?.totalBalance ?? '0', 10)
  const suiBalance = totalMist / 1_000_000_000

  const objects: SuiObject[] = ((objectsResult as { data?: Array<{ data: { objectId?: string; type?: string; version?: string; digest?: string; display?: { data?: { name?: string; description?: string; image_url?: string } } } }> })?.data ?? []).map((item) => {
    const d = item.data ?? {}
    const display = d.display?.data ?? {}
    const obj: SuiObject = {
      objectId: d.objectId,
      type: d.type ?? '',
      name: display.name ?? '',
      description: display.description ?? '',
      imageUrl: display.image_url ?? '',
      version: d.version,
      digest: d.digest,
      category: '',
    }
    obj.category = classifyObject(obj.type, obj.name)
    return obj
  })

  return { wallet, sui_balance: suiBalance, sui_balance_mist: totalMist, total_objects: objects.length, objects }
}
