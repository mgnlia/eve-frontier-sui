'use client'

import { useState } from 'react'

interface WalletSearchProps {
  wallet: string
  setWallet: (v: string) => void
  onSearch: (address: string) => void
}

const DEMO_WALLETS = [
  { label: 'Demo Wallet A', address: '0x0000000000000000000000000000000000000000000000000000000000000001' },
  { label: 'Demo Wallet B', address: '0x0000000000000000000000000000000000000000000000000000000000000002' },
]

export function WalletSearch({ wallet, setWallet, onSearch }: WalletSearchProps) {
  const [error, setError] = useState('')

  const isValidAddress = (addr: string) => {
    return addr.startsWith('0x') && addr.length === 66
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = wallet.trim()
    if (!trimmed) {
      setError('Please enter a wallet address')
      return
    }
    if (!isValidAddress(trimmed)) {
      setError('Invalid Sui address — must be 0x followed by 64 hex characters')
      return
    }
    setError('')
    onSearch(trimmed)
  }

  const handleDemo = (address: string) => {
    setWallet(address)
    setError('')
    onSearch(address)
  }

  return (
    <div className="eve-panel p-6 mb-8">
      <div className="eve-panel-header mb-4 -mx-6 -mt-6 px-6 pt-4 pb-3">
        <span className="text-eve-blue text-xs">◈</span>
        <span className="text-eve-blue text-xs font-bold tracking-widest">WALLET SCANNER</span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={wallet}
            onChange={(e) => {
              setWallet(e.target.value)
              setError('')
            }}
            placeholder="0x... (Sui wallet address)"
            className="w-full bg-eve-darker border border-eve-border rounded px-4 py-3 text-sm text-white placeholder-eve-text/30 focus:outline-none focus:border-eve-blue/60 transition-colors font-mono"
          />
          {error && (
            <p className="text-eve-red text-xs mt-1">{error}</p>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-eve-blue/10 border border-eve-blue/40 text-eve-blue text-sm font-bold rounded hover:bg-eve-blue/20 hover:border-eve-blue transition-all glow-blue"
        >
          SCAN →
        </button>
      </form>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-eve-text/40">Demo:</span>
        {DEMO_WALLETS.map((d) => (
          <button
            key={d.address}
            onClick={() => handleDemo(d.address)}
            className="text-xs text-eve-text/60 hover:text-eve-blue border border-eve-border hover:border-eve-blue/40 px-2 py-0.5 rounded transition-colors"
          >
            {d.label}
          </button>
        ))}
        <span className="text-xs text-eve-text/30 ml-auto">
          Queries Sui Mainnet JSON-RPC
        </span>
      </div>
    </div>
  )
}
