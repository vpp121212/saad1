import { useState } from 'react'
import type { Incident, Station } from '../types'
import { lines } from '../data/constants'
import { Search } from 'lucide-react'

interface Props {
  incidents: Incident[]
  stations: Station[]
  onNavigate: (id: string) => void
}

export function Stations({ incidents, stations: stationList, onNavigate }: Props) {
  const [search, setSearch] = useState('')
  const [filterLine, setFilterLine] = useState('All')

  const filtered = stationList.filter(s =>
    (filterLine === 'All' || s.line === filterLine) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()))
  )

  const incByStation = incidents.reduce<Record<string, Incident[]>>((acc, inc) => {
    if (!acc[inc.station]) acc[inc.station] = []
    acc[inc.station].push(inc)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-[14px] font-bold" style={{ color: 'var(--foreground)' }}>Stations</p>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 rounded overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {['All', ...lines.map(l => l.id)].map(f => (
              <button key={f} className="px-2.5 py-1.5 text-[10px] font-mono transition-all" style={{
                background: filterLine === f ? 'var(--primary)' : 'var(--card)',
                color: filterLine === f ? '#fff' : 'var(--muted-foreground)',
              }} onClick={() => setFilterLine(f)}>
                {f === 'All' ? 'All' : lines.find(l => l.id === f)?.name}
              </button>
            ))}
          </div>
          <div className="relative w-40">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input className="w-full pl-8 px-3 py-1.5 rounded text-[12px] outline-none font-mono box-border"
              placeholder="Search" style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2.5 px-4 text-left text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Station</th>
                <th className="py-2.5 px-4 text-left text-[10px] font-mono uppercase tracking-widest hidden sm:table-cell" style={{ color: 'var(--muted-foreground)' }}>Line</th>
                <th className="py-2.5 px-4 text-right text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Status</th>
                <th className="py-2.5 px-4 text-right text-[10px] font-mono uppercase tracking-widest hidden md:table-cell" style={{ color: 'var(--muted-foreground)' }}>Latest</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(st => {
                const stationIncidents = incByStation[st.name] || []
                const active = stationIncidents.filter(i => i.status !== 'Closed')
                const line = lines.find(l => l.id === st.line)
                const latest = stationIncidents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                return (
                  <tr key={st.id} className="group cursor-pointer" style={{ borderBottom: '1px solid var(--border)' }}
                    onClick={() => latest && onNavigate(latest.id)}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: line?.color || '#6b7280' }} />
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: 'var(--foreground)' }}>{st.name}</p>
                          <span className="text-[10px] font-mono sm:hidden" style={{ color: line?.color || 'var(--muted-foreground)' }}>{line?.name || st.line}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-[11px] font-mono" style={{ color: line?.color || 'var(--muted-foreground)' }}>{line?.name || st.line}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {active.length > 0 ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                            {active.length} Active
                          </span>
                        ) : stationIncidents.length > 0 ? (
                          <span className="text-[10px] font-mono" style={{ color: '#22c55e' }}>Closed</span>
                        ) : (
                          <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>—</span>
                        )}
                        <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{stationIncidents.length}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      {latest ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{latest.id}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{
                            background: latest.severity === 'Critical' ? 'rgba(239,68,68,0.12)' : latest.severity === 'High' ? 'rgba(249,115,22,0.12)' : latest.severity === 'Medium' ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)',
                            color: latest.severity === 'Critical' ? '#ef4444' : latest.severity === 'High' ? '#f97316' : latest.severity === 'Medium' ? '#f59e0b' : '#22c55e',
                          }}>{latest.severity}</span>
                          <div className="flex items-center gap-1">
                            {latest.status === 'Open' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                            <span className="text-[10px] font-mono" style={{
                              color: latest.status === 'Open' ? '#ef4444' : latest.status === 'In Progress' ? '#f59e0b' : '#22c55e',
                            }}>{latest.status}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[13px] font-mono" style={{ color: 'var(--muted-foreground)' }}>No matching stations</p>
        </div>
      )}
    </div>
  )
}
