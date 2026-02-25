'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#00d4ff', '#44ff88', '#f5a623', '#a0b4d0']

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="eve-panel px-3 py-2 text-xs">
        <p className="text-eve-blue font-bold">{payload[0].name}</p>
        <p className="text-white">{payload[0].value} assets</p>
      </div>
    )
  }
  return null
}

export function CategoryChart({ data }: { data: Array<{ category: string; count: number }> }) {
  const hasData = data.some((d) => d.count > 0)

  return (
    <div className="eve-panel p-4">
      <div className="eve-panel-header -mx-4 -mt-4 mb-4">
        <span className="text-eve-blue text-xs">◈</span>
        <span className="text-eve-blue text-xs font-bold tracking-widest">FLEET COMPOSITION</span>
      </div>
      {hasData ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  opacity={0.85}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-eve-text">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[250px] flex items-center justify-center text-eve-text/40 text-sm">
          No fleet assets found
        </div>
      )}
    </div>
  )
}
