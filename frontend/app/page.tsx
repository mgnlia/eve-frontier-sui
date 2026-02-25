'use client'

import { useState } from 'react'
import { WalletSearch } from '@/components/WalletSearch'
import { FleetDashboard } from '@/components/FleetDashboard'
import { Header } from '@/components/Header'
import { HeroStats } from '@/components/HeroStats'
import { EveWorldPanel } from '@/components/EveWorldPanel'

export default function Home() {
  const [wallet, setWallet] = useState<string>('')
  const [activeWallet, setActiveWallet] = useState<string>('')

  const handleSearch = (address: string) => {
    setActiveWallet(address)
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroStats />
        <WalletSearch
          wallet={wallet}
          setWallet={setWallet}
          onSearch={handleSearch}
        />
        {activeWallet && (
          <div className="mt-6 space-y-8">
            <FleetDashboard wallet={activeWallet} />
            {/* EVE Frontier World API live data section */}
            <div>
              <h2 className="text-eve-text/50 text-xs font-bold tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-px bg-eve-border flex-1" />
                EVE FRONTIER WORLD — LIVE GAME DATA
                <span className="w-2 h-px bg-eve-border flex-1" />
              </h2>
              <EveWorldPanel />
            </div>
          </div>
        )}
        {!activeWallet && (
          <div className="mt-16 text-center">
            <div className="inline-block eve-panel p-8 max-w-lg">
              <div className="text-eve-blue text-4xl mb-4">◈</div>
              <h2 className="text-eve-blue text-xl font-bold mb-3 text-glow">
                FLEET INTELLIGENCE SYSTEM
              </h2>
              <p className="text-eve-text text-sm leading-relaxed mb-4">
                Enter a Sui wallet address to analyze fleet composition,
                asset inventory, and on-chain transaction history.
              </p>
              <div className="text-xs text-eve-text/50 border-t border-eve-border pt-4 mt-4">
                <p>Powered by Sui JSON-RPC • EVE Frontier × Sui Hackathon 2026</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { icon: '🚀', title: 'Fleet Assets', desc: 'Ships, modules & resources tracked on Sui' },
                { icon: '📊', title: 'Analytics', desc: 'Visual breakdowns of your on-chain holdings' },
                { icon: '⛓️', title: 'Tx History', desc: 'Full transaction timeline with gas costs' },
              ].map((item) => (
                <div key={item.title} className="eve-panel p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-eve-blue text-sm font-bold mb-1">{item.title}</div>
                  <div className="text-eve-text text-xs">{item.desc}</div>
                </div>
              ))}
            </div>
            {/* Show EVE World data even without wallet */}
            <div className="mt-12 text-left max-w-4xl mx-auto">
              <h2 className="text-eve-text/50 text-xs font-bold tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-px bg-eve-border flex-1" />
                EVE FRONTIER WORLD — LIVE GAME DATA
                <span className="w-2 h-px bg-eve-border flex-1" />
              </h2>
              <EveWorldPanel />
            </div>
          </div>
        )}
      </div>
      <footer className="border-t border-eve-border mt-16 py-6 text-center text-xs text-eve-text/40">
        <p>EVE Frontier × Sui Fleet Analytics Dashboard • Built for EVE Frontier × Sui Hackathon 2026</p>
        <p className="mt-1">Sui data: Sui Mainnet JSON-RPC • Game data: EVE Frontier World API (nursery.rnd.games) • Not affiliated with CCP Games</p>
      </footer>
    </main>
  )
}
