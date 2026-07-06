import { Radio, ChevronRight, LogOut } from 'lucide-react'
import type { AppUser } from '../types'

interface Props {
  pageTitle: string
  user: AppUser
  onLogout: () => void
}

export function TopBar({ pageTitle, user, onLogout }: Props) {
  return (
    <div className="sticky top-0 z-20 px-3 sm:px-5 py-2.5 border-b flex items-center justify-between" style={{
      background: 'color-mix(in srgb, var(--background) 95%, transparent)',
      borderColor: 'var(--border)',
      backdropFilter: 'blur(8px)',
    }}>
      <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
        <Radio size={11} style={{ color: 'var(--chart-3)' }} />
        <span className="hide-mobile">Metro Operations System</span>
        <ChevronRight size={11} className="hide-mobile" />
        <span style={{ color: 'var(--foreground)' }}>{pageTitle}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono hide-mobile" style={{ color: 'var(--secondary-foreground)' }}>
          {user.name} · {user.role} · {user.station}
        </span>
        <button className="flex items-center gap-1 px-2 py-1.5 rounded text-[11px] transition-all hover:opacity-80"
          style={{ background: 'var(--border)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
          onClick={onLogout}>
          <LogOut size={11} />
          <span className="hide-mobile">Logout</span>
        </button>
      </div>
    </div>
  )
}
