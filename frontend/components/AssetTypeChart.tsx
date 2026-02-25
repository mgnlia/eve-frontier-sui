'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="eve-panel px-3 py-2 text-xs">
        <p className="text-eve-blue font-bold">{label}</p>
        <p className="text-white">{payload[0].value} items</p>
      </div>
    )
  }
  return null
}

export function AssetTypeChart({ data }: { data: Array<{ type: string; count: number }> }) {
  const hasData = data.length > 0 && data.some((d) => d.count > 0)

  // Truncate long type names
  const chartData = data.map((d) => ({
    ...d,
    shortType: d.type.length > 14 ? d.type.slice(0, 13) + '…' : d.type,
  }))

  return (
    <div className="eve-panel p-4">
      <div className="eve-panel-header -mx-4 -mt-4 mb-4">
        <span className="text-eve-blue text-xs">◈</span>
        <span className="text-eve-blue text-xs font-bold tracking-widest">TOP ASSET TYPES</span>
      </div>
      {hasData ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" tick={{ fill: '#a0b4d0', fontSize: 10 }} />
            <YAxis
              type="category"
              dataKey="shortType"
              tick={{ fill: '#a0b4d0', fontSize: 10 }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 3, 3, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#00d4ff' : `rgba(0, 212, 255, ${0.8 - index * 0.07})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[250px] flex items-center justify-center text-eve-text/40 text-sm">
          No asset type data available
        </div>
      )}
    </div>
  )
}
