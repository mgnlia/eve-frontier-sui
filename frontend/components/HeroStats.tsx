'use client'

export function HeroStats() {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        <span className="text-eve-blue text-glow">FLEET</span> INTELLIGENCE
      </h2>
      <p className="text-eve-text text-sm max-w-xl mx-auto">
        Real-time on-chain analytics for EVE Frontier assets on the Sui blockchain.
        Track ships, modules, resources, and transaction history.
      </p>
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="text-xs text-eve-text/40 border border-eve-border px-2 py-0.5 rounded">
          SUI MAINNET
        </span>
        <span className="text-xs text-eve-text/40 border border-eve-border px-2 py-0.5 rounded">
          EVE FRONTIER 2026
        </span>
        <span className="text-xs text-eve-blue/60 border border-eve-blue/20 px-2 py-0.5 rounded">
          HACKATHON ENTRY
        </span>
      </div>
    </div>
  )
}
