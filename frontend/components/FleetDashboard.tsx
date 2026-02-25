'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FleetSummaryCards } from './FleetSummaryCards'
import { CategoryChart } from './CategoryChart'
import { AssetTypeChart } from './AssetTypeChart'
import { AssetTable } from './AssetTable'
import { TransactionHistory } from './TransactionHistory'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eve-frontier-sui-backend.up.railway.app'

interface FleetData {
  wallet: string
  sui_balance: number
  fleet_summary: {
    total_assets: number
    ships: number
    modules: number
    resources: number
    other: number
  }
  category_breakdown: Array<{ category: string; count: number }>
  top_asset_types: Array<{ type: string; count: number }>
  ships: any[]
  modules: any[]
  resources: any[]
  other: any[]
}

type Tab = 'overview' | 'ships' | 'modules' | 'resources' | 'transactions'

export function FleetDashboard({ wallet }: { wallet: string }) {
  const [data, setData] = useState<FleetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`${API_URL}/fleet/${wallet}`, { timeout: 30000 })
        setData(res.data)
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Failed to fetch fleet data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [wallet])

  if (loading) {
    return (
      <div className="eve-panel p-8 text-center scanline">
        <div className="text-eve-blue text-2xl mb-3 animate-pulse">◈</div>
        <p className="text-eve-blue text-sm font-bold tracking-widest animate-pulse">
          SCANNING BLOCKCHAIN...
        </p>
        <p className="text-eve-text/50 text-xs mt-2">Querying Sui Mainnet for {wallet.slice(0, 10)}...</p>
        <div className="mt-4 flex justify-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 h-4 bg-eve-blue/40 rounded animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="eve-panel p-6 border-eve-red/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-eve-red">⚠</span>
          <span className="text-eve-red text-sm font-bold">SCAN FAILED</span>
        </div>
        <p className="text-eve-text text-sm">{error}</p>
        <p className="text-eve-text/50 text-xs mt-2">
          Ensure the wallet address is valid and the backend is reachable.
        </p>
      </div>
    )
  }

  if (!data) return null

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'ships', label: 'SHIPS', count: data.fleet_summary.ships },
    { id: 'modules', label: 'MODULES', count: data.fleet_summary.modules },
    { id: 'resources', label: 'RESOURCES', count: data.fleet_summary.resources },
    { id: 'transactions', label: 'TRANSACTIONS' },
  ]

  return (
    <div className="space-y-6">
      {/* Wallet info bar */}
      <div className="eve-panel px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-eve-green animate-pulse" />
          <span className="text-eve-text text-xs font-mono">
            {wallet.slice(0, 6)}...{wallet.slice(-6)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-eve-gold font-bold">
            {data.sui_balance.toFixed(4)} SUI
          </span>
          <span className="text-eve-text/50">
            {data.fleet_summary.total_assets} assets
          </span>
        </div>
      </div>

      <FleetSummaryCards data={data} />

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-eve-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold tracking-widest transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-eve-blue border-eve-blue'
                : 'text-eve-text/50 border-transparent hover:text-eve-text'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
                activeTab === tab.id ? 'bg-eve-blue/20 text-eve-blue' : 'bg-eve-border text-eve-text/50'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart data={data.category_breakdown} />
          <AssetTypeChart data={data.top_asset_types} />
        </div>
      )}

      {activeTab === 'ships' && (
        <AssetTable assets={data.ships} title="SHIPS" emptyMsg="No ships detected in this wallet" />
      )}

      {activeTab === 'modules' && (
        <AssetTable assets={data.modules} title="MODULES" emptyMsg="No modules detected in this wallet" />
      )}

      {activeTab === 'resources' && (
        <AssetTable assets={data.resources} title="RESOURCES" emptyMsg="No resources detected in this wallet" />
      )}

      {activeTab === 'transactions' && (
        <TransactionHistory wallet={wallet} />
      )}
    </div>
  )
}
