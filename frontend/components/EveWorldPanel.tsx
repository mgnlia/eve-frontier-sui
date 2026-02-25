'use client'
import { useState, useEffect } from 'react'

interface KillmailEntry {
  id?: string
  killmailId?: number
  timestamp?: string
  victimName?: string
  shipName?: string
  totalValue?: number
  solarSystemName?: string
}

interface TypeEntry {
  typeId?: number
  name?: string
  groupId?: number
  volume?: number
}

type EveWorldData = KillmailEntry[] | TypeEntry[] | Record<string, unknown>

export function EveWorldPanel() {
  const [killData, setKillData] = useState<KillmailEntry[] | null>(null)
  const [typeData, setTypeData] = useState<TypeEntry[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [eveError, setEveError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      fetch('/api/eve-world?endpoint=killmails').then(r => r.json()),
      fetch('/api/eve-world?endpoint=types').then(r => r.json()),
    ]).then(([killResult, typeResult]) => {
      if (killResult.status === 'fulfilled') {
        const d = killResult.value as { data?: EveWorldData; error?: string }
        if (d.error) setEveError(d.error)
        else if (Array.isArray(d.data)) setKillData(d.data as KillmailEntry[])
      }
      if (typeResult.status === 'fulfilled') {
        const d = typeResult.value as { data?: EveWorldData }
        if (Array.isArray(d.data)) setTypeData(d.data as TypeEntry[])
      }
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="eve-panel p-6 text-center">
      <p className="text-eve-blue text-xs animate-pulse tracking-widest">CONNECTING TO EVE FRONTIER WORLD API...</p>
    </div>
  )

  if (eveError || (!killData && !typeData)) return (
    <div className="eve-panel p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-eve-gold animate-pulse" />
        <span className="text-eve-gold text-xs font-bold tracking-widest">EVE FRONTIER WORLD API</span>
        <span className="ml-auto text-xs text-eve-text/40">nursery.rnd.games</span>
      </div>
      <p className="text-eve-text/60 text-xs">
        {eveError
          ? `World API offline: ${eveError.slice(0, 120)}`
          : 'World API returned no data — may be in maintenance.'}
      </p>
      <p className="text-eve-text/40 text-xs mt-1">Sui on-chain data above is always live.</p>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Recent Killmails */}
      {killData && killData.length > 0 && (
        <div className="eve-panel">
          <div className="eve-panel-header">
            <span className="text-eve-red text-xs">☠</span>
            <span className="text-eve-red text-xs font-bold tracking-widest">RECENT KILLMAILS — EVE FRONTIER WORLD</span>
            <span className="ml-auto text-xs text-eve-text/40">live</span>
          </div>
          <div className="divide-y divide-eve-border">
            {killData.slice(0, 5).map((k, i) => (
              <div key={k.id ?? k.killmailId ?? i} className="px-4 py-3 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-eve-red">☠</span>
                  <span className="text-white">{k.victimName ?? 'Unknown Pilot'}</span>
                  <span className="text-eve-text/50">lost</span>
                  <span className="text-eve-text">{k.shipName ?? 'Unknown Ship'}</span>
                </div>
                <div className="flex items-center gap-3 text-eve-text/50 flex-shrink-0">
                  {k.solarSystemName && <span>{k.solarSystemName}</span>}
                  {k.totalValue && (
                    <span className="text-eve-gold">{(k.totalValue / 1e6).toFixed(1)}M ISK</span>
                  )}
                  {k.timestamp && (
                    <span>{new Date(k.timestamp).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ship/Type Registry */}
      {typeData && typeData.length > 0 && (
        <div className="eve-panel">
          <div className="eve-panel-header">
            <span className="text-eve-blue text-xs">◈</span>
            <span className="text-eve-blue text-xs font-bold tracking-widest">SHIP TYPE REGISTRY — EVE FRONTIER WORLD</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-eve-border">
                  <th className="text-left px-4 py-2 text-eve-text/50 font-normal">TYPE ID</th>
                  <th className="text-left px-4 py-2 text-eve-text/50 font-normal">NAME</th>
                  <th className="text-left px-4 py-2 text-eve-text/50 font-normal hidden md:table-cell">GROUP</th>
                  <th className="text-left px-4 py-2 text-eve-text/50 font-normal hidden lg:table-cell">VOLUME (m³)</th>
                </tr>
              </thead>
              <tbody>
                {typeData.slice(0, 8).map((t, i) => (
                  <tr key={t.typeId ?? i} className="border-b border-eve-border/40 hover:bg-eve-blue/5">
                    <td className="px-4 py-2.5 font-mono text-eve-text/60">{t.typeId ?? '—'}</td>
                    <td className="px-4 py-2.5 text-white">{t.name ?? '—'}</td>
                    <td className="px-4 py-2.5 text-eve-text/60 hidden md:table-cell">{t.groupId ?? '—'}</td>
                    <td className="px-4 py-2.5 text-eve-text/50 hidden lg:table-cell">{t.volume?.toFixed(1) ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
