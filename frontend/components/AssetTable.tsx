'use client'

import { useState } from 'react'

interface Asset {
  objectId: string
  type: string
  name: string
  description: string
  imageUrl: string
  version: string
  digest: string
  category: string
}

interface AssetTableProps {
  assets: Asset[]
  title: string
  emptyMsg: string
}

export function AssetTable({ assets, title, emptyMsg }: AssetTableProps) {
  const [page, setPage] = useState(0)
  const perPage = 10
  const totalPages = Math.ceil(assets.length / perPage)
  const visible = assets.slice(page * perPage, (page + 1) * perPage)

  if (assets.length === 0) {
    return (
      <div className="eve-panel p-8 text-center">
        <div className="text-eve-text/30 text-3xl mb-3">◇</div>
        <p className="text-eve-text/50 text-sm">{emptyMsg}</p>
      </div>
    )
  }

  return (
    <div className="eve-panel">
      <div className="eve-panel-header">
        <span className="text-eve-blue text-xs">◈</span>
        <span className="text-eve-blue text-xs font-bold tracking-widest">{title}</span>
        <span className="ml-auto text-xs text-eve-text/50">{assets.length} items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-eve-border">
              <th className="text-left px-4 py-2 text-eve-text/50 font-normal">OBJECT ID</th>
              <th className="text-left px-4 py-2 text-eve-text/50 font-normal">NAME</th>
              <th className="text-left px-4 py-2 text-eve-text/50 font-normal hidden md:table-cell">TYPE</th>
              <th className="text-left px-4 py-2 text-eve-text/50 font-normal hidden lg:table-cell">VERSION</th>
              <th className="text-left px-4 py-2 text-eve-text/50 font-normal">LINK</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((asset, i) => (
              <tr
                key={asset.objectId || i}
                className="border-b border-eve-border/40 hover:bg-eve-blue/5 transition-colors"
              >
                <td className="px-4 py-2.5 font-mono text-eve-text/70">
                  {asset.objectId
                    ? `${asset.objectId.slice(0, 8)}...${asset.objectId.slice(-6)}`
                    : '—'}
                </td>
                <td className="px-4 py-2.5 text-white">
                  {asset.name || (
                    <span className="text-eve-text/40 italic">Unnamed</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-eve-text/60 hidden md:table-cell max-w-[200px] truncate">
                  {asset.type?.split('::').slice(-1)[0] || '—'}
                </td>
                <td className="px-4 py-2.5 text-eve-text/50 hidden lg:table-cell">
                  {asset.version || '—'}
                </td>
                <td className="px-4 py-2.5">
                  {asset.objectId && (
                    <a
                      href={`https://suiexplorer.com/object/${asset.objectId}`}
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
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-eve-border">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-xs text-eve-text/60 hover:text-eve-blue disabled:opacity-30 transition-colors"
          >
            ← PREV
          </button>
          <span className="text-xs text-eve-text/40">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="text-xs text-eve-text/60 hover:text-eve-blue disabled:opacity-30 transition-colors"
          >
            NEXT →
          </button>
        </div>
      )}
    </div>
  )
}
