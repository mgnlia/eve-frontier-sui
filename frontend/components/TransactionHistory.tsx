'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eve-frontier-sui-backend.up.railway.app'

interface Transaction {
  digest: string
  timestamp_ms: number | null
  status: string
  gas_cost_mist: number
  gas_cost_sui: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="eve-panel px-3 py-2 text-xs">
        <p className="text-eve-text/60">{label}</p>
        <p className="text-eve-blue font-bold">{payload[0].value.toFixed(6)} SUI gas</p>
      </div>
    )
  }
  return null
}

export function TransactionHistory({ wallet }: { wallet: string }) {
  const [txs, setTxs] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`${API_URL}/transactions/${wallet}`, { timeout: 30000 })
        setTxs(res.data.transactions || [])
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [wallet])

  if (loading) {
    return (
      <div className="eve-panel p-6 text-center">
        <p className="text-eve-blue text-xs animate-pulse">LOADING TRANSACTIONS...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="eve-panel p-6">
        <p className="text-eve-red text-sm">⚠ {error}</p>
      </div>
    )
  }

  if (txs.length === 0) {
    return (
      <div className="eve-panel p-8 text-center">
        <div className="text-eve-text/30 text-3xl mb-3">◇</div>
        <p className="text-eve-text/50 text-sm">No transactions found for this wallet</p>
      </div>
    )
  }

  // Chart data — gas cost over time
  const chartData = txs
    .filter((tx) => tx.timestamp_ms)
    .sort((a, b) => (a.timestamp_ms || 0) - (b.timestamp_ms || 0))
    .map((tx) => ({
      time: tx.timestamp_ms
        ? new Date(tx.timestamp_ms).toLocaleDateString()
        : 'Unknown',
      gas: tx.gas_cost_sui,
    }))

  const successCount = txs.filter((tx) => tx.status === 'success').length
  const failCount = txs.filter((tx) => tx.status !== 'success').length

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'TOTAL TXS', value: txs.length, color: 'text-eve-blue' },
          { label: 'SUCCESS', value: successCount, color: 'text-eve-green' },
          { label: 'FAILED', value: failCount, color: failCount > 0 ? 'text-eve-red' : 'text-eve-text/40' },
        ].map((s) => (
          <div key={s.label} className="eve-panel p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-eve-text/50 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Gas chart */}
      {chartData.length > 1 && (
        <div className="eve-panel p-4">
          <div className="eve-panel-header -mx-4 -mt-4 mb-4">
            <span className="text-eve-blue text-xs">◈</span>
            <span className="text-eve-blue text-xs font-bold tracking-widest">GAS COST TIMELINE</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#a0b4d0', fontSize: 9 }} />
              <YAxis tick={{ fill: '#a0b4d0', fontSize: 9 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="gas"
                stroke="#00d4ff"
                strokeWidth={2}
                fill="url(#gasGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Transaction table */}
      <div className="eve-panel">
        <div className="eve-panel-header">
          <span className="text-eve-blue text-xs">◈</span>
          <span className="text-eve-blue text-xs font-bold tracking-widest">TRANSACTION LOG</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-eve-border">
                <th className="text-left px-4 py-2 text-eve-text/50 font-normal">DIGEST</th>
                <th className="text-left px-4 py-2 text-eve-text/50 font-normal hidden md:table-cell">TIMESTAMP</th>
                <th className="text-left px-4 py-2 text-eve-text/50 font-normal">STATUS</th>
                <th className="text-left px-4 py-2 text-eve-text/50 font-normal hidden sm:table-cell">GAS (SUI)</th>
                <th className="text-left px-4 py-2 text-eve-text/50 font-normal">LINK</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((tx, i) => (
                <tr key={tx.digest || i} className="border-b border-eve-border/40 hover:bg-eve-blue/5 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-eve-text/70">
                    {tx.digest ? `${tx.digest.slice(0, 8)}...${tx.digest.slice(-6)}` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-eve-text/60 hidden md:table-cell">
                    {tx.timestamp_ms
                      ? new Date(tx.timestamp_ms).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                      tx.status === 'success'
                        ? 'bg-eve-green/10 text-eve-green'
                        : 'bg-eve-red/10 text-eve-red'
                    }`}>
                      {tx.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-eve-text/60 hidden sm:table-cell">
                    {tx.gas_cost_sui.toFixed(6)}
                  </td>
                  <td className="px-4 py-2.5">
                    {tx.digest && (
                      <a
                        href={`https://suiexplorer.com/txblock/${tx.digest}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-eve-blue/60 hover:text-eve-blue transition-colors"
                      >
                        Explorer ↗
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
