import { useState } from 'react'
import type { Incident } from '../types'
import { Search, Trash2, Eye } from 'lucide-react'

interface Props {
  incidents: Incident[]
  onView: (id: string) => void
  onDelete: (id: string) => void
}

export function IncidentsList({ incidents, onView, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const filtered = incidents.filter(i => {
    if (filterStatus !== 'All' && i.status !== filterStatus) return false
    if (search && !i.id.toLowerCase().includes(search.toLowerCase()) && !i.category.toLowerCase().includes(search.toLowerCase()) && !i.station.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-0.5 rounded overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {['All', 'Open', 'In Progress', 'Closed'].map(f => (
            <button key={f} className="px-3 py-1.5 text-[11px] font-mono font-medium transition-all" style={{
              background: filterStatus === f ? 'var(--primary)' : 'var(--card)',
              color: filterStatus === f ? '#fff' : 'var(--muted-foreground)',
            }} onClick={() => setFilterStatus(f)}>{f}</button>
          ))}
        </div>
        <div className="flex-1 min-w-[160px] max-w-xs relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input className="w-full pl-8 px-3 py-1.5 rounded text-[12px] outline-none font-mono box-border"
            placeholder="Search..." style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="rounded border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(100, 140, 200, 0.08)' }}>
                {['ID', 'Type', 'Station', 'Severity', 'Status', 'Shift', 'Location', 'Date', ''].map(h => (
                  <th key={h} className="py-2.5 px-3 text-left text-[10px] font-mono uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inc => (
                <tr key={inc.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(100, 140, 200, 0.04)' }}>
                  <td className="py-2.5 px-3"><span className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{inc.id}</span></td>
                  <td className="py-2.5 px-3 max-w-[180px]">
                    <span className="text-[12px]" style={{ color: 'var(--foreground)' }}>{inc.category}</span>
                    {inc.description && <div className="text-[10px] font-mono truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{inc.description}</div>}
                  </td>
                  <td className="py-2.5 px-3"><span className="text-[12px] font-mono" style={{ color: 'var(--secondary-foreground)' }}>{inc.station}</span></td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{
                      background: inc.severity === 'Critical' ? 'rgba(239,68,68,0.15)' : inc.severity === 'High' ? 'rgba(249,115,22,0.15)' : inc.severity === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                      color: inc.severity === 'Critical' ? '#ef4444' : inc.severity === 'High' ? '#f97316' : inc.severity === 'Medium' ? '#f59e0b' : '#22c55e',
                    }}>{inc.severity}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {inc.status === 'Open' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      <span className="text-[10px] font-mono" style={{
                        color: inc.status === 'Open' ? '#ef4444' : inc.status === 'In Progress' ? '#f59e0b' : '#22c55e',
                      }}>{inc.status}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3"><span className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{inc.shift}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[11px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{inc.location}</span></td>
                  <td className="py-2.5 px-3"><span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{inc.date}</span></td>
                  <td className="py-2.5 px-3">
                    <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-white/5" style={{ color: 'var(--primary)' }} onClick={() => onView(inc.id)}><Eye size={12} /></button>
                      <button className="p-1 rounded hover:bg-white/5" style={{ color: '#ef4444' }} onClick={() => onDelete(inc.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[13px] font-mono" style={{ color: 'var(--muted-foreground)' }}>No incidents found</div>
        )}
      </div>
    </div>
  )
}
