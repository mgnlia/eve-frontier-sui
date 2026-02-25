'use client'

interface FleetData {
  sui_balance: number
  fleet_summary: {
    total_assets: number
    ships: number
    modules: number
    resources: number
    other: number
  }
}

const cards = [
  { key: 'sui_balance', label: 'SUI BALANCE', icon: '◎', color: 'text-eve-gold', format: (v: number) => v.toFixed(4) + ' SUI' },
  { key: 'total_assets', label: 'TOTAL ASSETS', icon: '◈', color: 'text-eve-blue', format: (v: number) => v.toString() },
  { key: 'ships', label: 'SHIPS', icon: '🚀', color: 'text-eve-green', format: (v: number) => v.toString() },
  { key: 'modules', label: 'MODULES', icon: '⚙️', color: 'text-eve-blue', format: (v: number) => v.toString() },
  { key: 'resources', label: 'RESOURCES', icon: '💎', color: 'text-eve-gold', format: (v: number) => v.toString() },
  { key: 'other', label: 'OTHER', icon: '◇', color: 'text-eve-text', format: (v: number) => v.toString() },
]

export function FleetSummaryCards({ data }: { data: FleetData }) {
  const getValue = (key: string) => {
    if (key === 'sui_balance') return data.sui_balance
    return data.fleet_summary[key as keyof typeof data.fleet_summary]
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const value = getValue(card.key)
        return (
          <div key={card.key} className="eve-panel p-4 text-center hover:border-eve-blue/30 transition-colors">
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className={`text-lg font-bold ${card.color}`}>
              {card.format(value as number)}
            </div>
            <div className="text-xs text-eve-text/50 tracking-wider mt-1">
              {card.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
