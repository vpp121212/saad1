import { useState, useEffect } from 'react'
import { Menu, Sun, Moon, Bell } from 'lucide-react'
import type { AppUser } from '../types'

interface Props {
  onToggleSidebar: () => void
  theme: string
  onToggleTheme: () => void
  activeCount: number
  user: AppUser
  onNavigateIncidents: () => void
}

export function Header({ onToggleSidebar, theme, onToggleTheme, activeCount, onNavigateIncidents }: Props) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <header className="fixed top-0 left-0 z-30 flex items-center justify-between px-4 h-11 border-b" style={{
      background: 'color-mix(in srgb, var(--background) 97%, transparent)',
      borderColor: 'var(--border)',
      right: 0,
      backdropFilter: 'blur(8px)',
    }}>
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: 'var(--muted-foreground)' }} onClick={onToggleSidebar}>
          <Menu size={15} />
        </button>
        {activeCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(var(--primary-rgb), 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <span className="relative inline-flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'var(--primary)' }} />
              <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: 'var(--primary)' }} />
            </span>
            <span className="text-[11px] font-mono" style={{ color: 'var(--primary)' }}>{activeCount} Active</span>
          </div>
        )}
        <button className="p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: 'var(--muted-foreground)' }} onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button className="relative p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: 'var(--muted-foreground)' }} onClick={onNavigateIncidents}>
          <Bell size={14} />
          {activeCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full text-[9px] font-bold font-mono leading-none px-[3px]"
              style={{ background: '#ef4444', color: '#fff', boxShadow: '0 0 0 2px var(--background)' }}>
              {activeCount > 9 ? '9+' : activeCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[11px] font-mono" style={{ color: 'var(--secondary-foreground)' }}>
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </span>
          <span className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
            {days[time.getDay()]}, {months[time.getMonth()]} {time.getDate()}, {time.getFullYear()}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="relative inline-flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'var(--chart-3)' }} />
              <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: 'var(--chart-3)' }} />
            </span>
            <span className="text-[11px] font-mono" style={{ color: 'var(--chart-3)' }}>Connected</span>
          </div>
        </div>
      </div>
    </header>
  )
}
