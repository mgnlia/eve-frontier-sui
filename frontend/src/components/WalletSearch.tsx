import React, { useState } from 'react'
interface Props { onSearch: (w: string) => void }
export function WalletSearch({ onSearch }: Props) {
  const [value, setValue] = useState('')
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (value.trim().length >= 10) onSearch(value.trim()) }
  return (
    <div className="wallet-search">
      <div className="wallet-label">ENTER SUI WALLET ADDRESS</div>
      <form className="wallet-form" onSubmit={submit}>
        <input className="wallet-input" type="text" value={value} onChange={e => setValue(e.target.value)}
          placeholder="0x0000...0001" spellCheck={false} autoComplete="off" />
        <button className="wallet-btn" type="submit">SCAN ◈</button>
      </form>
    </div>
  )
}
