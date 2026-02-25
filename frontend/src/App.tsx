import React, { useState } from 'react'
import { WalletSearch } from './components/WalletSearch'
import { FleetDashboard } from './components/FleetDashboard'
import { EveWorldPanel } from './components/EveWorldPanel'
import { Header } from './components/Header'
import './App.css'

export default function App() {
  const [activeWallet, setActiveWallet] = useState('')

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <WalletSearch onSearch={setActiveWallet} />
        {activeWallet ? (
          <div>
            <FleetDashboard wallet={activeWallet} />
            <div className="eve-world-section">
              <div className="section-divider"><span>EVE FRONTIER WORLD — LIVE GAME DATA</span></div>
              <EveWorldPanel />
            </div>
          </div>
        ) : (
          <div className="landing">
            <div className="landing-card">
              <div className="landing-icon">◈</div>
              <h2 className="landing-title">FLEET INTELLIGENCE SYSTEM</h2>
              <p className="landing-desc">Enter a Sui wallet address to analyze fleet composition, asset inventory, and on-chain transaction history.</p>
              <p className="landing-sub">Powered by Sui JSON-RPC · EVE Frontier × Sui Hackathon 2026</p>
            </div>
            <div className="feature-grid">
              {[
                { icon: '🚀', title: 'Fleet Assets', desc: 'Ships, modules & resources tracked on Sui' },
                { icon: '📊', title: 'Kill Analytics', desc: 'Recharts visualizations of fleet data' },
                { icon: '⛓️', title: 'Tx History', desc: 'Full transaction timeline with gas costs' },
              ].map(item => (
                <div key={item.title} className="feature-card">
                  <div className="feature-icon">{item.icon}</div>
                  <div className="feature-title">{item.title}</div>
                  <div className="feature-desc">{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="eve-world-section" style={{maxWidth:900,margin:'32px auto 0',textAlign:'left'}}>
              <div className="section-divider"><span>EVE FRONTIER WORLD — LIVE GAME DATA</span></div>
              <EveWorldPanel />
            </div>
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>EVE Frontier × Sui Fleet Analytics Dashboard · EVE Frontier × Sui Hackathon 2026</p>
        <p>Sui Mainnet JSON-RPC · EVE Frontier World API (nursery.rnd.games) · Not affiliated with CCP Games</p>
      </footer>
    </div>
  )
}
