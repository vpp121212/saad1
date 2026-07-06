import { useState, type FormEvent } from 'react'
import { Train, Eye, EyeOff } from 'lucide-react'
import type { AppUser } from '../types'

const accounts = [
  { id: 'SM-001', password: '1234', name: 'Fahad Al Dosari', role: 'Station Manager', station: 'Qasr Al Hokm' },
  { id: 'OCC-001', password: '1234', name: 'Mohammed Al Omari', role: 'OCC Operator', station: 'Control Center' },
  { id: 'SEC-001', password: '1234', name: 'Khalid Al Harbi', role: 'Security', station: 'KAFD' },
  { id: 'STF-001', password: '1234', name: 'Salman Al Subaie', role: 'Maintenance', station: 'National Museum' },
]

interface Props {
  onLogin: (user: AppUser) => void
}

export function LoginPage({ onLogin }: Props) {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const acc = accounts.find(a => a.id === id && a.password === password)
    if (acc) {
      onLogin({ id: acc.id, name: acc.name, role: acc.role, station: acc.station })
    } else {
      setError('Invalid credentials. Try: SM-001 / 1234')
    }
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div className="rounded border p-6 sm:p-8 w-full max-w-sm mx-3" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(var(--primary-rgb), 0.15)' }}>
            <Train size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Operations Management</p>
          <p className="text-[11px] font-mono text-center" style={{ color: 'var(--muted-foreground)' }}>
            Riyadh Metro — Version 3.0
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Employee ID</label>
            <input type="text" placeholder="e.g. SM-001, OCC-001"
              className="w-full px-3 py-2.5 rounded text-[14px] outline-none box-border"
              style={{ background: 'var(--secondary)', border: `1px solid ${error ? '#ef4444' : 'rgba(100,140,200,0.12)'}`, color: 'var(--foreground)', minHeight: 42 }}
              value={id} onChange={e => setId(e.target.value)} />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Password</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} placeholder="Enter password"
                className="w-full px-3 py-2.5 rounded text-[14px] outline-none box-border"
                style={{ background: 'var(--secondary)', border: '1px solid rgba(100,140,200,0.12)', color: 'var(--foreground)', minHeight: 42 }}
                value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--muted-foreground)' }}
                onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-[12px] font-mono" style={{ color: '#ef4444' }}>{error}</p>}

          <button type="submit" className="w-full py-2.5 rounded text-[14px] font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--primary)', color: 'var(--background)', minHeight: 42 }}>
            Login
          </button>
        </form>

        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>Demo Accounts</p>
          <div className="text-[10px] font-mono leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {accounts.map(a => (
              <div key={a.id}><span style={{ color: 'var(--primary)' }}>{a.id}</span> / 1234 — {a.role} · {a.station}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
