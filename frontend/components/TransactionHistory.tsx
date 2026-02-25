'use client'
import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Transaction {
  digest: string; timestamp_ms: string | null; status: string
  gas_cost_mist: number; gas_cost_sui: number
}

export function TransactionHistory({ wallet }: { wallet: string }) {
  const [txs, setTxs] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true); setError(null)
    fetch(`/api/transactions/${wallet}?limit=20`)
      .then(r => r.ok ? r.json() : r.json().then((e: {error?: string}) => Promise.reject(e.error || 'Error')))
      .then((d: { transactions: Transaction[] }) => setTxs(d.transactions || []))
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [wallet])

  if (loading) return <div className="eve-panel p-6 text-center text-eve-blue text-sm animate-pulse">Loading transactions...</div>
  if (error) return <div className="eve-panel p-6 text-eve-red text-sm">Error: {error}</div>
  if (!txs.length) return <div className="eve-panel p-6 text-eve-text/50 text-sm text-center">No transactions found for this wallet.</div>

  const chartData = txs.slice().reverse().map((tx, i) => ({
    index: i + 1,
    gas: parseFloat(tx.gas_cost_sui.toFixed(6)),
  }))

  return (
    <div className="space-y-4">
      <div className="eve-panel p-4">
        <h3 className="text-eve-blue text-xs font-bold tracking-widest mb-3">GAS COST HISTORY (SUI)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData}>
            <defs><linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.3}/><stop offset="95%" stopColor="#4fc3f7" stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="index" tick={{ fill: '#b0bec5', fontSize: 10 }}/>
            <YAxis tick={{ fill: '#b0bec5', fontSize: 10 }}/>
            <Tooltip contentStyle={{ background: '#0d1b2e', border: '1px solid #1e3a5f', color: '#b0bec5', fontSize: 11 }}/>
            <Area type="monotone" dataKey="gas" stroke="#4fc3f7" fill="url(#gasGrad)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="eve-panel overflow-hidden">
        <div className="px-4 py-2 border-b border-eve-border">
          <h3 className="text-eve-blue text-xs font-bold tracking-widest">RECENT TRANSACTIONS</h3>
        </div>
        <div className="divide-y divide-eve-border">
          {txs.map(tx => (
            <div key={tx.digest} className="px-4 py-3 flex items-center justify-between gap-2 hover:bg-eve-blue/5 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tx.status==='success'?'bg-eve-green':'bg-eve-red'}`}/>
                <a href={`https://suiexplorer.com/txblock/${tx.digest}`} target="_blank" rel="noopener noreferrer"
                  className="text-eve-blue text-xs font-mono hover:underline truncate max-w-[200px]">
                  {tx.digest?.slice(0,16)}...
                </a>
              </div>
              <div className="flex items-center gap-4 text-xs flex-shrink-0">
                <span className="text-eve-text/50">{tx.timestamp_ms ? new Date(parseInt(tx.timestamp_ms)).toLocaleString() : '—'}</span>
                <span className="text-eve-gold">{tx.gas_cost_sui.toFixed(6)} SUI</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
