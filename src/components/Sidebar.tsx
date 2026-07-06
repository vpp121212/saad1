import type { Page } from '../types'
import { Activity, Plus, Map, FileText, Users, LayoutDashboard, Train } from 'lucide-react'

interface Props {
  open: boolean
  page: Page
  onNavigate: (p: Page) => void
  onClose: () => void
  activeCount: number
}

const navItems: { page: Page; icon: typeof Activity; label: string }[] = [
  { page: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { page: 'new-incident', icon: Plus, label: 'New Incident' },
  { page: 'incidents', icon: Activity, label: 'Incidents' },
  { page: 'stations', icon: Map, label: 'Stations' },
  { page: 'reports', icon: FileText, label: 'Reports' },
  { page: 'staff', icon: Users, label: 'Staff' },
]

export function Sidebar({ open, page, onNavigate, onClose, activeCount }: Props) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={onClose} />}
      <aside
        className="fixed left-0 top-0 h-full z-40 flex flex-col border-r transition-all duration-300"
        style={{
          width: open ? 260 : 0,
          overflow: 'hidden',
          background: 'var(--background)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="px-4 py-4 border-b flex items-center gap-3 shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(var(--primary-rgb), 0.15)' }}>
            <Train size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p className="text-[13px] font-bold leading-tight" style={{ color: 'var(--foreground)', whiteSpace: 'nowrap' }}>Operations Management</p>
            <p className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>Riyadh Metro · v3.0</p>
          </div>
        </div>

        <nav className="px-2 pt-3 flex flex-col gap-0.5 flex-1">
          {navItems.map(({ page: p, icon: Icon, label }) => (
            <button
              key={p}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-left transition-all hover:bg-white/5"
              style={{
                background: page === p ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                borderLeft: `2px solid ${page === p ? 'var(--primary)' : 'transparent'}`,
              }}
              onClick={() => onNavigate(p)}
            >
              <span style={{ color: page === p ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                <Icon size={16} />
              </span>
              <span className="flex-1 text-left text-[14px]" style={{ color: page === p ? 'var(--foreground)' : 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
                {label}
              </span>
              {p === 'incidents' && activeCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--primary)', color: 'var(--background)' }}>
                  {activeCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)' }}>
              O
            </div>
            <div>
              <p className="text-[12px]" style={{ color: 'var(--foreground)', whiteSpace: 'nowrap' }}>OCC Operations</p>
              <p className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>Control Center</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
