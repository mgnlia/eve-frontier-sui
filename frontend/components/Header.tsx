'use client'

export function Header() {
  return (
    <header className="border-b border-eve-border bg-eve-darker/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-eve-blue/50 flex items-center justify-center glow-blue">
            <span className="text-eve-blue text-lg">◈</span>
          </div>
          <div>
            <h1 className="text-eve-blue font-bold text-sm tracking-widest text-glow">
              EVE FRONTIER
            </h1>
            <p className="text-eve-text text-xs tracking-wider">
              × SUI FLEET ANALYTICS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-eve-green animate-pulse" />
            <span className="text-eve-text">MAINNET LIVE</span>
          </div>
          <a
            href="https://github.com/mgnlia/eve-frontier-sui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-eve-text/60 hover:text-eve-blue transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
      {/* Scanning line effect */}
      <div className="h-px bg-gradient-to-r from-transparent via-eve-blue/40 to-transparent" />
    </header>
  )
}
